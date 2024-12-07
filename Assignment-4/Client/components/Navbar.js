import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
   
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false); 
    router.push('/login'); 
  };

  return (
    <nav className="bg-cardBg text-textPrimary fixed w-full z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="logo text-2xl font-bold text-primary">
          <Link href="/">👾 Trivia-Party</Link>
        </div>
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
          </li>
          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link
                href="/login"
                className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
        <button className="burger md:hidden flex flex-col justify-between h-6 w-6">
          <span className="bg-textPrimary block w-full h-0.5"></span>
          <span className="bg-textPrimary block w-full h-0.5"></span>
          <span className="bg-textPrimary block w-full h-0.5"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
