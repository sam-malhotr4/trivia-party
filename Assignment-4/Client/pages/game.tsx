import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Navbar from '@/components/Navbar';

interface Question {
  question: string;
  options: string[];
  _id: string;
}

interface PlayerScore {
  username: string;
  score: number;
}

const Game: React.FC = () => {
  const [question, setQuestion] = useState<string>('Loading question...');
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const username = token ? JSON.parse(atob(token.split('.')[1]))?.username : null;
    setCurrentUser(username);

    if (!token) {
      alert('You are not logged in!');
      window.location.href = '/login';
      return;
    }

    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      socketInstance.emit('joinGame', { username });
    });

    socketInstance.on('newQuestion', (data: Question) => {
      setQuestion(data.question);
      setOptions(data.options);
      setCurrentQuestionId(data._id);
      setSelectedOption(null);
      setTimeRemaining(30);
      setResultMessage('');
    });

    socketInstance.on('updateScores', (scores: PlayerScore[]) => {
      setPlayerScores(scores);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      submitAnswer(); // Automatically submit when time runs out
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining]);

  const submitAnswer = (option?: string) => {
    if (!option || !currentQuestionId || !socket) {
      alert('Please select an option!');
      return;
    }

    socket.emit('submitAnswer', { questionId: currentQuestionId, option });
    setSelectedOption(option);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="w-full max-w-2xl p-6 rounded-lg shadow-lg border-2 border-red-600 transition-all duration-300 ease-in-out hover:border-4 hover:border-red-800">
          <div className="flex flex-col bg-black p-6 rounded-lg shadow-lg w-full flex-2">
            <div className="question mb-5 text-white text-5xl text-center">{question}</div>
            <div className="options flex flex-col gap-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`option py-4 px-6 bg-black text-gray-200 border-2 rounded-lg transition-all duration-300 ease-in-out ${
                    selectedOption === option
                      ? 'bg-red-500 text-white border-red-600'
                      : 'hover:bg-red-700 hover:border-red-700'
                  }`}
                  onClick={() => submitAnswer(option)}
                  disabled={!!selectedOption}
                >
                  {String.fromCharCode(65 + index)}) {option}
                </button>
              ))}
            </div>
          </div>
          <div className="timer text-center text-lg font-semibold mb-4">
            Time Remaining: <span className="text-red-500">{timeRemaining}s</span>
          </div>
          <div id="result" className="text-center text-lg font-bold mb-4">
            {resultMessage}
          </div>
          <div className="player-box flex justify-around mt-4">
            {playerScores.map((player, index) => (
              <div
                key={index}
                className="player-icon text-center bg-gray-700 py-2 px-4 rounded-lg shadow-md"
                title={`${player.username}: ${player.score} pts`}
              >
                <p className="text-red-500 font-bold">{player.username}</p>
                <p className="text-white">{player.score} pts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;