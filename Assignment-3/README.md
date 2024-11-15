Assignment-3:

In the Question-Answers API, we implemented authentication and authorization to ensure secure access and proper role management. Authentication is handled using JSON Web Tokens (JWT), where users log in and receive a token containing their details, such as username, user ID, and roles. This token is stored on the client-side and sent with each API request to prove the user’s identity.
On the backend, the token is validated through a guard, ensuring that only authenticated users can access the API. 
 
 Authorization is managed through roles, which are embedded in the token when it is generated. Each user is assigned specific roles, such as user or admin, which define what they are allowed to do. 
 For example, regular users can fetch and answer questions, while admin users have additional privileges, like managing questions. The roles are checked using a RolesGuard to ensure only users with the right permissions can access restricted routes. 
 
 Together, authentication and role-based authorization create a secure system where each user’s actions are restricted to what they are authorized to perform, protecting sensitive functionalities and maintaining the integrity of the API.


 