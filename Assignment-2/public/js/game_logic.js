let selectedOption = null;
let currentQuestionId = null;
let timer;
const totalTime = 100; // Reduced for testing, change back to 30 as needed

// Fetch a random question from the API
async function fetchQuestion() {
    try {
        const response = await fetch('http://localhost:3001/questions/random');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Fetched question data:', data); // Log fetched data
        currentQuestionId = data._id; // Save the current question ID
        console.log("Question id: ",currentQuestionId);
        // Update the question and options in the DOM
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
            submitAnswer(); // Auto-submit the answer if time runs out
        }
    }, 1000);
}


function selectOption(element) {
    clearInterval(timer); // Stop the timer when an option is selected
    selectedOption = element.innerText.split(') ')[1]; // Should be 'A', 'B', 'C', or 'D'
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
// Submit the answer to the API

let playerScores = [0, 0, 0]; // Example: Player 1, Player 2, Player 3 scores
let currentPlayerIndex = 0; // Track which player is currently answering

// Function to update player scores
function updatePlayerScore(playerIndex, points) {
    playerScores[playerIndex] += points;
    console.log(playerScores[playerIndex])
    document.querySelectorAll('.player-icon').forEach((icon, index) => {
        icon.title = `Player ${index + 1}: ${playerScores[index]}pts`; // Update the title attribute
    });
}


// Modify the submitAnswer function to update the score based on the answer
async function submitAnswer() {
    console.log('Selected Option:', selectedOption);
    console.log('Current Question ID:', currentQuestionId);
    if (!selectedOption || !currentQuestionId) {
        alert('Please select an option!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/answers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                questionId: currentQuestionId,
                selectedOption: selectedOption,
            }),
        });

        const data = await response.json();
        console.log("fetched data: ", data);
        const resultText = data.result === 'win' ? 'Correct! You win!' : 'Incorrect! Try again';

        // Update score if the answer is correct
        if (data.result === 'win') {
            updatePlayerScore(currentPlayerIndex, 10); // Award 10 points for a correct answer
        }

        // Display the result on the page
        document.getElementById('result').innerText = resultText;

        // Reset selection and move to the next player
        selectedOption = null;
        currentQuestionId = null;
        currentPlayerIndex = (currentPlayerIndex + 1) % playerScores.length; // Move to the next player

        // Reset the countdown display
        document.querySelector('.countdown').innerText = `${totalTime}s`;

        // Fetch a new question after a delay
        setTimeout(() => {
            fetchQuestion(); // Fetch a new question after 1 second
        }, 1000);
    } catch (error) {
        console.error('Error submitting answer:', error);
    }

}

// Call fetchQuestion() to load the first question when the page loads
document.addEventListener('DOMContentLoaded', fetchQuestion);
