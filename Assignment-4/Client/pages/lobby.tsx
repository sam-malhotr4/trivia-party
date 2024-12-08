import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface Player {
  id: string;
  username: string;
  isHost: boolean;
}

export default function Lobby() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Waiting for players to join...');

  const getRandomColor = () => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const { room } = router.query;

    if (room) {
      setRoomCode(room as string);

      const token = localStorage.getItem('authToken');
      const username = token ? JSON.parse(atob(token.split('.')[1]))?.username : null;
      setCurrentUser(username);

      const socketInstance = io('http://localhost:3001', {
        query: { roomCode: room },
        transports: ['websocket'],
      });

      socketInstance.on('connect', () => {
        socketInstance.emit('joinRoom', { roomCode, username });
      });

      socketInstance.on('playerUpdate', (updatedPlayers: Player[]) => {
        setPlayers(updatedPlayers);
        setMessage(
          updatedPlayers.length >= 2
            ? 'Waiting to start the game.'
            : 'Waiting for players to join...'
        );
      });

      socketInstance.on('playerJoined', (player: Player) => {
        toast.success(`${player.username} joined the room!`);
      });

      socketInstance.on('playerLeft', (player: Player) => {
        setPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== player.id));
        toast.error(`${player.username} left the room.`);
      });

      socketInstance.on('startGame', () => {
        router.push('/game');
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [router.query]);

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
        const { message, players: updatedPlayers } = await response.json();
        toast.success(message);
        setPlayers(updatedPlayers); // Update the lobby dynamically
        router.push('/room'); // Redirect to the room creation page
      } else {
        toast.error('Failed to leave the room.');
      }
    } catch (error) {
      console.error('Error leaving room:', error);
      toast.error('An error occurred while leaving the room.');
    }
  };

  const startGame = () => {
    if (socket) {
      socket.emit('startGame', { roomCode });
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
              <ul className="flex flex-wrap justify-center gap-4">
                {players.map((player) => (
                  <motion.li
                    key={player.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center relative"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold ${getRandomColor()}`}
                    >
                      {player.username[0]?.toUpperCase() || '?'}
                    </div>
                    {player.isHost && (
                      <span className="absolute -top-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Host
                      </span>
                    )}
                    <p className="text-gray-300 text-sm mt-2">{player.username || 'Unknown'}</p>
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </div>
        <p className="text-gray-300 mb-4">{message}</p>
        {players.find((player) => player.username === currentUser && player.isHost) && (
          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md mb-4"
          >
            Start Game
          </button>
        )}
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