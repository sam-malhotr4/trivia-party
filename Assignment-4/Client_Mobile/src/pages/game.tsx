import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

interface Question {
  _id: string;
  question: string;
  options: string[];
}

const Game: React.FC = () => {
  const [question, setQuestion] = useState < Question | null > (null);
  const [selectedOption, setSelectedOption] = useState < string | null > (null);
  const [currentQuestionId, setCurrentQuestionId] = useState < string | null > (null);
  const [timeRemaining, setTimeRemaining] = useState < number > (30);
  const [resultMessage, setResultMessage] = useState < string > ('');
  const [playerScores, setPlayerScores] = useState < number[] > ([0, 0, 0]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState < number > (0);
  const history = useHistory();

  const token = localStorage.getItem('authToken');

  const fetchQuestion = async () => {
    try {
      const response = await fetch('http://localhost:3001/questions/random', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching question: ${response.statusText}`);
      }

      const data = await response.json();
      setQuestion(data);
      setCurrentQuestionId(data._id);
      setTimeRemaining(30);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  useEffect(() => {
    if (!token) {
      history.push('/login');
    } else {
      fetchQuestion();
    }
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    submitAnswer(option);
  };

  const submitAnswer = async (option: string) => {
    if (!currentQuestionId) return;

    try {
      const response = await fetch('http://localhost:3001/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: currentQuestionId,
          selectedOption: option,
        }),
      });

      const data = await response.json();
      setResultMessage(data.result === 'win' ? 'Correct! You win!' : 'Incorrect! Try again');

      if (data.result === 'win') {
        updatePlayerScore(currentPlayerIndex, 10);
      }

      setSelectedOption(null);
      setCurrentQuestionId(null);
      setCurrentPlayerIndex((prev) => (prev + 1) % playerScores.length);

      fetchQuestion();
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const updatePlayerScore = (playerIndex: number, points: number) => {
    setPlayerScores((prevScores) => {
      const updatedScores = [...prevScores];
      updatedScores[playerIndex] += points;
      return updatedScores;
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Trivia Game</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="ion-text-center">{question?.question}</IonCardTitle>
          </IonCardHeader>
        </IonCard>

        <IonGrid>
          <IonRow>
            {question?.options.map((option, index) => (
              <IonCol size="6" key={index}>
                <IonButton
                  expand="block"
                  color={selectedOption === option ? 'danger' : 'dark'}
                  onClick={() => handleOptionSelect(option)}
                >
                  {String.fromCharCode(65 + index)}) {option}
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonText className="ion-text-center">
          <h3>Time Remaining: {timeRemaining}s</h3>
        </IonText>

        <IonText className="ion-text-center">
          <h3>{resultMessage}</h3>
        </IonText>

        <IonButton expand="block" color="medium" onClick={() => history.push('/')}>
          Quit Game
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Game;
