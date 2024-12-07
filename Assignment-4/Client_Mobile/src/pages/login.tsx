import React, { useState } from 'react';
import {
  IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const lowerCaseUsername = username.toLowerCase();

    if (!lowerCaseUsername || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token); // Save token
        history.push('/room'); // Redirect
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <IonPage className="bg-secondary">
      <Navbar />

      <IonContent className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700"
        >
          <h1 className="text-white text-3xl font-bold text-center mb-6">Login</h1>

          <IonItem className="bg-gray-700 rounded-md mb-4">
            <IonLabel position="floating" className="text-gray-400">Username</IonLabel>
            <IonInput
              value={username}
              onIonChange={(e) => setUsername(e.detail.value || '')}
              required
            />
          </IonItem>

          <IonItem className="bg-gray-700 rounded-md mb-4">
            <IonLabel position="floating" className="text-gray-400">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value || '')}
              required
            />
          </IonItem>

          {error && (
            <IonText color="danger">
              <p className="text-red-500 text-center mb-4">{error}</p>
            </IonText>
          )}

          <IonButton
            expand="block"
            type="submit"
            className="w-full py-3 bg-primary hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-md"
          >
            Login
          </IonButton>

          <IonText className="text-center text-gray-400 mt-4">
            <p>
              Not registered?{' '}
              <a
                href="/register"
                className="text-primary hover:text-red-600 transition-all font-semibold"
              >
                Create an account
              </a>
            </p>
          </IonText>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
