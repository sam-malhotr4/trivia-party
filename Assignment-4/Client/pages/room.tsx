import React, { useState, useEffect } from 'react'; // Ensure React and hooks are imported
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { DecodedToken } from '@/interfaces/RoomInterface';
// Token Parsing Utility
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
  const [username, setUsername] = useState<string>(''); // Username of the player
  const [roomCode, setRoomCode] = useState<string>(''); // Room code entered by the user
  const router = useRouter(); // Next.js router instance

  // Handle creating a room
  const handleCreateRoom = async () => {
    if (!username) {
      alert('Please enter a username before creating a room.'); // Validation
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3001/rooms/create_room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }), 
      });
  
      if (response.ok) {
        const { roomCode } = await response.json(); // Extract room code

        router.push(`/lobby?room=${roomCode}`); // Navigate to lobby with roomCode
      } else {
        const errorMessage = await response.text();
        console.error('Failed to create room:', errorMessage);
        alert('Failed to create room. Please try again.');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('An error occurred while creating the room.');
    }
  };

  // Handle Join Room functionality
  const handleJoinRoom = async () => {
    if (!roomCode || !username) {
      alert('Please enter both a room code and username to join.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3001/rooms/join_room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, username }), // Pass roomCode and username
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Joined room successfully:', data);
        router.push(`/lobby?room=${roomCode}`); // Navigate to lobby with roomCode
      } else {
        const errorMessage = await response.text();
        console.error('Failed to join room:', errorMessage);
        alert('Failed to join room. Please check the room code and try again.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('An error occurred while joining the room.');
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
            <form onSubmit={(e) => {
                  e.preventDefault(); // Prevent default page refresh
                  handleJoinRoom(); // Call the join room function
                }} 
              className="space-y-4">
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
              <button
                type="button"
                onClick={handleJoinRoom}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg"
              >
                Join Room
              </button>
              <p className="message text-center mt-4">
              <button
                type="button"
                onClick={handleCreateRoom}
                className="text-orange-400 hover:text-orange-500 font-semibold"
              >
                Create Room
              </button>
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