// Toggle password visibility
document.getElementById('show-password').addEventListener('change', function () {
    var passwordField = document.getElementById('password');
    var confirmPasswordField = document.getElementById('confirm-password');
    
    if (this.checked) {
        passwordField.type = 'text';
        confirmPasswordField.type = 'text';
    } else {
        passwordField.type = 'password';
        confirmPasswordField.type = 'password';
    }
});

// Handle form submission with fetch
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from submitting normally

    // Get form data
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Prepare data to send to server
    const data = {
        username: username,
        email: email,
        password: password
    };

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            // If the response status is not 200, we assume it's an error page (HTML)
            return response.text();  // Get response as text for debugging
        }
        return response.json();  // Try to parse as JSON if the status is OK
    })
    .then(data => {
        console.log(data);  // Log the raw response
        if (typeof data === 'string') {
            // If data is a string (HTML error page), handle the error
            alert('There was an error with your registration.');
            return;
        }

        try {
            if (data.success) {
                window.location.href = '/login';  // Redirect to login on success
            } else {
                alert(data.message);  // Show error message from the server
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error with your registration.');
    });
});
