import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token); // Set logged-in state based on token presence
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token
    setIsLoggedIn(false); // Update state
    router.push('/login'); // Redirect to login page
  };

  return (
    <nav className="bg-gray-900 text-white fixed w-full z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo Section */}
        <div className="text-2xl font-bold text-red-500">
          <Link href="/">👾 Trivia-Party</Link>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link href="/" className="hover:text-red-500">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-red-500">
              About
            </Link>
          </li>
          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link
                href="/login"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Burger Menu for Small Screens */}
        <button className="md:hidden flex flex-col justify-between h-6 w-6">
          <span className="bg-white block w-full h-0.5"></span>
          <span className="bg-white block w-full h-0.5"></span>
          <span className="bg-white block w-full h-0.5"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
