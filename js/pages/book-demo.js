// 🔥 Function to Add Other Industry
document.getElementById("addOtherIndustry").addEventListener("click", function () {
  const container = document.getElementById("otherIndustryContainer");
  const div = document.createElement("div");
  div.className = "other-industry-row mb-2";
  div.innerHTML = `
  <div class="d-flex input-group s-valid-wrapper" style="flex-flow:row;">
    <input type="text" class="form-control text-capitalize otherIndustry" name="otherIndustry[]" placeholder="Specify other industry">
    <button type="button" class="s-btn s-btn-xs s-btn-danger remove-field" title="Remove"><i class="fas fa-times"></i></button>
  </div>
  <div class="custom-error-message text-danger mt-1 d-none empty-error">Please enter a valid industry name.</div>
  <div class="custom-error-message text-danger mt-1 d-none duplicate-error">Duplicate industry name detected!</div>
  `;
  container.appendChild(div);
});

document.getElementById("addFranchise").addEventListener("click", function () {
  const container = document.getElementById("franchiseContainer");
  const div = document.createElement("div");
  div.className = "franchise-row mb-2";
  div.innerHTML = `
  <div class="d-flex input-group s-valid-wrapper" style="flex-flow:row;">
    <input type="text" class="form-control text-capitalize franchiseBrand" name="franchiseBrand[]" placeholder="Enter brand name">
    <button type="button" class="s-btn s-btn-xs s-btn-danger remove-field" title="Remove"><i class="fas fa-times"></i></button>
  </div>
  <div class="custom-error-message text-danger mt-1 d-none empty-error">Please enter a valid franchise name.</div>
  <div class="custom-error-message text-danger mt-1 d-none duplicate-error">Duplicate franchise name detected!</div>
  `;
  container.appendChild(div);
});


// 🎯 Show/hide the "Other" framework input dynamically
const softwareRadios = document.querySelectorAll('input[name="asset_software"]');
const otherFrameworkInput = document.getElementById("otherFrameworkInput");
const frameworkOtherText = document.getElementById("frameworkOtherText");
const frameworkOtherError = document.getElementById("frameworkOtherError");

softwareRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "Other" && radio.checked) {
      otherFrameworkInput.style.display = "block";
    } else {
      otherFrameworkInput.style.display = "none";
      if (frameworkOtherText) {
        frameworkOtherText.classList.remove("is-invalid");
        frameworkOtherText.classList.remove("is-valid");
      }
      if (frameworkOtherError) {
        frameworkOtherError.classList.add("d-none");
        frameworkOtherError.style.display = "none";
      }
    }
  });
});



// ********************************************
// 📞 Initialize intl-tel-input (Phone Dropdown)
// ********************************************

const phoneInputDemo = document.querySelector("#phone-demo");
const iti = window.intlTelInput(phoneInputDemo, {
  // Country options
  initialCountry: "in",
  preferredCountries: ["in", "ae"],
  separateDialCode: true,
  nationalMode: true,
  formatAsYouType: true,
  countrySearch: true,
  strictMode: true,
  useFullscreenPopup: false,
  validationNumberTypes: ["MOBILE"],
  i18n: {
    searchPlaceholder: "Search countries"
  },

  // Utils for validation
  utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@25.11.3/build/js/utils.js"
});

function getFullPhoneNumber() {
  return iti.getNumber();
}

// ********************************************
// 🗺️ Map Initialization & Location Fetching
// ********************************************

