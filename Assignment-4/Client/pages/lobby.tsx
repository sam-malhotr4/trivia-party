import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface Player {
  id: string;
  name: string;
  isHost: boolean;
}

export default function Lobby() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>('Waiting for players to join...');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const { room } = router.query;

    if (room) {
      setRoomCode(room as string);

      const token = localStorage.getItem('authToken');
      const username = token ? JSON.parse(atob(token.split('.')[1]))?.username : null;
      setCurrentUser(username);

      const socketInstance = io('http://localhost:3001', {
        query: { roomCode: room },
      });

      socketInstance.on('connect', () => {
        console.log('Connected to WebSocket');
      });

      socketInstance.on('playerUpdate', (updatedPlayers: Player[]) => {
        setPlayers(updatedPlayers);
        if (updatedPlayers.length >= 2) {
          setMessage('Waiting to start the game.');
        } else {
          setMessage('Waiting for players to join...');
        }
      });

      socketInstance.on('playerJoined', (player: Player) => {
        toast.success(`${player.name} joined the room!`);
      });

      socketInstance.on('playerLeft', (player: Player) => {
        toast.error(`${player.name} left the room.`);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [router.query]);

  // Handle leaving the room
  const leaveRoom = async () => {
    if (!currentUser) {
      toast.error('You are not logged in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/rooms/leave_room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser }),
      });

      if (response.ok) {
        const { message } = await response.json();
        toast.success(message);
        router.push('/room'); // Redirect to the room creation page
      } else {
        const errorMessage = await response.text();
        console.error('Failed to leave room:', errorMessage);
        toast.error('Failed to leave room.');
      }
    } catch (error) {
      console.error('Error leaving room:', error);
      toast.error('An error occurred while leaving the room.');
    }
  };

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center w-full max-w-xl">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Lobby</h1>
        <p className="text-gray-300 text-lg mb-4">
          Room Code: <span className="font-bold text-white">{roomCode}</span>
        </p>
        <div className="bg-gray-700 p-4 rounded-md mb-4">
          <h2 className="text-xl font-bold text-gray-200 mb-2">Players</h2>
          <AnimatePresence>
            {players.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-400"
              >
                No players joined yet.
              </motion.p>
            ) : (
              <ul className="space-y-2">
                {players.map((player) => (
                  <motion.li
                    key={player.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-2 bg-gray-600 rounded text-gray-200 relative"
                  >
                  {player.isHost && (
                    <span className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Host
                    </span>
                    )}
                    {player.name}
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </div>
        <p className="text-gray-300 mb-4">{message}</p>
        <button
          onClick={leaveRoom}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
