import React, { useState, useEffect } from 'react';
import Layout from '../components/layout';
import Navbar from '../components/Navbar';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

export default function Room() {
  const [roles, setRoles] = useState([]); // State for roles

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
      console.log('Token:', token);

      if (token) {
        const decoded = parseJwt(token); // Decode the token
        console.log('Decoded Token:', decoded);

        setRoles(decoded?.roles || []); // Set roles from the token payload
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []); 
  return (
    <>
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="bg-gray-900 text-white p-8 rounded-lg shadow-md border-2 border-red-500 max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6 text-red-500">
              Join the Trivia-Party
            </h1>
            <form action="/join-room" method="POST" className="space-y-4">
              <div>
                <label
                  htmlFor="room-code"
                  className="block text-sm font-bold mb-2 text-gray-200"
                >
                  Room Code
                </label>
                <input
                  type="text"
                  id="room-code"
                  name="roomCode"
                  placeholder="Enter room code"
                  required
                  className="w-full p-3 border border-red-500 rounded-lg bg-gray-800 text-gray-200"
                />
              </div>
              <div>
                <label
                  htmlFor="player-name"
                  className="block text-sm font-bold mb-2 text-gray-200"
                >
                  Player Name
                </label>
                <input
                  type="text"
                  id="player-name"
                  name="playerName"
                  placeholder="Enter your sinister alias"
                  required
                  className="w-full p-3 border border-red-500 rounded-lg bg-gray-800 text-gray-200"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg"
              >
                Join Room
              </button>
              <p className="message text-center mt-4">
                <a
                  href="/game"
                  className="text-orange-400 hover:text-orange-500 font-semibold"
                >
                  Create Room
                </a>
                {roles.includes('admin') && (
                  <a
                    className="text-orange-400 hover:text-orange-500 font-semibold ml-4"
                    href="/addquestion"
                  >
                    Add question
                  </a>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
      <Layout />
    </>
  );
}