document.addEventListener("DOMContentLoaded", function () {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;
  const map = L.map("map").setView([26.9124, 75.7873], 12); // Default: Jaipur, Rajasthan, India
  map.removeControl(map.attributionControl);
  // Load free OpenStreetMap tiles
  // Clean light base layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  let marker = L.marker([28.6139, 77.2090], { draggable: true }).addTo(map);
  function updateLocation(lat, lng) {
    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;

    // 🔥 Fetch readable address (Reverse Geocoding)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        if (data.display_name) {
          document.getElementById("location").value = data.display_name; //  Show correct address
        } else {
          document.getElementById("location").value = "Location set"; //  Fallback text
        }
      })
      .catch(() => {
        document.getElementById("location").value = "Location set"; //  Error fallback
      });
  }
  // 🔹 Update when marker is dragged
  marker.on("dragend", function () {
    const position = marker.getLatLng();
    updateLocation(position.lat, position.lng);
  });
  // 🔹 Update when map is clicked
  map.on("click", function (event) {
    marker.setLatLng(event.latlng);
    updateLocation(event.latlng.lat, event.latlng.lng);
  });

  // 📍"Get My Location" button
  document.getElementById("get-location").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent unintended validation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log("Location fetched:", position.coords);

          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          map.setView([lat, lng], 15);
          marker.setLatLng([lat, lng]);
          updateLocation(lat, lng);

          document.getElementById("location").dispatchEvent(new Event("change", { bubbles: false }));
          document.getElementById("demoForm").noValidate = true;
        },
        function (error) {
          console.warn("Geolocation Error:", error.message);
          alert("⚠️ Unable to fetch location. Please check GPS settings or use manual selection.");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert("Unfortunately, your browser does not support Geolocation.");
    }
  });
});

// ********************************************
// 📍 Pincode Autofill: District, State, Country
// Using India Post API
// ********************************************

// ********************************************
// 📍 Pincode Autofill: District, State, Country
// Using India Post API
// ********************************************

const pincodeInput = document.getElementById("pincode");

// Debounce function to avoid too many API calls
let debounceTimer;

if (pincodeInput) {
  pincodeInput.addEventListener("input", function () {
    // Only allow numbers, max 6 digits
    this.value = this.value.replace(/\D/g, "").slice(0, 6);

    const pin = this.value.trim();
    const district = document.getElementById("district");
    const state = document.getElementById("state");
    const country = document.getElementById("country");

    // Clear previous validation
    toggleError(this, null, false, 'pincode');
    toggleError(district, null, false, 'district');
    toggleError(state, null, false, 'state');
    toggleError(country, null, false, 'country');

    // Only fetch when we have exactly 6 digits
    if (pin.length === 6) {
      // Clear previous debounce
      clearTimeout(debounceTimer);

      // Debounce API call (wait 500ms after user stops typing)
      debounceTimer = setTimeout(() => {
        fetchPincodeData(pin, district, state, country, this);
      }, 500);
    } else {
      // Clear fields if pincode is incomplete
      district.value = "";
      state.value = "";
      country.value = "";
    }
  });

  pincodeInput.addEventListener("blur", function () {
    const pin = this.value.trim();
    const district = document.getElementById("district");
    const state = document.getElementById("state");
    const country = document.getElementById("country");

    if (pin.length !== 6 || !district.value) {
      toggleError(this, null, true, 'pincode');
      if (!district.value && pin.length === 6) {
        toggleError(district, null, true, 'district');
        toggleError(state, null, true, 'state');
        toggleError(country, null, true, 'country');
      }
    }
  });
}

// Fetch data from India Post API
async function fetchPincodeData(pincode, districtEl, stateEl, countryEl, pincodeEl) {
  const loader = document.getElementById("pincode-loader");

  try {
    // ✅ Show loader
    if (loader) loader.classList.add("active");
    pincodeEl.style.paddingRight = "3rem"; // Make space for spinner

    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();

    // Check if API returned success
    if (data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
      const postOffice = data[0].PostOffice[0];

      districtEl.value = postOffice.District || "";
      stateEl.value = postOffice.State || "";
      countryEl.value = postOffice.Country || "India";

      toggleError(pincodeEl, null, false, 'pincode');
      toggleError(districtEl, null, false, 'district');
      toggleError(stateEl, null, false, 'state');
      toggleError(countryEl, null, false, 'country');
    } else {
      // Invalid pincode
      districtEl.value = "";
      stateEl.value = "";
      countryEl.value = "";
      toggleError(pincodeEl, null, true, 'pincode');
      toggleError(districtEl, null, true, 'district');
      toggleError(stateEl, null, true, 'state');
      toggleError(countryEl, null, true, 'country');
    }
  } catch (error) {
    console.error("Pincode API Error:", error);
    // On error, mark as invalid
    districtEl.value = "";
    stateEl.value = "";
    countryEl.value = "";
    toggleError(pincodeEl, null, true, 'pincode');
  } finally {
    // ✅ Hide loader
    if (loader) loader.classList.remove("active");
    pincodeEl.style.paddingRight = "1.5rem"; // Reset padding
  }
}

