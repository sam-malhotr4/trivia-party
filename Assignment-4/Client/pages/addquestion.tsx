import Link from 'next/link';
import React, { useState, useEffect, FormEvent } from 'react';

const AddQuestion: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  // Token Parsing Function
  const parseJwt = (token: string | null): { roles?: string[] } | null => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      setRoles(decoded?.roles || []);
    }
  }, [token]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!roles.includes('admin')) {
      setError('Unauthorized access: Only admins can add questions.');
      return;
    }

    if (options.some((option) => option.trim() === '')) {
      setError('All options must be filled.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const questionData = {
      question,
      options,
      correctAnswer,
    };

    try {
      const response = await fetch(`http://localhost:3001/questions/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Unauthorized access: Only admins can add questions.');
        }
        throw new Error('Failed to add question. Please try again.');
      }

      alert('Question added successfully!');
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-xl p-8 mt-10 bg-gray-900 text-white rounded-lg shadow-lg border-2 border-red-500">
      <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">Add Question</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-bold mb-2">Question:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-red-500"
            placeholder="Enter the question"
          />
        </div>

        <div>
          <label className="block font-bold mb-2">Options:</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-red-500 mb-2"
            />
          ))}
        </div>

        <div>
          <label className="block font-bold mb-2">Correct Answer:</label>
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-red-500"
            placeholder="Enter the correct answer"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 font-bold rounded-lg ${
            isSubmitting ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'
          } text-white transition-colors`}
        >
          {isSubmitting ? 'Submitting...' : 'Add Question'}
        </button><br />
        <br />
        <Link href="/room">
      <button  className="w-full py-3 font-bold rounded-lg bg-red-500 hover:bg-red-600" >Back to Room</button>
      </Link>
      </form>
    </div>
  );
};

export default AddQuestion;
