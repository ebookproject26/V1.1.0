const webAppUrl = "https://script.google.com/macros/s/AKfycbzu87pePBMNUq3m4vEk23frIzcQdPpajAsv88xJewIi9amJQRh0eXqIgmpV3am337BoQw/exec";

document.addEventListener("DOMContentLoaded", function () {
    // === TOGGLE PASSWORD VISIBILITY (LOGIN ONLY) ===
    const togglePasswordIcon = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("login-password");

    if (togglePasswordIcon && passwordInput) {
        togglePasswordIcon.addEventListener("click", function () {
            const isPassword = passwordInput.type === "password";
            passwordInput.type = isPassword ? "text" : "password";
            togglePasswordIcon.textContent = isPassword ? "visibility" : "visibility_off";
        });
    }

    // === FORM ELEMENTS ===
    const loginSection = document.getElementById("login-section");
    const signupSection = document.getElementById("signup-section");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    // === SWITCH BETWEEN LOGIN & SIGNUP ===
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

    // === VALIDASI EMAIL ===
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // === SIGNUP ===
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value.trim();
        const messageBox = document.getElementById("signup-message");

        if (!email || !password) {
            return showError(messageBox, "❌ Email dan password wajib diisi.");
        }
        if (!isValidEmail(email)) {
            return showError(messageBox, "❌ Format email tidak valid.");
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
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || "HTTP error");
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.result === "success") {
                    messageBox.innerHTML = `
                <div class="alert success">
                    ✅ Akun berhasil dibuat! Redirecting...
                </div>
            `;
                    setTimeout(() => {
                        signupForm.reset();
                        messageBox.innerHTML = "";

                        // Tampilkan kembali form login
                        document.getElementById("signup-section").style.display = "none";
                        document.getElementById("login-section").style.display = "block";

                        // Tampilkan pesan sukses di form login
                        const loginMessage = document.getElementById("login-error-message");
                        loginMessage.style.color = "green";
                        loginMessage.innerText = "✅ Akun berhasil dibuat. Silakan login.";
                    }, 2000);
                } else {
                    showError(messageBox, data.message || "Signup gagal.");
                }
            })
            .catch(err => {
                console.error("Signup error:", err);
                showError(messageBox,
                    err.message.includes("Failed to fetch")
                        ? "Koneksi ke server gagal. Cek koneksi internet Anda."
                        : err.message
                );
            });
    });


    // === LOGIN ===
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();
        const errorBox = document.getElementById("login-error-message");
        const loadingIndicator = document.getElementById("login-loading");

        if (!email || !password) {
            return showError(errorBox, "❌ Email dan password wajib diisi.");
        }

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
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || "HTTP error");
                    });
                }
                return response.json();
            })
            .then(data => {
                loadingIndicator.style.display = "none";
                if (data.result === "success") {
                    document.body.classList.add("iframe-active");

                    loginSection.style.display = "none";
                    signupSection.style.display = "none";

                    const datasheetContainer = document.getElementById("datasheet-container");
                    const datasheetFrame = document.getElementById("datasheet-frame");
                    datasheetFrame.src = "datasheet.html";

                    datasheetContainer.style.display = "block";

                    addLogoutButton();
                } else {
                    showError(errorBox, "❌ " + (data.message || "Login gagal."));
                }
            })
            .catch(err => {
                loadingIndicator.style.display = "none";
                showError(errorBox, "❌ " + err.message);
            });
    });

    // === TAMPILKAN ERROR MESSAGE ===
    function showError(element, message) {
        element.innerHTML = `
            <div class="alert error">${message}</div>
        `;
    }

    // === LOGOUT BUTTON ===
    function addLogoutButton() {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.innerHTML = 'Logout';
        Object.assign(logoutBtn.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: '1001',
            padding: '8px 16px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        });

        logoutBtn.addEventListener('click', function () {
            document.body.classList.remove("iframe-active");
            document.getElementById("datasheet-container").style.display = "none";
            document.getElementById("datasheet-frame").src = "";
            loginForm.reset();
            this.remove();
        });

        document.body.appendChild(logoutBtn);
    }
});
