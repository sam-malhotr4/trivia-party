

async function register(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/auth/register',
       { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      
    });
    console.log(response);

    const data = await response.json();
    if (response.ok) {
      alert('Registration successful! Please log in.');
      window.location.href = './Login.html';
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('An error occurred. Please try again.');
  }
}
