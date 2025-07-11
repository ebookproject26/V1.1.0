document.addEventListener("DOMContentLoaded", function () {
    // === TOGGLE PASSWORD VISIBILITY (LOGIN ONLY) ===
    const togglePasswordIcon = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("login-password");

    if (togglePasswordIcon && passwordInput) {
        togglePasswordIcon.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePasswordIcon.textContent = "visibility";
            } else {
                passwordInput.type = "password";
                togglePasswordIcon.textContent = "visibility_off";
            }
        });
    }

    // === SWITCH BETWEEN LOGIN & SIGNUP FORMS ===
    const loginSection = document.getElementById("login-section");
    const signupSection = document.getElementById("signup-section");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    document.getElementById("showSignup").addEventListener("click", function (e) {
        e.preventDefault();
        loginForm.reset();
        document.getElementById("login-error-message").innerText = "";
        loginSection.style.display = "none";
        signupSection.style.display = "block";
    });

    document.getElementById("showLogin").addEventListener("click", function (e) {
        e.preventDefault();
        signupForm.reset();
        document.getElementById("signup-message").innerText = "";
        signupSection.style.display = "none";
        loginSection.style.display = "block";
    });

    // === SIGNUP LOGIC ===
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value.trim();
        const messageBox = document.getElementById("signup-message");

        if (!email || !password) {
            messageBox.style.color = "red";
            messageBox.innerText = "❌ Email dan password wajib diisi.";
            return;
        }

        messageBox.style.color = "black";
        messageBox.innerText = "⏳ Mengirim data...";

        const params = new URLSearchParams();
        params.append("email", email);
        params.append("password", password);
        params.append("action", "signup");

        fetch(webAppUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString()
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.result === "success") {
                    messageBox.style.color = "green";
                    messageBox.innerText = "✅ Link verifikasi telah dikirim ke email Anda.";
                    this.reset();
                    // Redirect ke datasheet jika mau langsung ke halaman itu setelah signup
                    window.location.href = "datasheet.html";
                } else {
                    messageBox.style.color = "red";
                    messageBox.innerText = "❌ " + data.message;
                }
            })
            .catch((err) => {
                messageBox.style.color = "red";
                messageBox.innerText = "❌ Error jaringan: " + err.message;
            });
    });

    // === LOGIN LOGIC ===
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();
        const errorBox = document.getElementById("login-error-message");
        const loadingIndicator = document.getElementById("login-loading");

        errorBox.innerText = "";
        loadingIndicator.style.display = "block";

        const params = new URLSearchParams();
        params.append("email", email);
        params.append("password", password);
        params.append("action", "login");

        fetch(webAppUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString()
        })
            .then((res) => res.json())
            .then((data) => {
                loadingIndicator.style.display = "none";
                if (data.result === "success") {
                    // Sembunyikan form login/signup
                    loginSection.style.display = "none";
                    signupSection.style.display = "none";

                    // Tampilkan container iframe
                    const datasheetContainer = document.getElementById("datasheet-container");
                    const datasheetFrame = document.getElementById("datasheet-frame");

                    // Ganti ke URL spreadsheet atau halaman datasheet lokal
                    datasheetFrame.src = "datasheet.html"; // ganti sesuai kebutuhan

                    datasheetContainer.style.display = "block";
                } else {
                    errorBox.style.color = "red";
                    errorBox.innerText = "❌ " + (data.message || "Login gagal.");
                }
            })
            .catch((err) => {
                loadingIndicator.style.display = "none";
                errorBox.style.color = "red";
                errorBox.innerText = "❌ Error jaringan: " + err.message;
            });
    });
});
