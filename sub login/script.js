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
        const submitBtn = this.querySelector('button[type="submit"]');

        // Validasi input
        if (!email || !password) {
            return showError(messageBox, "❌ Email dan password wajib diisi.");
        }
        if (!isValidEmail(email)) {
            return showError(messageBox, "❌ Format email tidak valid.");
        }

        // Tampilkan loading state
        submitBtn.innerHTML = `
        <span class="spinner"></span>
        <span class="btn-text">Mendaftarkan...</span>
    `;
        submitBtn.disabled = true;

        messageBox.innerHTML = `
        <div class="loading-message">
            <span class="spinner small"></span>
            <span>Mengirim data ke server...</span>
        </div>
    `;

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
                        throw new Error(err.message || "Terjadi kesalahan server");
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.result === "success") {
                    // Tampilkan animasi sukses
                    messageBox.innerHTML = `
                <div class="success-animation">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <p>Akun berhasil dibuat!</p>
                </div>
            `;

                    submitBtn.innerHTML = '<span class="btn-text">✓ Berhasil</span>';

                    setTimeout(() => {
                        signupForm.reset();
                        messageBox.innerHTML = "";

                        // Kembali ke form login
                        document.getElementById("signup-section").style.display = "none";
                        document.getElementById("login-section").style.display = "block";

                        // Tampilkan pesan sukses di login form
                        const loginMessage = document.getElementById("login-error-message");
                        loginMessage.innerHTML = `
                    <div class="alert success">
                        ✅ Akun berhasil dibuat. Silakan login.
                    </div>
                `;

                        // Reset tombol setelah 3 detik
                        setTimeout(() => {
                            submitBtn.innerHTML = '<span class="btn-text">Daftar</span>';
                            submitBtn.disabled = false;
                        }, 3000);
                    }, 2000);
                } else {
                    throw new Error(data.message || "Signup gagal");
                }
            })
            .catch(err => {
                console.error("Signup error:", err);
                submitBtn.innerHTML = '<span class="btn-text">Daftar</span>';
                submitBtn.disabled = false;

                showError(messageBox,
                    err.message.includes("Failed to fetch")
                        ? "❌ Koneksi ke server gagal. Cek koneksi internet Anda."
                        : "❌ " + err.message
                );
            });
    });

    // Fungsi helper untuk menampilkan error
    function showError(element, message) {
        element.innerHTML = `
        <div class="alert error">
            ${message}
        </div>
    `;
    }

    // Fungsi validasi email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }


    // === LOGIN ===
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();
        const errorBox = document.getElementById("login-error-message");
        const submitBtn = this.querySelector('button[type="submit"]');

        // Validasi input
        if (!email || !password) {
            return showError(errorBox, "❌ Email dan password wajib diisi.");
        }

        // Tampilkan loading state
        submitBtn.innerHTML = `
        <span class="spinner"></span>
        <span class="btn-text">Memverifikasi...</span>
    `;
        submitBtn.disabled = true;
        errorBox.innerHTML = `
        <div class="loading-message">
            <span class="spinner small"></span>
            <span>Memverifikasi akun...</span>
        </div>
    `;

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
                        throw new Error(err.message || "Terjadi kesalahan server");
                    });
                }
                return response.json();
            })
            .then(data => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                if (data.result === "success") {
                    // Tampilkan animasi sukses sebelum redirect
                    submitBtn.innerHTML = `
                <span class="btn-text">✓ Berhasil</span>
            `;
                    errorBox.innerHTML = `
                <div class="success-animation">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <p>Login berhasil!</p>
                </div>
            `;

                    // Tunggu 1 detik sebelum membuka iframe
                    setTimeout(() => {
                        document.body.classList.add("iframe-active");
                        loginSection.style.display = "none";
                        signupSection.style.display = "none";

                        const datasheetContainer = document.getElementById("datasheet-container");
                        const datasheetFrame = document.getElementById("datasheet-frame");
                        datasheetFrame.src = "datasheet.html";
                        datasheetContainer.style.display = "block";

                        addLogoutButton();
                    }, 1000);
                } else {
                    throw new Error(data.message || "Login gagal");
                }
            })
            .catch(err => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false
            });
    });

    // Fungsi helper untuk menampilkan error
    function showError(element, message) {
        element.innerHTML = `
        <div class="alert error">
            ${message}
        </div>
    `;
    }
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
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }, 100);
}

