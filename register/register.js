function validateForm() {
    document.getElementById("email-error").innerText = "";
    document.getElementById("parent-email-error").innerText = "";
    document.getElementById("parent-phone-error").innerText = "";
    document.getElementById("contact-phone-error").innerText = "";

    let isValid = true;
    let isFirstInvalid = null;

    const email = document.getElementById("email").value;
    const comfirmEmail = document.getElementById("confirmEmail").value;
    if (email !== comfirmEmail) {
        document.getElementById("email-error").innerText = "Emails do not match";
        isValid = false;
        isFirstInvalid = isFirstInvalid || "email";
    }

    const parentEmail = document.getElementById("parentEmail").value;
    const comfirmParentEmail = document.getElementById("confirmParentEmail").value;
    if (parentEmail !== comfirmParentEmail) {
        document.getElementById("parent-email-error").innerText = "Emails do not match";
        isValid = false;
        isFirstInvalid = isFirstInvalid || "parentEmail";
    }

    const parentPhone = document.getElementById("parentPhone").value;
    const comfirmParentPhone = document.getElementById("confirmParentPhone").value;
    if (parentPhone !== comfirmParentPhone) {
        document.getElementById("parent-phone-error").innerText = "Phone numbers do not match";
        isValid = false;
        isFirstInvalid = isFirstInvalid || "parentPhone";
    }

    const contactPhone = document.getElementById("emergencyContactPhone").value;
    const comfirmContactPhone = document.getElementById("confirmEmergencyContactPhone").value;
    if (contactPhone !== comfirmContactPhone) {
        document.getElementById("contact-phone-error").innerText = "Phone numbers do not match";
        isValid = false;
        isFirstInvalid = isFirstInvalid || "emergencyContactPhone";
    }

    if (!isValid) {
        document.getElementById(isFirstInvalid).focus();
    }

    return isValid;
}

function showTeamTextbox() {
    const selectBox = document.getElementById("team");
    const textBox1 = document.getElementById("teammateNames");
    const textDiv1 = document.getElementById("teammateNamesDiv");
    const textBox2 = document.getElementById("techStackInformation");
    const textDiv2 = document.getElementById("extraTeamInfoDiv");
    if (selectBox.value === "teamSelect") {
        textDiv1.style.display = "block";
        textBox1.setAttribute("required", "required");
    } else {
        textDiv1.style.display = "none";
        textBox1.removeAttribute("required");
    }
    if (selectBox.value === "yes") {
        textDiv2.style.display = "block";
        textBox2.setAttribute("required", "required");
    }
    else {
        textDiv2.style.display = "none";
        textBox2.removeAttribute("required");
    }
}

function showTextbox() {
    const selectBox = document.getElementById("schoolDivision");
    const textBox = document.getElementById("schoolDivisionOther");
    if (selectBox.value === "other") {
        textBox.style.display = "block";
        textBox.setAttribute("required", "required");
    } else {
        textBox.style.display = "none";
        textBox.removeAttribute("required");
    }
}