// ********************************************
// ➕ Add/Remove Fields for Other Industry & Franchise
// ********************************************

let industrySet = new Set();
let franchiseSet = new Set();
// ✅ Normalize function for case and space-insensitive comparison
function normalizeString(str) {
  return str.toLowerCase().replace(/\s+/g, "");
}

document.addEventListener("input", function (event) {
  if (event.target.classList.contains("otherIndustry") || event.target.classList.contains("franchiseBrand")) {
    const isOtherIndustry = event.target.classList.contains("otherIndustry");
    const selector = isOtherIndustry ? ".otherIndustry" : ".franchiseBrand";
    const inputs = Array.from(document.querySelectorAll(selector));

    const seen = new Set();
    inputs.forEach(input => {
      const value = normalizeString(input.value.trim());
      const row = input.closest(".other-industry-row, .franchise-row");
      const emptyError = row?.querySelector(".empty-error");
      const duplicateError = row?.querySelector(".duplicate-error");

      if (value === "") {
        toggleError(input, emptyError, true);
        if (duplicateError) {
          duplicateError.classList.add("d-none");
          duplicateError.style.display = "none";
        }
      } else if (seen.has(value)) {
        toggleError(input, duplicateError, true);
        if (emptyError) {
          emptyError.classList.add("d-none");
          emptyError.style.display = "none";
        }
      } else {
        seen.add(value);
        toggleError(input, null, false);
        if (emptyError) {
          emptyError.classList.add("d-none");
          emptyError.style.display = "none";
        }
        if (duplicateError) {
          duplicateError.classList.add("d-none");
          duplicateError.style.display = "none";
        }
      }
    });
  }
});

document.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("remove-field") ||
    event.target.closest(".remove-field")
  ) {
    event.preventDefault();

    const row = event.target.closest(".other-industry-row, .franchise-row");
    if (row) {
      const input = row.querySelector("input");
      const isOtherIndustry = input.classList.contains("otherIndustry");
      const selector = isOtherIndustry ? ".otherIndustry" : ".franchiseBrand";

      row.remove();

      // Re-validate remaining fields
      const inputs = Array.from(document.querySelectorAll(selector));
      const seen = new Set();

      inputs.forEach(input => {
        const value = normalizeString(input.value.trim());
        const row = input.closest(".other-industry-row, .franchise-row");
        const emptyError = row?.querySelector(".empty-error");
        const duplicateError = row?.querySelector(".duplicate-error");

        if (value === "") {
          toggleError(input, emptyError, true);
        } else if (seen.has(value)) {
          toggleError(input, duplicateError, true);
        } else {
          seen.add(value);
          toggleError(input, null, false);
        }
      });
    }
  }
});


// ********************************************
// ✅ VALIDATION ENHANCEMENTS (ICON & JITTER)
// ********************************************

const hasShaken = {
  name: false,
  email: false,
  phone: false,
  organization: false,
  plot: false,
  road: false,
  landmark: false,
  message: false,
  pincode: false,
  district: false,
  state: false,
  country: false,
  framework: false
};

