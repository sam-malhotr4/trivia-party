import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
} from '@ionic/react';
import Navbar from '../components/Navbar';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token); // Set login status based on token
  }, []);

  return (
    <IonPage>
      <Navbar />

      <IonContent className="ion-padding">
        <IonCard className="max-w-lg mx-auto bg-gray-900 text-white rounded-xl shadow-lg mt-16 border border-gray-800">
          <IonCardHeader className="text-center p-8">
            <IonCardTitle className="text-5xl font-bold text-white">
              Welcome to <span className="text-red-500">Trivia Party</span>
            </IonCardTitle>
            <IonCardSubtitle className="mt-4 text-lg text-gray-400">
              Enter the world of excitement, challenge, and fun!
            </IonCardSubtitle>
          </IonCardHeader>

          <div className="p-8">
            {isLoggedIn ? (
              <IonButton
                expand="block"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-3 rounded-lg transition-all shadow-md"
                onClick={() => history.push('/room')}
              >
                Start Playing
              </IonButton>
            ) : (
              <IonButton
                expand="block"
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg py-3 rounded-lg transition-all shadow-md"
                onClick={() => history.push('/login')}
              >
                Start Playing
              </IonButton>
            )}
          </div>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
