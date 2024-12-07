import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Layout from '../components/Layout';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle Login
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const LowerCaseUsername = username.toLowerCase();

    if (!LowerCaseUsername || !password) {
      alert('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: LowerCaseUsername, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        console.log('Token:', data.token);

        router.push('/room'); // Redirect to room page
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="bg-gray-950 text-white p-8 rounded-lg shadow-md border-2 border-red-500">
          <h1 className="text-3xl font-bold text-center mb-6 text-red-500">
            Welcome Back to the Fun!
          </h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form id="login-form" onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-center font-bold mb-2 text-gray-200"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 border border-red-500 rounded-lg bg-gray-800 text-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-center font-bold mb-2 text-gray-200"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-red-500 rounded-lg bg-gray-800 text-gray-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg"
            >
              Login
            </button>

            <p className="message text-center mt-4">
              Not registered?{' '}
              <a
                href="/register"
                className="text-orange-400 hover:text-orange-500 font-semibold"
              >
                Create an account
              </a>
            </p>
          </form>
        </div>
      </div>

      <Layout />
    </>
  );
};

export default Login;
