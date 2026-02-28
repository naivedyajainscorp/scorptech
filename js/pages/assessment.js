/**
 * SAPPHIRE ASSESSMENT - NAVIGATION ENGINE
 * Handles multi-section questionnaire flow, progress tracking, and response collection
 */

class SapphireAssessment {
    constructor(data) {
        this.data = data;
        this.currentSection = 'profile';
        this.currentQuestion = 0;
        this.furthestSection = 0;
        this.furthestQuestion = 0;
        this.responses = {
            profile: {},
            organization: {},
            sections: {},
            bonus: {
                wishes: [],
                pain: []
            }
        };
        this.scores = {
            bySection: {},
            total: 0,
            maxPossible: 0
        };
        
        this.init();
    }

    init() {
        this.renderProfileSection();
        this.attachEventListeners();
        this.updateProgress();
        this.createHintModal();
        this.createConfirmModal();
        this.createQuestionSelector();
        this.setupNavigationWarnings();
    }

    createConfirmModal() {
        if (document.getElementById('confirm-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'confirm-modal';
        modal.className = 'assessment-hint-modal';
        modal.innerHTML = `
            <div class="assessment-hint-overlay"></div>
            <div class="assessment-hint-content">
                <div class="assessment-hint-header">
                    <i class="fas fa-exclamation-triangle" style="color: var(--s-warning);"></i>
                    <h3 id="confirm-title">Confirm Action</h3>
                    <button class="assessment-hint-close" id="confirm-close-btn" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="assessment-hint-body">
                    <p id="confirm-text"></p>
                </div>
                <div style="display: flex; gap: var(--s-space-3); padding: 0 var(--s-space-4) var(--s-space-4);">
                    <button class="s-btn s-btn-secondary" id="confirm-cancel-btn" style="flex: 1;">
                        <i class="fas fa-times"></i> Stay
                    </button>
                    <button class="s-btn s-btn-danger" id="confirm-proceed-btn" style="flex: 1;">
                        <i class="fas fa-check"></i> Continue
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showConfirmModal(title, message) {
        return new Promise((resolve) => {
            const modal = document.getElementById('confirm-modal');
            const titleEl = document.getElementById('confirm-title');
            const textEl = document.getElementById('confirm-text');
            const closeBtn = document.getElementById('confirm-close-btn');
            const cancelBtn = document.getElementById('confirm-cancel-btn');
            const proceedBtn = document.getElementById('confirm-proceed-btn');
            
            titleEl.textContent = title;
            textEl.textContent = message;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            const cleanup = () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                closeBtn.replaceWith(closeBtn.cloneNode(true));
                cancelBtn.replaceWith(cancelBtn.cloneNode(true));
                proceedBtn.replaceWith(proceedBtn.cloneNode(true));
            };
            
            document.getElementById('confirm-close-btn').addEventListener('click', () => {
                cleanup();
                resolve(false);
            });
            
            document.getElementById('confirm-cancel-btn').addEventListener('click', () => {
                cleanup();
                resolve(false);
            });
            
            document.getElementById('confirm-proceed-btn').addEventListener('click', () => {
                cleanup();
                resolve(true);
            });
        });
    }

setupNavigationWarnings() {
    // Flag to allow navigation when explicitly confirmed
    this.allowNavigation = false;
    
    // 1. Native browser dialog for close/refresh (required by browsers)
    window.addEventListener('beforeunload', (e) => {
        if (this.allowNavigation) return;
        
        // Only show warning if assessment has started
        if (typeof this.currentSection === 'number' || 
            Object.keys(this.responses.sections).length > 0) {
            const message = 'You have unsaved assessment progress. Are you sure you want to leave?';
            e.preventDefault();
            e.returnValue = message;
            return message;
        }
    });
    
    // 2. Intercept browser back/forward button
    window.addEventListener('popstate', async (e) => {
        if (this.allowNavigation) return;
        
        if (typeof this.currentSection === 'number') {
            e.preventDefault();
            
            const confirmed = await this.showConfirmModal(
                'Leave Assessment?',
                'Using browser navigation will lose all your assessment progress. Are you sure you want to leave?'
            );
            
            if (confirmed) {
                this.allowNavigation = true;
                this.responses.sections = {};
                window.history.back();
            } else {
                window.history.pushState(null, '', window.location.href);
            }
        }
    });
    
    // 3. Intercept all link clicks on the page
    document.addEventListener('click', async (e) => {
        if (this.allowNavigation) return;
        
        const link = e.target.closest('a');
        if (link && link.href && !link.target) {
            // Check if assessment is active
            if (typeof this.currentSection === 'number' || 
                Object.keys(this.responses.sections).length > 0) {
                
                // Don't intercept anchor links (#)
                if (link.getAttribute('href')?.startsWith('#')) return;
                
                e.preventDefault();
                
                const confirmed = await this.showConfirmModal(
                    'Leave Assessment?',
                    'Navigating away will lose all your assessment progress. Are you sure you want to leave?'
                );
                
                if (confirmed) {
                    this.allowNavigation = true;
                    this.responses.sections = {};
                    window.location.href = link.href;
                }
            }
        }
    }, true); // Use capture phase to catch before other handlers
    
    // 4. Intercept form submissions (if any)
    document.addEventListener('submit', async (e) => {
        if (this.allowNavigation) return;
        
        // Check if this is not our assessment forms
        const form = e.target;
        if (!form.id || (!form.id.includes('profile') && !form.id.includes('organization') && !form.id.includes('assessment'))) {
            if (typeof this.currentSection === 'number' || 
                Object.keys(this.responses.sections).length > 0) {
                
                e.preventDefault();
                
                const confirmed = await this.showConfirmModal(
                    'Leave Assessment?',
                    'Submitting this form will lose all your assessment progress. Are you sure you want to continue?'
                );
                
                if (confirmed) {
                    this.allowNavigation = true;
                    this.responses.sections = {};
                    form.submit();
                }
            }
        }
    }, true);
    
    // Push initial state to enable popstate detection
    window.history.pushState(null, '', window.location.href);
}

    createHintModal() {
        if (document.getElementById('hint-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'hint-modal';
        modal.className = 'assessment-hint-modal';
        modal.innerHTML = `
            <div class="assessment-hint-overlay"></div>
            <div class="assessment-hint-content">
                <div class="assessment-hint-header">
                    <i class="fas fa-lightbulb"></i>
                    <h3>Why we ask this</h3>
                    <button class="assessment-hint-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="assessment-hint-body">
                    <p id="hint-text"></p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.assessment-hint-close').addEventListener('click', () => this.closeHintModal());
        modal.querySelector('.assessment-hint-overlay').addEventListener('click', () => this.closeHintModal());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeHintModal();
            }
        });
    }

