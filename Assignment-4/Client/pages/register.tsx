import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Layout from '../components/Layout';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle Registration
  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const lowerCaseUsername = username.toLowerCase();
    const lowerCaseEmail = email.toLowerCase();

    if (!lowerCaseUsername || !lowerCaseEmail || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: lowerCaseUsername,
          email: lowerCaseEmail,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please log in.');
        router.push('/login'); // Redirect to login page
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="bg-gray-900 text-white p-8 rounded-lg shadow-md border-2 border-red-500 max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-red-500">
            Create a Sinister Account!
          </h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form id="register-form" onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold mb-2 text-gray-200"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Create your alias"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 border border-red-500 rounded-lg bg-gray-800 text-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold mb-2 text-gray-200"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-red-500 rounded-lg bg-gray-800 text-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold mb-2 text-gray-200"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-red-500 rounded-lg bg-gray-800 text-gray-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg"
            >
              Register
            </button>

            <p className="message text-center mt-4">
              Already registered?{' '}
              <a
                href="/login"
                className="text-orange-400 hover:text-orange-500 font-semibold"
              >
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
      <Layout />
    </>
  );
};

export default Register;
