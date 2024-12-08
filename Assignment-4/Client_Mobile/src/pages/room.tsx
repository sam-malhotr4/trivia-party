import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from '@ionic/react';
import Navbar from '../components/Navbar';
import { useHistory } from 'react-router-dom';

// Token Parsing Utility
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

const Room: React.FC = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [username, setUsername] = useState<string>('');
  const [roomCode, setRoomCode] = useState<string>('');
  const history = useHistory();

  // Handle creating a room
  const handleCreateRoom = async () => {
    if (!username) {
      alert('Please enter a username before creating a room.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/rooms/create_room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const { roomCode } = await response.json();
        history.push(`/lobby?room=${roomCode}`); // Navigate to lobby with roomCode
      } else {
        alert('Failed to create room. Please try again.');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('An error occurred while creating the room.');
    }
  };

  // Handle joining a room
  const handleJoinRoom = async () => {
    if (!roomCode || !username) {
      alert('Please enter both a room code and username to join.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/rooms/join_room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, username }),
      });

      if (response.ok) {
        history.push(`/lobby?room=${roomCode}`); // Navigate to lobby with roomCode
      } else {
        alert('Failed to join room. Please check the room code and try again.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('An error occurred while joining the room.');
    }
  };

  // Load roles from token
  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decoded = parseJwt(token);
        setRoles(decoded?.roles || []);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []);

  return (
    <IonPage>
      <Navbar />

      <IonContent className="ion-padding">
        <IonCard className="max-w-lg mx-auto bg-gray-900 text-white rounded-xl shadow-lg mt-16 border border-gray-800 p-8">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center text-red-500">
              Join the Trivia-Party
            </IonCardTitle>
          </IonCardHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleJoinRoom();
            }}
          >
            {/* Room Code Input */}
            <IonItem className="bg-gray-800 rounded-md mb-4">
              <IonLabel position="floating">Room Code</IonLabel>
              <IonInput
                value={roomCode}
                onIonChange={(e) => setRoomCode(e.detail.value || '')}
                required
              />
            </IonItem>

            {/* Player Username Input */}
            <IonItem className="bg-gray-800 rounded-md mb-4">
              <IonLabel position="floating">Player Username</IonLabel>
              <IonInput
                value={username}
                onIonChange={(e) => setUsername(e.detail.value || '')}
                required
              />
            </IonItem>

            {/* Join Room Button */}
            <IonButton
              expand="block"
              type="submit"
              className="ion-margin-top"
              color="danger"
            >
              Join Room
            </IonButton>

            {/* Create Room Button */}
            <IonButton
              expand="block"
              type="button"
              className="ion-margin-top"
              color="primary"
              onClick={handleCreateRoom}
            >
              Create Room
            </IonButton>

            {/* Admin Add Question Link */}
            {roles.includes('admin') && (
              <IonText className="ion-text-center mt-4 block">
                <a
                  href="/addquestion"
                  className="text-orange-400 hover:text-orange-500 font-semibold"
                >
                  Add Question
                </a>
              </IonText>
            )}
          </form>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Room;
