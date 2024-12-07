import { useState, useEffect } from 'react';
import { Question, AnswerResponse } from '../interfaces/GameInterface';

const Game: React.FC = () => {
  const [question, setQuestion] = useState < string > ('Loading question...');
  const [options, setOptions] = useState < string[] > ([]);
  const [selectedOption, setSelectedOption] = useState < string | null > (null);
  const [currentQuestionId, setCurrentQuestionId] = useState < string | null > (null);
  const [timeRemaining, setTimeRemaining] = useState < number > (30);
  const [resultMessage, setResultMessage] = useState < string > ('');
  const [playerScores, setPlayerScores] = useState < number[] > ([0, 0, 0]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState < number > (0);
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  useEffect(() => {
    if (!token) {
      alert('You are not logged in!');
      window.location.href = '/login';
      return;
    }
    fetchQuestion();
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      alert('Time is up!');
      submitAnswer();
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining]);

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

      const data: Question = await response.json();
      setResultMessage('');
      setQuestion(data.question);
      setOptions(data.options);
      setCurrentQuestionId(data._id);
      setTimeRemaining(30);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    submitAnswer(option);
  };

  const submitAnswer = async (option?: string) => {
    if (!option || !currentQuestionId) {
      alert('Please select an option!');
      return;
    }

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

      const data: AnswerResponse = await response.json();
      setResultMessage(data.result === 'win' ? 'Correct! You win!' : 'Incorrect! Try again');

      if (data.result === 'win') {
        updatePlayerScore(currentPlayerIndex, 10);
      }

      setSelectedOption(null);
      setCurrentQuestionId(null);
      setCurrentPlayerIndex((prev) => (prev + 1) % playerScores.length);

      setTimeout(fetchQuestion, 1000);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-3/4 max-w-2xl p-6 bg-gray-900 rounded-lg shadow-lg border-2 border-red-500">
        <h2 className="text-2xl font-bold text-center text-red-500 mb-6">{question}</h2>
        <div className="options grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {options.map((option, index) => (
            <button
              key={index}
              className={`option py-2 px-4 border-2 rounded-lg ${selectedOption === option
                  ? 'bg-red-500 text-white border-red-600'
                  : 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-red-700 hover:border-red-700'
                }`}
              onClick={() => handleOptionSelect(option)}
            >
              {String.fromCharCode(65 + index)}) {option}
            </button>
          ))}
        </div>
        <div className="timer text-center text-lg font-semibold mb-4">
          Time Remaining: <span className="text-red-500">{timeRemaining}s</span>
        </div>
        <div id="result" className="text-center text-lg font-bold mb-4">
          {resultMessage}
        </div>
        <div className="player-box flex justify-around">
          {playerScores.map((score, index) => (
            <div
              key={index}
              className="player-icon text-center bg-gray-800 py-2 px-4 rounded-lg"
              title={`Player ${index + 1}: ${score}pts`}
            >
              <p className="text-red-500 font-bold">P{index + 1}</p>
              <p className="text-white">{score} pts</p>
            </div>
          ))}
        </div>
      </div>
      <button>Quit Game</button>
    </div>
  );
};

export default Game;
