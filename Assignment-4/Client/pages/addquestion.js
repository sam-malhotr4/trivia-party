import React, { useState, useEffect } from 'react';


const AddQuestion = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;


  const parseJwt = (token) => {
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
    try {
      console.log("token:",token)
 
      if (token) {
        const decoded = parseJwt(token); 
        console.log("decoded:",decoded);
        
        setRoles(decoded?.roles || []); 
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!roles.includes('admin')) {
      console.log("Roles:",roles);
      
      setError('Unauthorized access: Only admins can add questions.');
      return;
    }

    if (options.some(option => option.trim() === '')) {
      setError('All options must be filled.');
      return;
    }

    setIsSubmitting(true);
    setError('');

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
          Authorization : `Bearer ${token}`
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Add Question</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Question:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Options:</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
              style={{ width: '100%', marginBottom: '8px' }}
            />
          ))}
        </div>
        <div>
          <label>Correct Answer:</label>
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" disabled={isSubmitting} style={{ marginTop: '16px' }}>
          {isSubmitting ? 'Submitting...' : 'Add Question'}
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
