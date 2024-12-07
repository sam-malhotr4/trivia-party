import Navbar from '../components/Navbar';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState < boolean > (false); // Type-safe state

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token); // Check if token exists
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to <span className="text-red-500">Trivia Party</span>
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Enter the world of excitement, challenge, and fun!
          </p>
          <a
            href={isLoggedIn ? '/room' : '/login'}
            className="bg-red-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Start Playing
          </a>
        </div>
      </div>
      <Layout />
    </>
  );
};

export default Home;
