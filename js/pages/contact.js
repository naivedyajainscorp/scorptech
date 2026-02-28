
const phoneInputContact = document.getElementById("phoneContact");
const nameInputContact = document.getElementById("nameContact");
const emailInputContact = document.getElementById("emailContact");
const messageInputContact = document.getElementById("messageContact");
const formContact = document.getElementById("contact-form");
const submitBtnContact = document.getElementById("submit-contact-form");
const successMsgContact = document.getElementById("form-success-msg");
const phoneErrorMessageContact = document.getElementById("phone-error-contact");
const nameErrorMessageContact = document.getElementById("name-error-contact");
const emailErrorMessageContact = document.getElementById("email-error-contact");
const messageErrorMessageContact = document.getElementById("message-error-contact");
let submittedContact = false;

// Initialize with India as default/preferred and v25 setup
const itiContact = window.intlTelInput(phoneInputContact, {
    countrySearch: true,
    initialCountry: "in",
    preferredCountries: ["in"],
    separateDialCode: true,
    nationalMode: true,
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@25.11.3/build/js/utils.js"
});

// ✅ Search Blur & Simplified Scroll Lock
phoneInputContact.addEventListener("open:dropdown", function () {
    // 1. Prevent Search Autofocus (Delay of 10ms to catch library's internal trigger)
    setTimeout(() => {
        const searchInput = document.querySelector(".iti__search-input");
        if (searchInput) {
            searchInput.blur();
        }
    }, 10);

    // 2. Simple but Effective Scroll Lock (The "Fixed Body" Trick)
    if (window.innerWidth <= 768) {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100vw';
        document.body.setAttribute('data-scroll-offset', scrollY);
    }
});

phoneInputContact.addEventListener("close:dropdown", function () {
    if (window.innerWidth <= 768) {
        const scrollY = document.body.getAttribute('data-scroll-offset');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0'));
    }
});
// ✅ Tracker for Shake Animation (Trigger once per invalid transition)
const hasShaken = {
    name: false,
    email: false,
    phone: false,
    message: false
};

// Dual-Method Error Display
function toggleError(field, errorEl, show, fieldKey) {
    if (!errorEl) return;

    // Phone special handling (iti container)
    const itiContainer = field.closest(".iti");
    const targetEl = itiContainer || field;

    if (show) {
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
        if (itiContainer) {
            itiContainer.classList.add("is-invalid");
            itiContainer.classList.remove("is-valid");
        }

        errorEl.classList.remove("d-none");
        errorEl.style.display = "block";
        errorEl.classList.add("active-error");

        // Shake logic
        if (!hasShaken[fieldKey]) {
            field.classList.add("s-shake");
            hasShaken[fieldKey] = true;
            setTimeout(() => field.classList.remove("s-shake"), 500);
        }
    } else {
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
        if (itiContainer) {
            itiContainer.classList.remove("is-invalid");
            itiContainer.classList.add("is-valid");
        }

        errorEl.classList.add("d-none");
        errorEl.style.display = "none";
        errorEl.classList.remove("active-error");
        hasShaken[fieldKey] = false; // Reset shake tracker when it becomes valid
    }
}

// ✅ Real-Time Name Formatting and Validation
nameInputContact.addEventListener("input", function () {
    this.value = this.value.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    const isValid = /^[A-Za-zÀ-ÿ\'.\-\s]{3,}$/.test(this.value.trim());
    toggleError(this, nameErrorMessageContact, !isValid, 'name');
});

// ✅ Real-Time Email Validation
emailInputContact.addEventListener("input", function () {
    const isValid = /^\S+@\S+\.\S+$/.test(this.value.trim());
    toggleError(this, emailErrorMessageContact, !isValid, 'email');
});

// ✅ Real-Time Phone Validation (Ensure Exactly 10 Digits & Starts with 6-9)
phoneInputContact.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
    const isValid = /^[6-9]\d{9}$/.test(this.value);
    toggleError(this, phoneErrorMessageContact, !isValid, 'phone');
});

// Prevent typing non-digit characters in phone field
phoneInputContact.addEventListener("keypress", function (event) {
    if (!/\d/.test(event.key)) {
        event.preventDefault();
    }
});

