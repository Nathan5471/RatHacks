function validateForm() {
    document.getElementById("email-error").innerText = "";
    document.getElementById("parent-email-error").innerText = "";
    document.getElementById("parent-phone-error").innerText = "";
    document.getElementById("contact-phone-error").innerText = "";

    let isValid = true;
    let isFirstInvalid = null;

    const email = document.getElementById("email").value;
    const comfirmEmail = document.getElementById("confirm-email").value;
    if (email !== comfirmEmail) {
        document.getElementById("email-error").innerText = "Emails do not match";
        isValid = false;
        isFirstInvalid = isFirstInvalid || "email";
    }

    const parentEmail = document.getElementById("parent-email").value;
    const comfirmParentEmail = document.getElementById("confirm-parent-email").value;
    if (parentEmail !== comfirmParentEmail) {
        document.getElementById("parent-email-error").innerText = "Emails do not match";
        isValid = false;
        isFirstInvalid = isFirstInvalid || "parent-email";
    }

    const parentPhone = document.getElementById("parent-phone").value;
    const comfirmParentPhone = document.getElementById("confirm-parent-phone").value;
    if (parentPhone !== comfirmParentPhone) {
        document.getElementById("parent-phone-error").innerText = "Phone numbers do not match";
        isValid = false;
        isFirstInvalid = isFirstInvalid || "parent-phone";
    }

    const contactPhone = document.getElementById("emergency-contact-phone").value;
    const comfirmContactPhone = document.getElementById("confirm-emergency-contact-phone").value;
    if (contactPhone !== comfirmContactPhone) {
        document.getElementById("contact-phone-error").innerText = "Phone numbers do not match";
        isValid = false;
        isFirstInvalid = isFirstInvalid || "emergency-contact-phone";
    }

    if (!isValid) {
        document.getElementById(isFirstInvalid).focus();
    }

    return isValid;
}