function toggleError(field, errorEl, show, fieldKey) {
  if (!field) {
    if (errorEl && show) {
      errorEl.classList.remove("d-none");
      errorEl.style.display = "block";
      errorEl.classList.add("active-error");
    } else if (errorEl) {
      errorEl.classList.add("d-none");
      errorEl.style.display = "none";
      errorEl.classList.remove("active-error");
    }
    return;
  }

  // Auto-discovery of error element if not provided
  if (!errorEl) {
    errorEl = field.nextElementSibling;
    if (!errorEl && field.parentElement.classList.contains('s-valid-wrapper')) {
      errorEl = field.parentElement.nextElementSibling;
    }
    if (field.id === 'phone-demo') {
      errorEl = document.querySelector(".phone-error");
    }
  }

  const itiContainer = field.closest(".iti");

  if (show) {
    field.classList.add("is-invalid");
    field.classList.remove("is-valid");
    if (itiContainer) {
      itiContainer.classList.add("is-invalid");
      itiContainer.classList.remove("is-valid");
    }
    if (errorEl && (errorEl.classList.contains('invalid-feedback') || errorEl.classList.contains('phone-error') || errorEl.classList.contains('custom-error-message'))) {
      errorEl.classList.remove("d-none");
      errorEl.style.display = "block";
      errorEl.classList.add("active-error");
    }

    if (fieldKey && !hasShaken[fieldKey]) {
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
    if (errorEl && (errorEl.classList.contains('invalid-feedback') || errorEl.classList.contains('phone-error') || errorEl.classList.contains('custom-error-message'))) {
      errorEl.classList.add("d-none");
      errorEl.style.display = "none";
      errorEl.classList.remove("active-error");
    }
    if (fieldKey) hasShaken[fieldKey] = false;
  }
}

// ********************************************
//     REAL-TIME VALIDATION FOR BASIC FIELDS  *
// ********************************************

// 🔹 Name
const nameDemo = document.getElementById("name-demo");
if (nameDemo) {
  nameDemo.addEventListener("input", function () {
    const isValid = /^[A-Za-zÀ-ÿ'.\-\s]{3,}$/.test(this.value.trim());
    toggleError(this, null, !isValid, 'name');
  });
}

// 🔹 Email
const emailDemo = document.getElementById("email-demo");
if (emailDemo) {
  emailDemo.addEventListener("input", function () {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value.trim());
    toggleError(this, null, !isValid, 'email');
  });
}

// 🔹 Phone
const phoneInput = document.getElementById("phone-demo");
if (phoneInput) {
  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
    const isValid = /^[6-9]\d{9}$/.test(this.value);
    toggleError(this, null, !isValid, 'phone');
  });
  phoneInput.addEventListener("blur", function () {
    toggleError(this, null, !/^[6-9]\d{9}$/.test(this.value.trim()), 'phone');
  });
}

