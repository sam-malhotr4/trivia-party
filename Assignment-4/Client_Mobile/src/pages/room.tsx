import React from 'react';
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

const Room: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <Navbar />
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="ion-margin-top">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center text-red-500">
              Join the Trivia-Party
            </IonCardTitle>
          </IonCardHeader>
          <form action="/join-room" method="POST">
            <IonItem>
              <IonLabel position="floating">Room Code</IonLabel>
              <IonInput type="text" name="roomCode" required />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Player Name</IonLabel>
              <IonInput type="text" name="playerName" required />
            </IonItem>

            <IonButton expand="block" type="submit" color="danger">
              Join Room
            </IonButton>

            <IonText className="ion-text-center ion-margin-top">
              <p>
                <a href="/game" className="text-orange-400 hover:text-orange-500 font-semibold">
                  Create Room
                </a>
              </p>
            </IonText>
          </form>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Room;

