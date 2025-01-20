document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const formOverlay = document.getElementById('formOverlay');
    const formContainer = document.getElementById('formContainer');

    // Function to show the signup form
    window.showForm = function() {
        formOverlay.style.display = 'block';
        formContainer.style.display = 'block';
    };

    // Function to hide the signup form
    window.hideForm = function() {
        formOverlay.style.display = 'none';
        formContainer.style.display = 'none';
    };

    // Handle signup form submission
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        // Validate input
        if (!firstName || !lastName || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // Check if user already exists
        if (localStorage.getItem(email)) {
            alert('User already exists. Please log in.');
            return;
        }

        // Store user data in local storage
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password // Note: In production, never store plain-text passwords.
        };

        // Save to local storage using email as the key
        localStorage.setItem(email, JSON.stringify(userData));

        alert('Signup successful! Your data has been stored.');
        hideForm();
        signupForm.reset();
    });

    // Handle login form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validate input
        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // Retrieve user data from localStorage
        const storedUserData = localStorage.getItem(email);

        // Check if user exists
        if (!storedUserData) {
            alert('User not found. Please sign up first.');
            return;
        }

        const userData = JSON.parse(storedUserData);

        // Verify password
        if (userData.password !== password) {
            alert('Incorrect password. Please try again.');
            return;
        }

        // Redirect to your website upon successful login
       
        location.href = '../page/home.html'; // Replace with your actual website URL
    });
    const showSignupForm = document.getElementById('showSignupForm');


    // Show signup form
    showSignupForm.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default behavior of link
        formOverlay.style.display = 'block';
        formContainer.style.display = 'block';
    });

    // Hide signup form
    function hideForm() {
        formOverlay.style.display = 'none';
        formContainer.style.display = 'none';
    }

    // Store signup data
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        const userData = {
            firstName,
            lastName,
            email,
            password, // Never store passwords like this in production!
        };

        localStorage.setItem('user', JSON.stringify(userData));

    
        hideForm();
    });


});