showHintModal(hintText) {
  const modal = document.getElementById('hint-modal');
  const hintTextEl = document.getElementById('hint-text');
  
  // Step 1: Insert HTML (instant, synchronous)
  hintTextEl.innerHTML = hintText;
  
  // Step 2: Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Step 3: Initialize accordions (should work immediately)
  if (typeof window.refreshAccordions === 'function') {
    window.refreshAccordions();
    console.log('✅ Accordions initialized');
  } else {
    console.error('❌ refreshAccordions not found!');
  }
}



    closeHintModal() {
        const modal = document.getElementById('hint-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    createQuestionSelector() {
        if (document.getElementById('question-selector')) return;
        
        const selector = document.createElement('div');
        selector.id = 'question-selector';
        selector.className = 'question-selector';
        selector.style.display = 'none';
        selector.innerHTML = `
            <button type="button" class="question-selector-trigger" id="question-selector-btn">
                <i class="fas fa-list"></i> Jump to Question
            </button>
            <div class="question-selector-dropdown" id="question-selector-dropdown"></div>
        `;
        
        document.body.appendChild(selector);
        
        document.getElementById('question-selector-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleQuestionSelector();
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.question-selector')) {
                this.closeQuestionSelector();
            }
        });
    }

    toggleQuestionSelector() {
        const dropdown = document.getElementById('question-selector-dropdown');
        const isOpen = dropdown.classList.contains('active');
        
        if (isOpen) {
            this.closeQuestionSelector();
        } else {
            this.updateQuestionSelector();
            dropdown.classList.add('active');
        }
    }

    closeQuestionSelector() {
        const dropdown = document.getElementById('question-selector-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    updateQuestionSelector() {
        if (typeof this.currentSection !== 'number') return;
        
        const dropdown = document.getElementById('question-selector-dropdown');
        if (!dropdown) return;
        
        let html = '';
        
        this.data.assessmentSections.forEach((section, sectionIdx) => {
            // Show sections up to the furthest reached section
            if (sectionIdx <= this.furthestSection) {
                let sectionHtml = '';
                let hasItems = false;
                
                section.questions.forEach((question, qIdx) => {
                    const answered = this.responses.sections[section.id]?.[question.id];
                    const isCurrent = sectionIdx === this.currentSection && qIdx === this.currentQuestion;
                    
                    // Show all questions up to furthest reached in this section
                    const isAccessible = sectionIdx < this.furthestSection || 
                                (sectionIdx === this.furthestSection && qIdx <= this.furthestQuestion);
                    
                    if (isAccessible) {
                        hasItems = true;
                        sectionHtml += `
                            <button type="button" 
                                    class="selector-question-item ${isCurrent ? 'current' : ''} ${answered ? 'answered' : ''}"
                                    data-section="${sectionIdx}"
                                    data-question="${qIdx}">
                                <i class="fas ${answered ? 'fa-check-circle' : 'fa-circle'}"></i>
                                Question ${qIdx + 1}
                            </button>
                        `;
                    }
                });
                
                if (hasItems) {
                    html += `<div class="selector-section-header">${section.name}</div>`;
                    html += sectionHtml;
                }
            }
        });
        
        dropdown.innerHTML = html || '<div style="padding: 1rem; text-align: center; color: var(--s-gray-500);">No questions visited yet</div>';
        
        dropdown.querySelectorAll('.selector-question-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sectionIdx = parseInt(e.currentTarget.dataset.section);
                const questionIdx = parseInt(e.currentTarget.dataset.question);
                this.jumpToQuestion(sectionIdx, questionIdx);
            });
        });
    }

    jumpToQuestion(sectionIdx, questionIdx) {
        this.currentSection = sectionIdx;
        this.currentQuestion = questionIdx;
        this.renderAssessmentSection(sectionIdx);
        this.loadAssessmentResponse();
        this.updateProgress();
        this.closeQuestionSelector();
    }

    updateFurthestReached() {
        if (typeof this.currentSection === 'number') {
            if (this.currentSection > this.furthestSection) {
                this.furthestSection = this.currentSection;
                this.furthestQuestion = this.currentQuestion;
            } else if (this.currentSection === this.furthestSection && this.currentQuestion > this.furthestQuestion) {
                this.furthestQuestion = this.currentQuestion;
            }
        }
    }

    scrollToQuestion() {
        // Priority order: section badge > section header > form card > question card
        const badge = document.querySelector('.assessment-section-badge');
        const sectionHeader = document.querySelector('.assessment-section-header');
        const formCard = document.querySelector('.demo-form-card');
        const questionCard = document.querySelector('.assessment-question-card');
        
        const target = badge || sectionHeader || formCard || questionCard;
        
        if (target) {
            const yOffset = -20;
            const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }
    }

    renderProfileSection() {
        const container = document.getElementById('questionnaire-container');
        const section = this.data.profileSection;

        container.innerHTML = `
            <div class="assessment-section-header mb-4">
                <div class="container-fluid px-0">
                    <div class="row justify-content-center">
                        <div class="col-12 col-lg-10 col-xl-8">
                            <h2 class="s-section-title text-center mb-3">${section.title}</h2>
                            ${section.subtitle ? `<p class="s-section-subtitle text-center mb-0">${section.subtitle}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <div class="demo-form-card shadow-sm">
                <div class="card-body p-4 p-md-5">
                    <form id="profile-form" class="assessment-form">
                        <div class="row g-4">
                            ${section.fields.map(field => this.renderField(field, true)).join('')}
                        </div>

                        <div class="assessment-form-actions d-flex justify-content-center justify-content-md-end mt-4 pt-3 border-top">
                            <button type="button" class="s-btn s-btn-primary s-btn-lg px-4 py-2" id="next-btn">
                                <span class="d-none d-sm-inline">Continue to Organization</span>
                                <span class="d-inline d-sm-none">Next</span>
                                <i class="fas fa-arrow-right ms-2"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.refreshFormEnhancements();
        setTimeout(() => this.scrollToQuestion(), 100);
    }

    renderOrganizationSection() {
        const container = document.getElementById('questionnaire-container');
        const section = this.data.organizationSection;

        container.innerHTML = `
            <div class="assessment-section-header mb-4">
                <div class="container-fluid px-0">
                    <div class="row justify-content-center">
                        <div class="col-12 col-lg-10 col-xl-8">
                            <h2 class="s-section-title text-center mb-3">${section.title}</h2>
                            ${section.subtitle ? `<p class="s-section-subtitle text-center mb-0">${section.subtitle}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <div class="demo-form-card shadow-sm">
                <div class="card-body p-4 p-md-5">
                    <form id="organization-form" class="assessment-form">
                        <div class="row g-4">
                            ${section.fields.map(field => this.renderField(field, true)).join('')}
                        </div>

                        <div class="assessment-form-actions d-flex flex-column flex-sm-row justify-content-center justify-content-md-between align-items-center gap-3 mt-4 pt-3 border-top">
                            <button type="button" class="s-btn s-btn-outline-secondary s-btn-lg order-2 order-sm-1" id="back-btn">
                                <i class="fas fa-arrow-left me-2"></i>
                                <span class="d-none d-sm-inline">Back to Profile</span>
                                <span class="d-inline d-sm-none">Back</span>
                            </button>
                            <button type="button" class="s-btn s-btn-success s-btn-lg order-1 order-sm-2 px-4 py-2" id="next-btn">
                                <span>Start Assessment</span>
                                <i class="fas fa-arrow-right ms-2"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.refreshFormEnhancements();
        setTimeout(() => this.scrollToQuestion(), 100);
    }

    renderAssessmentSection(sectionIndex) {
        const container = document.getElementById('questionnaire-container');
        const section = this.data.assessmentSections[sectionIndex];
        const question = section.questions[this.currentQuestion];

        container.innerHTML = `
            <div class="assessment-section-badge mb-4" style="background: ${section.gradient}; border-left: 4px solid ${section.color}">
                <div class="container-fluid px-0">
                    <div class="row align-items-center g-3">
                        <div class="col-auto">
                            <div class="s-icon s-icon-md s-icon-white">
                                <i class="fas ${section.icon}"></i>
                            </div>
                        </div>
                        <div class="col">
                            <div class="assessment-section-info">
                                <h2 class="assessment-section-name mb-1">${section.name}</h2>
                                ${section.subtitle ? `<p class="assessment-section-subtitle mb-0">${section.subtitle}</p>` : ''}
                            </div>
                        </div>
                        <div class="col-auto">
                            <div class="assessment-question-counter badge bg-light text-dark fs-6">
                                <i class="fas fa-list-ol me-2"></i>${this.currentQuestion + 1} / ${section.questions.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="assessment-question-card shadow-sm">
                <div class="card-body p-4 p-md-5">
                    ${this.renderQuestion(question)}
                </div>
            </div>

            <div class="assessment-form-actions d-flex flex-column flex-sm-row justify-content-center justify-content-md-between align-items-center gap-3 mt-4">
                <button type="button" class="s-btn s-btn-secondary s-btn-lg order-2 order-sm-1" id="back-btn">
                    <i class="fas fa-arrow-left me-2"></i>
                    <span class="d-none d-sm-inline">${this.currentQuestion > 0 ? 'Previous Question' : 'Back to Organization'}</span>
                    <span class="d-inline d-sm-none">Back</span>
                </button>
                <button type="button" class="s-btn s-btn-primary s-btn-lg order-1 order-sm-2 px-4 py-2" id="next-btn" disabled>
                    <span>${this.currentQuestion < section.questions.length - 1 ? 'Next Question' : 'Next Section'}</span>
                    <i class="fas fa-arrow-right ms-2"></i>
                </button>
            </div>
        `;

        this.updateFurthestReached();
        this.attachQuestionListeners(question);
        this.attachHintListener(question);
        this.updateQuestionSelector();

        setTimeout(() => this.scrollToQuestion(), 100);
    }

    renderBonusSection(bonusType) {
        const container = document.getElementById('questionnaire-container');
        const section = this.data.bonusSections[bonusType];

        container.innerHTML = `
            <div class="assessment-section-badge mb-4" style="background: ${section.color}; border-left: 4px solid ${section.color};">
                <div class="container-fluid px-0">
                    <div class="row align-items-center g-3">
                        <div class="col-auto">
                            <div class="s-icon s-icon-md s-icon-white">
                                <i class="fas ${section.icon}"></i>
                            </div>
                        </div>
                        <div class="col">
                            <div class="assessment-section-info">
                                <h2 class="assessment-section-name mb-1">${section.title}</h2>
                                ${section.subtitle ? `<p class="assessment-section-subtitle mb-0">${section.subtitle}</p>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="assessment-question-card shadow-sm">
                <div class="card-body p-4 p-md-5">
                    <div class="assessment-options-vertical">
                        ${section.statements.map((stmt, idx) => `
                            <label class="checkbox-option">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    name="${bonusType}"
                                    id="${bonusType}_${idx}"
                                    value="${stmt.value}"
                                >
                                <span class="checkbox-label">
                                    <strong>${stmt.label}</strong>
                                </span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="assessment-form-actions d-flex flex-column flex-sm-row justify-content-center justify-content-md-between align-items-center gap-3 mt-4">
                <button type="button" class="s-btn s-btn-secondary s-btn-lg order-2 order-sm-1" id="back-btn">
                    <i class="fas fa-arrow-left me-2"></i>
                    <span class="d-none d-sm-inline">Back to Questions</span>
                    <span class="d-inline d-sm-none">Back</span>
                </button>
                <button type="button" class="s-btn s-btn-primary s-btn-lg order-1 order-sm-2 px-4 py-2" id="next-btn">
                    <span>${bonusType === 'wishes' ? 'Continue to Pain Points' : 'Complete Assessment'}</span>
                    <i class="fas fa-arrow-right ms-2"></i>
                </button>
            </div>
        `;

        document.getElementById('next-btn').disabled = false;
        this.loadBonusResponse(bonusType);
        setTimeout(() => this.scrollToQuestion(), 100);
    }


    renderField(field, useGrid = false) {
        const icon = field.icon ? `<div class="s-icon s-icon-sm s-icon-primary"><i class="fas ${field.icon}"></i></div>` : '';
        const required = field.required ? '<span class="s-text-danger">*</span>' : '';
        
        switch(field.type) {
            case 'text':
                return `
                    <div class="mb-3">
                        <label for="${field.id}" class="form-label">
                            ${icon} ${field.label} ${required}
                        </label>
                        <input 
                            type="text" 
                            id="${field.id}" 
                            name="${field.id}"
                            class="form-control"
                            placeholder="${field.placeholder || ''}"
                            ${field.required ? 'required' : ''}
                        >
                    </div>
                `;
                
            case 'radio':
                const gridClass = useGrid ? 'radio-options-grid' : 'assessment-options-vertical';
                return `
                    <div class="mb-3">
                        <label class="form-label">
                            ${icon} ${field.label} ${required}
                        </label>
                        ${field.subtitle ? `<p class="text-muted small mb-2">${field.subtitle}</p>` : ''}
                        <div class="${gridClass}">
                            ${field.options.map(opt => `
                                <label class="form-check-label radio-option" for="${field.id}_${opt.value}">
                                    <input 
                                        class="form-check-input"
                                        type="radio" 
                                        name="${field.id}" 
                                        id="${field.id}_${opt.value}"
                                        value="${opt.value}"
                                        ${field.required ? 'required' : ''}
                                    >
                                    <span>${opt.label}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `;
                
            case 'select':
                return `
                    <div class="mb-3">
                        <label for="${field.id}" class="form-label">
                            ${icon} ${field.label} ${required}
                        </label>
                        <select 
                            id="${field.id}" 
                            name="${field.id}"
                            class="form-select"
                            ${field.required ? 'required' : ''}
                        >
                            <option value="">${field.placeholder || 'Select...'}</option>
                            ${field.options.map(opt => `
                                <option value="${opt.value}">${opt.label}</option>
                            `).join('')}
                        </select>
                    </div>
                `;
                
            default:
                return '';
        }
    }

    renderQuestion(question) {
        const icon = question.icon ? `<div class="s-icon s-icon-md s-icon-primary"><i class="fas ${question.icon}"></i></div>` : '';
        
            // ✅ AFTER (no escaping, just store ID)
            const hintButton = question.hint ? `
            <button type="button" class="assessment-hint-trigger" 
                data-qid="${question.id}" 
                title="Why we ask this">
                <i class="fas fa-question-circle"></i>
            </button>
            ` : '';

        
        switch(question.type) {
            case 'radio':
                return `
                    <div class="assessment-question-header">
                        <div class="assessment-question-top">
                            ${icon}
                            <h3 class="assessment-question-text">${question.text}</h3>
                            ${hintButton}
                        </div>
                        ${question.subtitle ? `<p class="assessment-question-subtitle">${question.subtitle}</p>` : ''}
                    </div>
                    <div class="assessment-options-vertical">
                        ${question.options.map((opt, idx) => `
                            <label class="form-check-label radio-option" for="${question.id}_opt${idx}">
                                <input 
                                    class="form-check-input"
                                    type="radio" 
                                    name="${question.id}" 
                                    id="${question.id}_opt${idx}"
                                    value="${opt.value}"
                                    data-score="${opt.score || 0}"
                                    data-statement="${this.escapeHtml(opt.statement || '')}"
                                >
                                <span>
                                    <strong>${opt.label}</strong>
                                    ${opt.statement ? `<span class="option-statement">${opt.statement}</span>` : ''}
                                </span>
                            </label>
                        `).join('')}
                    </div>
                `;
                
            case 'checkbox':
                return `
                    <div class="assessment-question-header">
                        <div class="assessment-question-top">
                            ${icon}
                            <h3 class="assessment-question-text">${question.text}</h3>
                            ${hintButton}
                        </div>
                        ${question.subtitle ? `<p class="assessment-question-subtitle">${question.subtitle}</p>` : ''}
                        ${question.description ? `<p class="assessment-question-description">${question.description}</p>` : ''}
                    </div>
                    <div class="assessment-options-vertical">
                        ${question.options.map((opt, idx) => `
                            <label class="checkbox-option">
                                <input 
                                    class="form-check-input"
                                    type="checkbox" 
                                    name="${question.id}" 
                                    id="${question.id}_opt${idx}"
                                    value="${opt.value}"
                                    data-score="${opt.score || 0}"
                                    data-statement="${this.escapeHtml(opt.statement || '')}"
                                >
                                <span class="checkbox-label">
                                    <strong>${opt.label}</strong>
                                    ${opt.statement ? `<span class="option-statement">${opt.statement}</span>` : ''}
                                </span>
                            </label>
                        `).join('')}
                    </div>
                `;
                
            default:
                return '<p>Unsupported question type</p>';
        }
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'next-btn' || e.target.closest('#next-btn')) {
                this.handleNext();
            }
            if (e.target.id === 'back-btn' || e.target.closest('#back-btn')) {
                this.handleBack();
            }
        });
    }

    attachQuestionListeners(question) {
        const inputs = document.querySelectorAll(`input[name="${question.id}"]`);
        const nextBtn = document.getElementById('next-btn');
        
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                if (question.type === 'radio') {
                    nextBtn.disabled = false;
                } else if (question.type === 'checkbox') {
                    const checked = document.querySelectorAll(`input[name="${question.id}"]:checked`);
                    nextBtn.disabled = checked.length === 0;
                }
            });
        });
    }

            attachHintListener(question) {
            const hintBtn = document.querySelector('.assessment-hint-trigger');
            if (hintBtn) {
                hintBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // ✅ Get hint directly from question object (not from dataset)
                const hintText = question.hint || 
                                `[TEST MODE]\n\nQuestion ID: ${question.id}\n\n(No hint text defined for this question yet)`;
                
                this.showHintModal(hintText);
                });
            }
            }


    refreshFormEnhancements() {
        if (typeof window.refreshForms === 'function') {
            window.refreshForms();
        } else if (typeof window.FormEnhancements !== 'undefined') {
            window.FormEnhancements.refresh();
        }
    }

handleNext() {
    if (this.currentSection === 'profile') {
        if (this.validateAndSaveProfile()) {
            this.currentSection = 'organization';
            this.renderOrganizationSection();
            this.updateProgress();
        }
    } 
    else if (this.currentSection === 'organization') {
        if (this.validateAndSaveOrganization()) {
            this.currentSection = 0;
            this.currentQuestion = 0;
            this.renderAssessmentSection(0);
            this.updateProgress();
            const progressBar = document.querySelector('.assessment-progress-container');
            const selector = document.getElementById('question-selector');
            if (progressBar) progressBar.style.display = 'block';
            if (selector) selector.style.display = 'block';
        }
    } 
    else if (typeof this.currentSection === 'number') {
        this.saveAssessmentResponse();
        
        const section = this.data.assessmentSections[this.currentSection];
        
        if (this.currentQuestion < section.questions.length - 1) {
            // More questions in current section
            this.currentQuestion++;
            this.renderAssessmentSection(this.currentSection);
            this.updateProgress();
        } 
        else if (this.currentSection < this.data.assessmentSections.length - 1) {
            // Move to next assessment section
            this.currentSection++;
            this.currentQuestion = 0;
            this.renderAssessmentSection(this.currentSection);
            this.updateProgress();
        } 
        else {
            // ✅ Finished all assessment sections (s5_q12) → go to wishes
            this.currentSection = 'wishes';
            this.renderBonusSection('wishes');
        }
    }
    else if (this.currentSection === 'wishes') {
        // ✅ Save wishes responses and move to pain
        this.saveBonusResponse('wishes');
        this.currentSection = 'pain';
        this.renderBonusSection('pain');
    }
    else if (this.currentSection === 'pain') {
        // ✅ Save pain responses and complete assessment
        this.saveBonusResponse('pain');
        this.completeAssessment();
    }
}


    async handleBack() {
        if (this.currentSection === 'organization') {
            this.currentSection = 'profile';
            this.renderProfileSection();
            this.loadProfileData();
            this.updateProgress();
        } 
        else if (typeof this.currentSection === 'number') {
            if (this.currentQuestion > 0) {
                this.currentQuestion--;
                this.renderAssessmentSection(this.currentSection);
                this.loadAssessmentResponse();
                this.updateProgress();
            } else if (this.currentSection > 0) {
                this.currentSection--;
                const prevSection = this.data.assessmentSections[this.currentSection];
                this.currentQuestion = prevSection.questions.length - 1;
                this.renderAssessmentSection(this.currentSection);
                this.loadAssessmentResponse();
                this.updateProgress();
            } else {
                // Going back from first assessment question to organization
                const confirmed = await this.showConfirmModal(
                    'Clear Assessment Progress?',
                    'Going back will clear all your assessment progress. Are you sure you want to continue?'
                );
                
                if (confirmed) {
                    // Clear assessment responses
                    this.responses.sections = {};
                    this.furthestSection = 0;
                    this.furthestQuestion = 0;
                    this.currentSection = 'organization';
                    this.renderOrganizationSection();
                    this.loadOrganizationData();
                    this.updateProgress();
                    const progressBar = document.querySelector('.assessment-progress-container');
                    const selector = document.getElementById('question-selector');
                    if (progressBar) progressBar.style.display = 'none';
                    if (selector) selector.style.display = 'none';
                }
            }
        }
        else if (this.currentSection === 'wishes') {
            // ✅ Go back from wishes to last assessment question (s5_q12)
            this.currentSection = this.data.assessmentSections.length - 1;
            const section = this.data.assessmentSections[this.currentSection];
            this.currentQuestion = section.questions.length - 1;
            this.renderAssessmentSection(this.currentSection);
            this.loadAssessmentResponse();
            this.updateProgress();
        }
        else if (this.currentSection === 'pain') {
            // ✅ Go back from pain to wishes
            this.saveBonusResponse('pain');
            this.currentSection = 'wishes';
            this.renderBonusSection('wishes');
        }
    }


        saveBonusResponse(bonusType) {
        const checkboxes = document.querySelectorAll(`input[name="${bonusType}"]:checked`);
        const selectedValues = Array.from(checkboxes).map(cb => cb.value);
        this.responses.bonus[bonusType] = selectedValues;
    }

    loadBonusResponse(bonusType) {
        const savedResponses = this.responses.bonus[bonusType];
        if (savedResponses && savedResponses.length > 0) {
            savedResponses.forEach(value => {
                const checkbox = document.querySelector(`input[name="${bonusType}"][value="${value}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    }


    validateAndSaveProfile() {
        const form = document.getElementById('profile-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }
        
        const formData = new FormData(form);
        formData.forEach((value, key) => {
            this.responses.profile[key] = value;
        });
        
        return true;
    }

    validateAndSaveOrganization() {
        const form = document.getElementById('organization-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }
        
        const formData = new FormData(form);
        formData.forEach((value, key) => {
            this.responses.organization[key] = value;
        });
        
        return true;
    }

    saveAssessmentResponse() {
        const section = this.data.assessmentSections[this.currentSection];
        const question = section.questions[this.currentQuestion];
        
        if (!this.responses.sections[section.id]) {
            this.responses.sections[section.id] = {};
        }
        
        if (question.type === 'radio') {
            const selected = document.querySelector(`input[name="${question.id}"]:checked`);
            if (selected) {
                this.responses.sections[section.id][question.id] = {
                    value: selected.value,
                    score: parseInt(selected.dataset.score || 0),
                    statement: selected.dataset.statement || ''
                };
            }
        } else if (question.type === 'checkbox') {
            const checked = document.querySelectorAll(`input[name="${question.id}"]:checked`);
            const values = [];
            let totalScore = 0;
            
            checked.forEach(input => {
                values.push({
                    value: input.value,
                    score: parseInt(input.dataset.score || 0),
                    statement: input.dataset.statement || ''
                });
                totalScore += parseInt(input.dataset.score || 0);
            });
            
            this.responses.sections[section.id][question.id] = {
                values: values,
                score: totalScore
            };
        }
        
        // Update progress after saving response
        this.updateProgress();
    }

    loadProfileData() {
        Object.keys(this.responses.profile).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'radio') {
                    const radio = document.querySelector(`input[name="${key}"][value="${this.responses.profile[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    input.value = this.responses.profile[key];
                }
            }
        });
    }

    loadOrganizationData() {
        Object.keys(this.responses.organization).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'radio') {
                    const radio = document.querySelector(`input[name="${key}"][value="${this.responses.organization[key]}"]`);
                    if (radio) radio.checked = true;
                } else if (input.tagName === 'SELECT') {
                    input.value = this.responses.organization[key];
                } else {
                    input.value = this.responses.organization[key];
                }
            }
        });
    }

    loadAssessmentResponse() {
        const section = this.data.assessmentSections[this.currentSection];
        const question = section.questions[this.currentQuestion];
        const response = this.responses.sections[section.id]?.[question.id];
        
        if (!response) return;
        
        if (question.type === 'radio' && response.value) {
            const radio = document.querySelector(`input[name="${question.id}"][value="${response.value}"]`);
            if (radio) {
                radio.checked = true;
                document.getElementById('next-btn').disabled = false;
            }
        } else if (question.type === 'checkbox' && response.values) {
            response.values.forEach(item => {
                const checkbox = document.querySelector(`input[name="${question.id}"][value="${item.value}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
            document.getElementById('next-btn').disabled = false;
        }
    }

    updateProgress() {
        if (typeof this.currentSection !== 'number') {
            return;
        }
        
        const totalQuestions = this.data.assessmentSections.reduce((sum, section) => sum + section.questions.length, 0);
        
        // Count only answered questions
        let answeredCount = 0;
        this.data.assessmentSections.forEach(section => {
            const sectionResponses = this.responses.sections[section.id] || {};
            answeredCount += Object.keys(sectionResponses).length;
        });
        
        const percentage = Math.round((answeredCount / totalQuestions) * 100);
        
        const progressBar = document.querySelector('.assessment-progress-fill');
        const progressText = document.querySelector('.assessment-progress-text');
        
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${percentage}% Complete`;
    }

completeAssessment() {
    this.calculateScores();
    
    localStorage.setItem('sapphire_assessment_responses', JSON.stringify(this.responses));
    localStorage.setItem('sapphire_assessment_scores', JSON.stringify(this.scores));

    this.allowNavigation = true;
    
    window.location.href = 'assessment-report.html';
}

    calculateScores() {
        let totalScore = 0;
        let maxPossible = 0;
        
        this.data.assessmentSections.forEach(section => {
            let sectionScore = 0;
            let sectionMax = 0;
            
            section.questions.forEach(question => {
                const response = this.responses.sections[section.id]?.[question.id];
                
                if (question.type === 'radio') {
                    if (response) {
                        sectionScore += response.score;
                    }
                    const maxOption = Math.max(...question.options.map(opt => opt.score || 0));
                    sectionMax += maxOption;
                } else if (question.type === 'checkbox') {
                    if (response) {
                        sectionScore += response.score;
                    }
                    const sumScores = question.options.reduce((sum, opt) => sum + (opt.score || 0), 0);
                    sectionMax += sumScores;
                }
            });
            
            this.scores.bySection[section.id] = {
                name: section.name,
                score: sectionScore,
                maxPossible: sectionMax,
                percentage: sectionMax > 0 ? Math.round((sectionScore / sectionMax) * 100) : 0,
                color: section.color,
                icon: section.icon
            };
            
            totalScore += sectionScore;
            maxPossible += sectionMax;
        });
        
        this.scores.total = totalScore;
        this.scores.maxPossible = maxPossible;
        this.scores.percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof assessmentData !== 'undefined') {
        window.assessmentApp = new SapphireAssessment(assessmentData);
        const progressBar = document.querySelector('.assessment-progress-container');
        if (progressBar) progressBar.style.display = 'none';
    } else {
        console.error('Assessment data not loaded');
    }
});
