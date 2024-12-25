// Common DOMContentLoaded Event
document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded and JavaScript is working!");
});

// Form Submission and Validation for Contact
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    const popupClose = document.getElementById("popup-close");

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page refresh

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !email || !message) {
            showPopup("โปรดกรอกข้อมูลให้ครบถ้วน");
            return;
        }

        if (!email.endsWith("@gmail.com")) {
            showPopup("โปรดกรอกอีเมลที่มี @gmail.com");
            return;
        }

        showPopup("ได้รับข้อมูลแล้ว โปรดรอการติดต่อกลับทางอีเมล");
        form.reset(); // Clear form
    });

    popupClose.addEventListener("click", () => {
        popup.classList.add("hidden");
    });

    function showPopup(message) {
        popupMessage.textContent = message;
        popup.classList.remove("hidden");
    }
});

// Login Form Validation
document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please fill in both email and password fields.");
        return;
    }

    alert("Login successful for " + email);
});

// Order Form Submission with Quantity Validation
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("orderForm");
    const confirmationModalElement = document.getElementById("confirmationModal");
    const confirmationModal = new bootstrap.Modal(confirmationModalElement);

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const quantity = document.getElementById("quantity").value;

        if (quantity < 1) {
            alert("กรุณากรอกจำนวนที่ถูกต้อง");
            return;
        }

        confirmationModal.show();
    });
});

// Registration Form Submission with API Call
document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/user_registration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Registration successful!");
            console.log(result);
            window.location.href = "login.html";
        } else {
            alert(result.error || "Registration failed!");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("An error occurred. Please try again.");
    }
});