// ✅ Real-Time Message Validation (At Least 10 Words)
messageInputContact.addEventListener("input", function () {
    const wordCount = this.value.trim().split(/\s+/).filter(word => word.length > 0).length;
    const isValid = wordCount >= 10;
    toggleError(this, messageErrorMessageContact, !isValid, 'message');
});

// ✅ Form Submission with Validation
formContact.addEventListener("submit", function (e) {
    e.preventDefault();

    if (submittedContact) return;

    // Trigger validation for all fields
    nameInputContact.dispatchEvent(new Event('input'));
    emailInputContact.dispatchEvent(new Event('input'));
    phoneInputContact.dispatchEvent(new Event('input'));
    messageInputContact.dispatchEvent(new Event('input'));

    const firstInvalid = formContact.querySelector(".is-invalid");
    if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
        console.log("⛔ Validation failed, form submission blocked!");
        return;
    }

    // Pass Validation — Prepare Submission
    let fullNumberContact = itiContact.getNumber().trim();
    submittedContact = true;
    submitBtnContact.disabled = true;
    submitBtnContact.innerText = "Submitting...";
    phoneInputContact.value = fullNumberContact;

    setTimeout(() => {
        formContact.submit();
    }, 100);
});

// ✅ Show Success Message After Submission
function showSuccess() {
    if (submittedContact) {
        submittedContact = false;
        formContact.reset();
        nameInputContact.classList.remove("is-invalid");
        emailInputContact.classList.remove("is-invalid");
        phoneInputContact.classList.remove("is-invalid");
        messageInputContact.classList.remove("is-invalid");

        nameErrorMessageContact.style.display = "none";
        emailErrorMessageContact.style.display = "none";
        phoneErrorMessageContact.style.display = "none";
        messageErrorMessageContact.style.display = "none";

        submitBtnContact.disabled = false;
        submitBtnContact.innerHTML = '<i class="fas fa-paper-plane"></i> Submit';

        // 🔥 Show success modal
        const modal = new bootstrap.Modal(document.getElementById('successModalContact'));
        modal.show();
    }
}

// ✅ Ensure Success Message Shows on Iframe Load (Fixing Undefined Variable Issue)
document.querySelector("iframe[name='hidden_iframe']").addEventListener("load", function () {
    if (submittedContact) showSuccess();
});


// Sapphire Hero Corporate Grid Generator - Calibrated Version
function initializeSapphireHeroGrid() {
    const sapphireGrid = document.getElementById('sapphireCorporateGrid');
    if (!sapphireGrid) return;

    // Clear existing content
    sapphireGrid.innerHTML = '';

    // Calculate grid size based on screen size
    let gridCols = 12;
    let gridRows = 10;

    if (window.innerWidth <= 576) {
        gridCols = 6;
        gridRows = 8;
    } else if (window.innerWidth <= 768) {
        gridCols = 8;
        gridRows = 9;
    } else if (window.innerWidth <= 992) {
        gridCols = 10;
        gridRows = 10;
    }

    const totalCells = gridCols * gridRows;

    // Create grid cells with enhanced visibility
    for (let i = 0; i < totalCells; i++) {
        const gridCell = document.createElement('div');
        gridCell.className = 'sapphire-grid-cell';

        // Add pulse element for shimmer effect
        const gridPulse = document.createElement('div');
        gridPulse.className = 'sapphire-grid-pulse';

        gridCell.appendChild(gridPulse);
        sapphireGrid.appendChild(gridCell);

        // Staggered animation with better distribution
        const randomDelay = Math.random() * 3;
        const pulseDelay = randomDelay + (Math.random() * 1.5);

        gridCell.style.animationDelay = `${randomDelay}s`;
        gridPulse.style.animationDelay = `${pulseDelay}s`;

        // Random hover brightness variation
        const brightness = 0.8 + (Math.random() * 0.4);
        gridCell.style.setProperty('--cell-brightness', brightness);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeSapphireHeroGrid);

// Reinitialize on window resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initializeSapphireHeroGrid, 250);
});
