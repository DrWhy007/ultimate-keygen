function updateLength() {
    const length = document.getElementById("length-slider").value;
    document.getElementById("length-value").textContent = length;
}

function generatePassword() {
    const length = parseInt(document.getElementById("length-slider").value) || 20;
    const includeLetters = document.getElementById("include-letters").checked;
    const includeMixedCase = document.getElementById("include-mixed-case").checked;
    const includeNumbers = document.getElementById("include-numbers").checked;
    const includePunctuation = document.getElementById("include-punctuation").checked;

    let charset = "";
    if (includeLetters) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeMixedCase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includePunctuation) charset += "!@#$%^&*()_+-=[]{}|;:',.<>?/";

    if (!charset) {
        alert("Please select at least one option.");
        return;
    }

    let password = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    // Ensure at least one character from each selected set
    if (includeLetters) password += "abcdefghijklmnopqrstuvwxyz"[array[0] % 26];
    if (includeMixedCase) password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[array[1] % 26];
    if (includeNumbers) password += "0123456789"[array[2] % 10];
    if (includePunctuation) password += "!@#$%^&*()_+-=[]{}|;:',.<>?/"[array[3] % 32];

    // Fill the rest of the password
    for (let i = password.length; i < length; i++) {
        password += charset[array[i] % charset.length];
    }

    // Shuffle the password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    document.getElementById("password-display").value = password;
    updateStrength(password);
}

function copyPassword() {
    const password = document.getElementById("password-display").value;
    navigator.clipboard.writeText(password).then(() => {
        alert("Password copied to clipboard!");
    });
}

function updateStrength(password) {
    const strengthIndicator = document.getElementById("password-strength");
    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (length >= 12 && hasUpper && hasLower && hasNumbers && hasSymbols) {
        strengthIndicator.textContent = "Strong password";
        strengthIndicator.style.color = "green";
    } else if (length >= 8 && (hasUpper || hasLower) && (hasNumbers || hasSymbols)) {
        strengthIndicator.textContent = "Moderate password";
        strengthIndicator.style.color = "orange";
    } else {
        strengthIndicator.textContent = "Weak password";
        strengthIndicator.style.color = "red";
    }
}

// Initialize the length value display
updateLength();

// Add event listener to generate button
document.getElementById("generate-button").addEventListener("click", generatePassword);
