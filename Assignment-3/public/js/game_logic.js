let selectedOption = null;
let currentQuestionId = null;
let timer;
const totalTime = 30; 

// Fetch a random question from the API
async function fetchQuestion() {
    try {
        const token = localStorage.getItem('authToken'); 
        if (!token) {
            alert('You are not logged in!');
            window.location.href = './Login.html';
            return;
        }
        const response = await fetch('http://localhost:3001/questions/random', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
        });

        console.log("auth token :",token)
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Fetched question data:', data); 
        currentQuestionId = data._id; 
        console.log("Question id: ",currentQuestionId);
        
        document.getElementById('question-text').innerText = data.question;
        document.getElementById('option-a').innerText = data.options[0];
        document.getElementById('option-b').innerText = data.options[1];
        document.getElementById('option-c').innerText = data.options[2];
        document.getElementById('option-d').innerText = data.options[3];

        
        startTimer(totalTime);
    } catch (error) {
        console.error('Error fetching question:', error);
    }
}

// Start the timer
function startTimer(duration) {
    let timeRemaining = duration;
    document.querySelector('.countdown').innerText = `${timeRemaining}s`;

    timer = setInterval(() => {
        timeRemaining--;
        document.querySelector('.countdown').innerText = `${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            alert('Time is up!');
            submitAnswer(); 
        }
    }, 1000);
}


function selectOption(element) {
    clearInterval(timer); 
    selectedOption = element.innerText.split(') ')[1]; 
    console.log('Selected option:', selectedOption); 
     clearSelection();
    element.classList.add('selected');
    submitAnswer();
}
function clearSelection() {
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
}


let playerScores = [0, 0, 0]; 
let currentPlayerIndex = 0; 


function updatePlayerScore(playerIndex, points) {
    playerScores[playerIndex] += points;
    console.log(playerScores[playerIndex])
    document.querySelectorAll('.player-icon').forEach((icon, index) => {
        icon.title = `Player ${index + 1}: ${playerScores[index]}pts`; 
    });
}



async function submitAnswer() {
    console.log('Selected Option:', selectedOption);
    console.log('Current Question ID:', currentQuestionId);
    if (!selectedOption || !currentQuestionId) {
        alert('Please select an option!');
        return;
    }

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3001/answers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                questionId: currentQuestionId,
                selectedOption: selectedOption,
            }),
        });

        const data = await response.json();
        console.log("fetched data: ", data);
        const resultText = data.result === 'win' ? 'Correct! You win!' : 'Incorrect! Try again';

        
        if (data.result === 'win') {
            updatePlayerScore(currentPlayerIndex, 10); 
        }

       
        document.getElementById('result').innerText = resultText;

        
        selectedOption = null;
        currentQuestionId = null;
        currentPlayerIndex = (currentPlayerIndex + 1) % playerScores.length; player

  
        document.querySelector('.countdown').innerText = `${totalTime}s`;

        
        setTimeout(() => {
            fetchQuestion(); 
        }, 1000);
    } catch (error) {
        console.error('Error submitting answer:', error);
    }

}


document.addEventListener('DOMContentLoaded', fetchQuestion);
