import React, { useState, useEffect } from 'react'; // Ensure React and hooks are imported
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { DecodedToken } from '@/interfaces/RoomInterface';

const parseJwt = (token: string): DecodedToken | null => {
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

const Room = () => {
  const [roles, setRoles] = useState<string[]>([]); // State for roles
  const [username, setUsername] = useState<string>(''); // Capture username from input
  const [roomCode, setRoomCode] = useState<string>(''); // State for room code
  const router = useRouter(); // Next.js router instance

  // Handle creating a room
  const handleCreateRoom = async () => {
    try {
      const response = await fetch('http://localhost:3001/rooms/create_room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }), 
      });
      if (response.ok) {
        const data = await response.json();
        const { roomCode } = data;
        console.log('Room created successfully:', data);

        // Redirect to the lobby page with the roomCode
        router.push(`/lobby?roomCode=${roomCode}`);
      } else {
        const errorText = await response.text();
        console.error('Failed to create room:', errorText);
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  // Handle joining a room
  const handleJoinRoom = async () => {
    try {
      const response = await fetch('http://localhost:3001/rooms/join_room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, username }), // Pass the roomCode and username
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Joined room successfully:', data);

        
        router.push(`/lobby?roomCode=${roomCode}`);
      } else {
        const errorText = await response.text();
        console.error('Failed to join room:', errorText);
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
      if (token) {
        const decoded = parseJwt(token); // Decode the token
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
            <form method="POST" className="space-y-4">
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
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)} // Update roomCode state
                  required
                  className="w-full p-3 border border-red-500 rounded-lg bg-gray-800 text-gray-200"
                />
              </div>
              <div>
                <label
                  htmlFor="player-name"
                  className="block text-sm font-bold mb-2 text-gray-200"
                >
                  Player Username
                </label>
                <input
                  type="text"
                  id="player-name"
                  name="playerName"
                  placeholder="Enter your sinister alias"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} // Updating state
                  required
                  className="w-full p-3 border border-red-500 rounded-lg bg-gray-800 text-gray-200"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleJoinRoom}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg"
                >
                  Join Room
                </button>
                <button
                  type="button"
                  onClick={handleCreateRoom}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg"
                >
                  Create Room
                </button>
              </div>
              <p className="message text-center mt-4">
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

export default Room;
