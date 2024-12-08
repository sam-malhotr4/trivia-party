import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';

interface Player {
  id: string;
  name: string;
}

const Lobby: React.FC = () => {
  const [roomCode, setRoomCode] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>('Waiting for players to join...');
  const history = useHistory();

  // WebSocket connection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room) {
      setRoomCode(room);

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
  }, []);

  // Handle leaving the room
  const leaveRoom = async () => {
    try {
      if (socket) {
        socket.emit('leaveRoom', { roomCode });
      }

      const response = await fetch(`/api/leave_room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode }),
      });

      if (response.ok) {
        history.push('/room'); // Redirect to the room page
      }
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  return (
    <IonPage>
      <Navbar/>

      <IonContent className="ion-padding bg-gray-900 text-white">
        <Toaster position="top-center" reverseOrder={false} />

        <IonCard className="max-w-lg mx-auto bg-gray-800 text-white rounded-xl shadow-lg p-8">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center text-red-500">
              Room Code: <span className="font-bold text-white">{roomCode}</span>
            </IonCardTitle>
          </IonCardHeader>

          {/* Players List */}
          <IonList className="bg-gray-700 p-4 rounded-md mb-4">
            <IonCardTitle className="text-xl font-bold text-gray-200 mb-2">Players</IonCardTitle>
            <AnimatePresence>
              {players.length === 0 ? (
                <motion.p
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-400"
                >
                  No players joined yet.
                </motion.p>
              ) : (
                players.map((player) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <IonItem className="p-2 bg-gray-600 rounded text-gray-200">
                      <IonLabel>{player.name}</IonLabel>
                    </IonItem>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </IonList>

          {/* Message */}
          <IonText className="ion-text-center text-gray-300 mb-4 block">
            {message}
          </IonText>

          {/* Leave Room Button */}
          <IonButton
            expand="block"
            onClick={leaveRoom}
            color="danger"
            className="font-bold text-lg py-2 rounded-md"
          >
            Leave Room
          </IonButton>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Lobby;
