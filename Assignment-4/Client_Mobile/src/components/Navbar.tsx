import React, { useEffect, useState } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonMenuButton,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const history = useHistory();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token); // Set logged-in state based on token presence
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token on logout
    setIsLoggedIn(false); // Update login state
    history.push('/login'); // Redirect to login page
  };

  return (
    <IonHeader>
      <IonToolbar>
        {/* App Title */}
        <IonTitle className="ion-text-center">👾 Trivia-Party</IonTitle>

        {/* Mobile Menu Button */}
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>

        {/* Navigation Buttons */}
        <IonButtons slot="end">
          <IonButton onClick={() => history.push('/')}>Home</IonButton>
          <IonButton onClick={() => history.push('/about')}>About</IonButton>

          {/* Conditional Button Rendering */}
          {isLoggedIn ? (
            <IonButton color="danger" onClick={handleLogout}>
              Logout
            </IonButton>
          ) : (
            <IonButton color="primary" onClick={() => history.push('/login')}>
              Login
            </IonButton>
          )}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Navbar;
