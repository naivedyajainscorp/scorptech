export const initFooterManager = () => {
    setupFooterCollapses();
    setupFooterModals();
};

/* ======================================================
   MOBILE COLLAPSE SYSTEM
====================================================== */

const setupFooterCollapses = () => {
    const footerSections = document.querySelectorAll('.footer-section');

    const applyState = () => {
        const isMobile = window.innerWidth <= 767;

        footerSections.forEach(section => {
            section.classList.remove('active', 'collapsed');

            if (isMobile) {
                section.classList.add('collapsed');
            }
        });
    };

    footerSections.forEach(section => {
        const header = section.querySelector('h6');
        if (!header) return;

        header.addEventListener('click', () => {
            if (window.innerWidth > 767) return;

            section.classList.toggle('active');
            section.classList.toggle('collapsed');
        });
    });

    applyState();
    window.addEventListener('resize', applyState);
};

/* ======================================================
   MODALS SYSTEM (FRIENDLY + PROFESSIONAL)
====================================================== */

const setupFooterModals = () => {
    let modalContainer = document.getElementById('s-footer-modal-container');

    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 's-footer-modal-container';
        document.body.appendChild(modalContainer);
    }

    // Social links modal
document.querySelectorAll('.s-footer__social .s-icon').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.getAttribute('aria-label') || 'Social Media';
            showComingSoonModal(platform);
        });
    });

    // Email intercept modal
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const email = link.href.replace('mailto:', '');
            showEmailInterstitialModal(email);
        });
    });
};

/* ======================================================
   FRIENDLY COMING SOON MODAL
====================================================== */

const showComingSoonModal = (platform) => {
    const modalId = 'modal-coming-soon';

    const html = `
        <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-body text-center py-5 px-4">
                        
                        <!-- Icon -->
                        <div class="d-inline-flex justify-content-center mb-4">
                            <div class="s-icon s-icon-xl s-icon-royal">
                                <i class="fas fa-hammer"></i>
                            </div>
                        </div>

                        <h3 class="s-font-black mb-3 text-dark">
                            We're Building Something Cool
                        </h3>

                        <p class=" mb-2" style="font-size: 1rem; line-height: 1.6;">
                            Our <strong>${platform}</strong> presence is under construction.
                        </p>
                        
                        <p class=" mb-4" style="font-size: 0.95rem;">
                            But hey, you can still reach us the old-fashioned way!
                            <a href="contact.html" class="s-btn s-btn-primary-ghost mt-3 fw-bold"><i class="bi bi-chat-dots me-2"></i>drop us a line</a>.
                        </p>

                        <!-- Button -->
                        <button class="s-btn s-btn-success" data-bs-dismiss="modal">
                            <i class="fas fa-thumbs-up me-2"></i> Got It
                        </button>

                    </div>
                </div>
            </div>
        </div>
    `;

    triggerModal(modalId, html);
};

/* ======================================================
   FRIENDLY EMAIL INTERSTITIAL MODAL
====================================================== */

const showEmailInterstitialModal = (email) => {
    const modalId = 'modal-email-connect';

    const html = `
        <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-body text-center py-5 px-4">
                        
                        <!-- Icon -->
                        <div class="d-inline-flex justify-content-center mb-4">
                            <div class="s-icon s-icon-xl s-icon-info">
                                <i class="fas fa-bolt"></i>
                            </div>
                        </div>

                        <h3 class="s-text-gradient-info mb-3 ">
                            Emails Are So...<br>Last Decade
                        </h3>

                        <p class="s-text-semibold " style="font-size: 1rem; line-height: 1.6;">
                            Let's skip the inbox shuffle!
                        </p>
                        
                        <p class=" mb-4" style="font-size: 1rem;">
                            Connect with us directly!<br>it's faster, easier, and way more human.
                        </p>

                        <div class="d-flex flex-column gap-3">
                            <!-- Primary CTA -->
                            <a href="contact.html" class="s-btn s-btn-primary s-btn-glare w-100 py-2">
                                <i class="fas fa-comments me-2"></i>
                                Let's Talk Now
                            </a>

                            <!-- Dismiss Button -->
                            <button class="s-btn s-btn-secondary s-btn-glare w-100 py-2" data-bs-dismiss="modal">
                                <i class="fa-solid fa-face-frown-open me-2"></i>
                                Maybe later...
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `;

    triggerModal(modalId, html);
};

/* ======================================================
   MODAL TRIGGER HELPER
====================================================== */

const triggerModal = (id, html) => {
    const existing = document.getElementById(id);

    if (existing) {
        const inst = bootstrap.Modal.getInstance(existing);
        if (inst) inst.hide();
        existing.remove();
    }

    document
        .getElementById('s-footer-modal-container')
        .insertAdjacentHTML('beforeend', html);

    const modalEl = document.getElementById(id);
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.addEventListener('hidden.bs.modal', () => modalEl.remove());
};

