document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    alert(`Email: ${email}\nPassword: ${password}`);
  });
  


//   login


document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    alert(`Username: ${username}\nEmail: ${email}\nPassword: ${password}`);
  });
  


  

    // Import necessary Firebase functions
// Import necessary Firebase functions


// Reference to the database path for storing user data
const usersRef = ref(database, 'users');

// Handle form submission
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the default form submission

  // Get form data
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Generate a unique key for the new user
  const newUserRef = push(usersRef);

  // Store the user data in Firebase
  set(newUserRef, {
    email: email,
    password: password
  })
    .then(() => {
      alert('User data saved successfully!');
      signupForm.reset(); // Reset the form fields
    })
    .catch((error) => {
      console.error('Error saving data:', error);
      alert('An error occurred while saving user data.');
    });
});