// 🔹 Organization Name
const orgDemo = document.getElementById("organization-demo");
if (orgDemo) {
  orgDemo.addEventListener("input", function () {
    const isValid = /^[A-Za-zÀ-ÿ'.\-\s]{3,}$/.test(this.value.trim());
    toggleError(this, null, !isValid, 'organization');
  });
}

// 🔹 Plot Number
const plotDemo = document.getElementById("plot-demo");
if (plotDemo) {
  plotDemo.addEventListener("input", function () {
    toggleError(this, null, this.value.trim().length === 0, 'plot');
  });
}

// 🔹 Road / Locality
const roadDemo = document.getElementById("road-demo");
if (roadDemo) {
  roadDemo.addEventListener("input", function () {
    toggleError(this, null, this.value.trim().length === 0, 'road');
  });
}

// 🔹 Landmark
const landmarkDemo = document.getElementById("landmark");
if (landmarkDemo) {
  landmarkDemo.addEventListener("input", function () {
    toggleError(this, null, this.value.trim().length === 0, 'landmark');
  });
}

// 🔹 Message - Minimum 3 words
const msgDemo = document.getElementById("message-demo");
if (msgDemo) {
  msgDemo.addEventListener("input", function () {
    const wordCount = this.value.trim().split(/\s+/).filter(w => w.length > 0).length;
    toggleError(this, null, wordCount < 3 && wordCount > 0, 'message');
  });
}


// ********************************************************************************
// Real-time validation for industry types, other industries and franchise brands *
// ********************************************************************************

// ✅ Attach Real-Time Validation for All Industry Category Checkboxes
document.querySelectorAll('input[type="checkbox"][name^="industry_"]').forEach(checkbox => {
  checkbox.addEventListener("change", validateIndustrySelection);
});

// ✅ Attach Real-Time Validation for Other Industry Input Fields
document.addEventListener("input", (e) => {
  if (e.target.name === "otherIndustry[]") {
    validateIndustrySelection();
  }
});


function validateIndustrySelection() {
  const industryError = document.getElementById("industryError");
  const industryCard = document.querySelector(".industrytypecard");
  if (!industryError || !industryCard) return true;

  const industrySelected = document.querySelectorAll('input[type="checkbox"][name^="industry_"]:checked').length > 0;
  const otherIndustryValid = Array.from(document.querySelectorAll('input[name="otherIndustry[]"]'))
    .some(input => input.value.trim() !== "");

  const isValid = industrySelected || otherIndustryValid;

  if (isValid) {
    industryCard.classList.remove("is-invalid");
    industryError.classList.add("d-none");
    industryCard.style.backgroundColor = "#fff";
    industryCard.style.border = "";

    // Reset checkbox-option borders
    const checkboxOptions = industryCard.querySelectorAll('.checkbox-option');
    checkboxOptions.forEach(option => {
      option.style.borderColor = "";
    });

    // Reset checkbox borders
    const checkboxes = industryCard.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.style.borderColor = "";
    });

  } else {
    industryCard.classList.add("is-invalid");
    industryError.classList.remove("d-none");
    industryCard.style.backgroundColor = "#ff000010";
    industryCard.style.border = "1px solid #dc3545";

    // Add red borders to checkbox-option elements
    const checkboxOptions = industryCard.querySelectorAll('.checkbox-option');
    checkboxOptions.forEach(option => {
      option.style.borderColor = "#dc3545";
    });

    // Add red borders to checkboxes
    const checkboxes = industryCard.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.style.borderColor = "#dc3545";
    });
  }

  return isValid;
}


// ********************************************
// ✅ REAL-TIME VALIDATION FOR RADIO BUTTONS
// ********************************************

// ✅ Generic real-time validation for radio groups (excluding software)
function handleRadioGroup(name, errorId) {
  const radios = document.querySelectorAll(`input[name="${name}"]`);
  const errorDiv = document.getElementById(errorId);

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      radios.forEach(r => r.classList.remove("is-invalid"));
      if (errorDiv) {
        errorDiv.classList.add("d-none");
        errorDiv.style.display = "none";
      }

      // 🔄 Also remove red label styles if any (optional enhancement)
      const labels = Array.from(radios).map(r => document.querySelector(`label[for="${r.id}"]`));
      labels.forEach(label => {
        if (label) label.style.color = ""; // reset label color
      });
    });
  });
}

handleRadioGroup("orgType", "orgTypeError");
handleRadioGroup("assetquantity", "assetQuantityError");
handleRadioGroup("asset_cost", "assetCostError");


// ✅ Real-time validation for asset_software radios AND "Other" framework input
const frameworkRadios = document.querySelectorAll('input[name="asset_software"]');
const frameworkOtherInput2 = document.getElementById("frameworkOtherText");
const frameworkOtherError2 = document.getElementById("frameworkOtherError");
const frameworkErrorGroup = document.getElementById("ManagementFrameworkError");

frameworkRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    // Clear all invalid states
    frameworkRadios.forEach(r => r.classList.remove("is-invalid"));
    if (frameworkErrorGroup) {
      frameworkErrorGroup.classList.add("d-none");
      frameworkErrorGroup.style.display = "none";
    }

    // Show/hide Other input
    if (radio.value === "Other" && radio.checked) {
      document.getElementById("otherFrameworkInput").style.display = "block";
    } else {
      document.getElementById("otherFrameworkInput").style.display = "none";
      if (frameworkOtherInput2) {
        frameworkOtherInput2.classList.remove("is-invalid");
      }
      if (frameworkOtherError2) {
        frameworkOtherError2.classList.add("d-none");
        frameworkOtherError2.style.display = "none";
      }
    }
  });
});

// 🔁 Real-time input validation for "Other" text field
if (frameworkOtherInput2 && frameworkOtherError2) {
  frameworkOtherInput2.addEventListener("input", function () {
    const isOtherSelected = document.querySelector('input[name="asset_software"]:checked')?.value === "Other";
    const isValid = this.value.replace(/\s/g, "").length >= 3;

    if (isOtherSelected) {
      toggleError(this, frameworkOtherError2, !isValid, 'framework');
    } else {
      toggleError(this, frameworkOtherError2, false);
    }
  });
}
// *************************************************
// ✅ FINAL SUBMIT LOGIC: FORM VALIDATION & SUBMIT
// *************************************************

const demoForm = document.getElementById("demoForm");
const hiddenIframe = document.getElementById("hidden_iframe");
const submitBtnDemo = document.getElementById("submit-demo-form");
let isSubmitting = false;

