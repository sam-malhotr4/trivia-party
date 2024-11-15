Assignment-3:

In the Question-Answers API, we implemented authentication and authorization to ensure secure access and proper role management. Authentication is handled using JSON Web Tokens (JWT), where users log in and receive a token containing their details, such as username, user ID, and roles. This token is stored on the client-side and sent with each API request to prove the user’s identity.
On the backend, the token is validated through a guard, ensuring that only authenticated users can access the API. 
 
 Authorization is managed through roles, which are embedded in the token when it is generated. Each user is assigned specific roles, such as user or admin, which define what they are allowed to do. 
 For example, regular users can fetch and answer questions, while admin users have additional privileges, like managing questions. The roles are checked using a RolesGuard to ensure only users with the right permissions can access restricted routes. 
 
 Together, authentication and role-based authorization create a secure system where each user’s actions are restricted to what they are authorized to perform, protecting sensitive functionalities and maintaining the integrity of the API.


In order to test these API:
 1.Use Postman to cheak endpoints

 Example:
 1.Register on the registertion page
 2.Login using the same credentials
 

 After Login a Token will be generated (can be cheaked in the developer tools in the browser). copy the same and add it to the Auth tab in the postman.

 after adding use method GET and paste the Endpoint(http://localhost:3001/questions/random) if the token is correct the information will be fetched and give status code 200 
 Example:
 {
    "_id": "671fc275e5d854174d3733aa",
    "question": "What is the smallest country in the world?",
    "options": [
        "Monaco",
        "Malta",
        "Vatican City",
        "San Marino"
    ],
    "correctAnswer": "Vatican City"
 }

 if not it'll give: status code:401

 {
    "message": "Unauthorized",
    "statusCode": 401
}

Same way we can cheak the Answer api:
just change the method to POST (http://localhost:3001/answers)

add the token

In the body tag:
{
  "questionId": "671fc275e5d854174d3733c0",
  "selectedOption": "nile"
}

It'll give the result:
{
    "result": "win"
}
If the token is correct else ill give


 {
    "message": "Unauthorized",
    "statusCode": 401
}


ROLES: For now we have implemented two Roles ie Admin and User
Both User and admin  can fetch the question API.
Only admin can add question
For testing purpose added a admin only endpoint which can be cheaked using Postman

Login as admin : In this case
{
  "username":"adminuser",
  "password":"adminpassword"
}

Choose method as GET (http://localhost:3001/questions/admin-only)

It'll generate a token which will be different from the token of user.
add it in the auth tab

if everything is correct: 200 OK
{
    "message": "This is an admin-only endpoint"
}
else 
{
    "message": "Unauthorized",
    "statusCode": 401
}

