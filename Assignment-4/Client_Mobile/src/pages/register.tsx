import React, { useState } from 'react';
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
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  // Registration Handler
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const lowerCaseUsername = username.toLowerCase();
    const lowerCaseEmail = email.toLowerCase();

    if (!lowerCaseUsername || !lowerCaseEmail || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please log in.');
        history.push('/login'); // Redirect to login page
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <IonPage>
      <Navbar />

      {/* Registration Form */}
      <IonContent className="ion-padding">
        <IonCard className="ion-margin-top ion-padding">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center text-red-500">
              Create a Sinister Account!
            </IonCardTitle>
          </IonCardHeader>

          {error && (
            <IonText color="danger" className="ion-text-center">
              <p>{error}</p>
            </IonText>
          )}

          <form id="register-form" onSubmit={handleRegister}>
            {/* Username Input */}
            <IonItem>
              <IonLabel position="floating">Username</IonLabel>
              <IonInput
                value={username}
                onIonChange={(e) => setUsername(e.detail.value || '')}
                required
              />
            </IonItem>

            {/* Email Input */}
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value || '')}
                required
              />
            </IonItem>

            {/* Password Input */}
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value || '')}
                required
              />
            </IonItem>

            {/* Submit Button */}
            <IonButton
              expand="block"
              type="submit"
              className="ion-margin-top"
              color="danger"
            >
              Register
            </IonButton>
          </form>

          <IonText className="ion-text-center ion-margin-top">
            <p>
              Already registered?{' '}
              <a
                href="/login"
                className="text-orange-400 hover:text-orange-500 font-semibold"
              >
                Login here
              </a>
            </p>
          </IonText>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Register;