if (demoForm) {
  demoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (isSubmitting) return;

    let valid = true;


    // 🧪 Name
    const nameField = document.getElementById("name-demo");
    const namePattern = /^[A-Za-zÀ-ÿ'.\-\s]{3,}$/;
    if (nameField) {
      if (!namePattern.test(nameField.value.trim())) {
        toggleError(nameField, nameField.nextElementSibling.classList.contains('invalid-feedback') ? nameField.nextElementSibling : nameField.parentElement.nextElementSibling, true, 'name');
        valid = false;
      } else {
        toggleError(nameField, null, false, 'name');
      }
    }

    // 🧪 Email
    const emailField = document.getElementById("email-demo");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField) {
      if (!emailPattern.test(emailField.value.trim())) {
        toggleError(emailField, emailField.nextElementSibling.classList.contains('invalid-feedback') ? emailField.nextElementSibling : emailField.parentElement.nextElementSibling, true, 'email');
        valid = false;
      } else {
        toggleError(emailField, null, false, 'email');
      }
    }

    // 🧪 Phone
    const phoneField = document.getElementById("phone-demo");
    const phonePattern = /^[6-9]\d{9}$/;
    if (phoneField) {
      if (!phonePattern.test(phoneField.value.trim())) {
        toggleError(phoneField, document.querySelector(".phone-error"), true, 'phone');
        valid = false;
      } else {
        toggleError(phoneField, null, false, 'phone');
      }
    }

    // 🧪 Organization
    const orgField = document.getElementById("organization-demo");
    if (orgField) {
      if (!namePattern.test(orgField.value.trim())) {
        toggleError(orgField, orgField.nextElementSibling.classList.contains('invalid-feedback') ? orgField.nextElementSibling : orgField.parentElement.nextElementSibling, true, 'organization');
        valid = false;
      } else {
        toggleError(orgField, null, false, 'organization');
      }
    }

    // 🧪 Message
    const messageField = document.getElementById("message-demo");
    if (messageField) {
      const wordCount = messageField.value.trim().split(/\s+/).filter(w => w.length > 0).length;
      if (wordCount > 0 && wordCount < 3) {
        toggleError(messageField, messageField.nextElementSibling.classList.contains('invalid-feedback') ? messageField.nextElementSibling : messageField.parentElement.nextElementSibling, true, 'message');
        valid = false;
      } else if (wordCount >= 3) {
        toggleError(messageField, null, false, 'message');
      }
    }

    // 🧪 Address Fields
    const addressFields = ["plot-demo", "road-demo", "pincode", "district", "state", "country", "landmark"];
    addressFields.forEach(id => {
      const field = document.getElementById(id);
      if (field) {
        if (!field.value.trim()) {
          toggleError(field, field.nextElementSibling.classList.contains('invalid-feedback') ? field.nextElementSibling : field.parentElement.nextElementSibling, true, id);
          valid = false;
        } else {
          toggleError(field, null, false, id);
        }
      }
    });

    // 🧪 Org Type
    const orgTypeRadios = document.querySelectorAll('input[name="orgType"]');
    if (orgTypeRadios.length > 0 && ![...orgTypeRadios].some(r => r.checked)) {
      const err = document.getElementById("orgTypeError");
      if (err) err.classList.remove("d-none");
      orgTypeRadios.forEach(r => r.classList.add("is-invalid"));
      valid = false;
    }

    // 🏪 Other Industry Duplication
    const otherIndustries = document.querySelectorAll(".otherIndustry");
    let industryNames = new Set();
    otherIndustries.forEach(input => {
      const value = normalizeString(input.value.trim());
      const row = input.closest(".other-industry-row");
      const emptyError = row.querySelector(".empty-error");
      const duplicateError = row.querySelector(".duplicate-error");
      if (value === "") {
        toggleError(input, emptyError, true);
        valid = false;
      } else if (industryNames.has(value)) {
        toggleError(input, duplicateError, true);
        valid = false;
      } else {
        industryNames.add(value);
        toggleError(input, null, false);
      }
    });

    // 🏪 Franchise Brand Duplication
    const franchiseBrands = document.querySelectorAll(".franchiseBrand");
    if (franchiseBrands.length > 0) {
      let franchiseSet = new Set();
      franchiseBrands.forEach(input => {
        const value = normalizeString(input.value.trim());
        const row = input.closest(".franchise-row");
        const emptyError = row.querySelector(".empty-error");
        const duplicateError = row.querySelector(".duplicate-error");
        if (value === "") {
          toggleError(input, emptyError, true);
          valid = false;
        } else if (franchiseSet.has(value)) {
          toggleError(input, duplicateError, true);
          valid = false;
        } else {
          franchiseSet.add(value);
          toggleError(input, null, false);
        }
      });
    }

    // 🧪 Asset Quantity
    const aqRadios = document.querySelectorAll('input[name="assetquantity"]');
    if (aqRadios.length > 0 && ![...aqRadios].some(r => r.checked)) {
      const err = document.getElementById("assetQuantityError");
      if (err) err.classList.remove("d-none");
      aqRadios.forEach(r => r.classList.add("is-invalid"));
      valid = false;
    }

    // 🧪 Asset Cost
    const acRadios = document.querySelectorAll('input[name="asset_cost"]');
    if (acRadios.length > 0 && ![...acRadios].some(r => r.checked)) {
      const err = document.getElementById("assetCostError");
      if (err) err.classList.remove("d-none");
      acRadios.forEach(r => r.classList.add("is-invalid"));
      valid = false;
    }

    // 🧪 Asset Software
    const swRadios = document.querySelectorAll('input[name="asset_software"]');
    const swOtherInput = document.getElementById("frameworkOtherText");
    const otherSelected = [...swRadios].find(r => r.checked)?.value === "Other";
    if (swRadios.length > 0 && ![...swRadios].some(r => r.checked)) {
      const err = document.getElementById("ManagementFrameworkError");
      if (err) err.classList.remove("d-none");
      swRadios.forEach(r => r.classList.add("is-invalid"));
      valid = false;
    } else if (otherSelected && swOtherInput) {
      const isSwValid = swOtherInput.value.trim().length >= 3;
      toggleError(swOtherInput, document.getElementById("frameworkOtherError"), !isSwValid, 'framework');
      if (!isSwValid) valid = false;
    }

    if (!validateIndustrySelection()) valid = false;

    if (document.querySelector(".is-invalid")) {
      valid = false;
    }

    if (!valid) {
      setTimeout(() => {
        const firstErrorInput = [...document.querySelectorAll(".is-invalid")]
          .find(el => el.offsetParent !== null);
        if (firstErrorInput) {
          const scrollTarget = firstErrorInput.closest(".other-industry-row, .franchise-row") || firstErrorInput;
          scrollTarget.scrollIntoView({ behavior: "smooth", block: "center" });
          const focusInput = scrollTarget.querySelector("input, textarea, select") || firstErrorInput;
          focusInput?.focus();
        }
      }, 100);
      return;
    }

    // ✅ Prevent double submission + disable button
    isSubmitting = true;
    demoForm.classList.add("submitted");
    submitBtnDemo.disabled = true;
    submitBtnDemo.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Submitting...';

    const fullNumberDemo = iti.getNumber().trim();
    document.getElementById("phone-demo").value = fullNumberDemo;

    // Capitalization logic before submission
    ["name-demo", "organization-demo", "plot-demo", "road-demo", "landmark"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.value = el.value.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
      }
    });

    demoForm.submit(); // Submit to hidden iframe
  });
}

