Trivia-party
A cross-platform trivia game website that allows real-time competition between multiple players as they compete against each other to score the highest amount of points and stay alive till the final round and win. The basic concept of the game is that one user can create a "lobby" for other users to join, of which this user becomes the "VIP" who can control when to close the room and other settings. Each player needs an account to join the game IF they want to save their settings and get achievements, otherwise they can play with just a name if a user is in a hurry.

Website Structure:
Home page: The homepage is the basic landing page from where the users can access all the other pages of the website. There's a navbar structure up top for the user to navigate to the other pages as well as a button to take them straight to begin their own game.
Login page: The login page brings the user the option to login into their account. If they aren't registered they can create an account or they can continue without login if they're just joining someone else's room.
Registration page: Similar to the login page, except here a user can CREATE their account which gives them the access to create lobbies as well as get achievements.
Room page: Here the users are prompted to enter the particular room code for the lobby they're meant to join. The room code is meant to be a way to isolate lobbies and to allow players to play with their friends.
Main gamepage: This page is where all the action is supposed to happen. The page will have trivia questions and corresponding options on the left and a time limit to answer denoted by the timer in the middle. On the right is the list of players currently in the room and users can hover over them to check out other users points.
Final Round page: This is a particular page that will only be opened when certain conditions are met on the main game page, and once those conditions are met then this page will be opened. This will be the final page before the game ends.

API :
Questions API:
The Questions API is responsible for retrieving random trivia questions from a database and delivering them to the frontend application. When a request is made to the API, it selects a random question document, which includes the question text and multiple-choice options but excludes the correct answer to maintain game fairness. This allows players to see a variety of questions without knowing the correct answer in advance. The Questions API thus acts as the main source of trivia content, it provides a fresh question each time it is called.

Answers API:
The Answers API is designed to handle player responses by validating them against the correct answers stored in the database. When a player submits an answer, the API checks the selected option against the correct answer for that specific question. Based on this comparison, it returns a result indicating whether the answer is correct ("win") or incorrect ("lose"). This feedback is then displayed to the player, adding interactivity and instant validation to the trivia game. The Answers API thus ensures fair scoring and accuracy in gameplay by securely validating each response.