// ✅ Handle iframe load after submission
if (hiddenIframe) {
  hiddenIframe.addEventListener("load", function () {
    if (!demoForm.classList.contains("submitted")) return;

    // ✅ Assume successful submission (no CORS document reading)
    const successModal = new bootstrap.Modal(document.getElementById("successModalDemo"));
    successModal.show();

    demoForm.reset();
    if (typeof iti !== "undefined") iti.setNumber("");

    document.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
    document.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));
    document.querySelectorAll(".invalid-feedback").forEach(el => el.style.display = "none");
    document.getElementById("otherIndustryContainer").innerHTML = "";
    document.getElementById("franchiseContainer").innerHTML = "";

    demoForm.classList.remove("submitted");
    isSubmitting = false;
    submitBtnDemo.disabled = false;
    submitBtnDemo.innerHTML = '<i class="fa fa-check"></i> Submit';

    console.log("✅ Demo form submitted and reset.");
  });
}


// Sapphire Hero Corporate Grid Generator
function initializeSapphireHeroGrid() {
  const sapphireGrid = document.getElementById('sapphireCorporateGrid');
  if (!sapphireGrid) return;

  // Clear existing content
  sapphireGrid.innerHTML = '';

  // Calculate grid size based on screen size
  let gridCols = 10;
  let gridRows = 10;

  if (window.innerWidth <= 576) {
    gridCols = 5;
    gridRows = 6;
  } else if (window.innerWidth <= 768) {
    gridCols = 6;
    gridRows = 8;
  }

  const totalCells = gridCols * gridRows;

  // Create grid cells with Sapphire-specific classes
  for (let i = 0; i < totalCells; i++) {
    const gridCell = document.createElement('div');
    gridCell.className = 'sapphire-grid-cell';

    // Add pulse element
    const gridPulse = document.createElement('div');
    gridPulse.className = 'sapphire-grid-pulse';

    gridCell.appendChild(gridPulse);
    sapphireGrid.appendChild(gridCell);

    // Add random delay for staggered animation
    const randomDelay = Math.random() * 2;
    gridCell.style.animationDelay = `${randomDelay}s`;
    gridPulse.style.animationDelay = `${randomDelay + 1}s`;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeSapphireHeroGrid);

// Reinitialize on window resize
window.addEventListener('resize', initializeSapphireHeroGrid);
// Return focus to opener and focus modal title on open
(() => {
  let opener = null;
  document.querySelectorAll('[data-bs-toggle="modal"]').forEach(btn => {
    btn.addEventListener('click', () => { opener = btn; });
  });
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('shown.bs.modal', () => {
      const t = m.querySelector('.s-modal-title');
      if (t) t.focus();
    });
    m.addEventListener('hidden.bs.modal', () => { if (opener) opener.focus(); });
  });
})();
