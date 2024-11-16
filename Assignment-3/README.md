# Question-Answers API
In the Question-Answers API, we implemented authentication and authorization to ensure secure access and proper role management.

### Authentication \
Authentication is handled using JSON Web Tokens (JWT). \
Users log in and receive a token containing their details, such as username, user ID, and roles.
The token is stored on the client side and sent with each API request to prove the user’s identity.
On the backend, the token is validated through a guard to ensure that only authenticated users can access the API. \
### Authorization \
Authorization is managed through roles, which are embedded in the token when it is generated.
Users are assigned specific roles, such as user or admin, which define their permissions: \
- Users can fetch and answer questions.
- Admins have additional privileges, such as managing questions.
- The roles are checked using a RolesGuard, ensuring that only users with the appropriate permissions can access restricted routes.
Together, authentication and role-based authorization create a secure system where users’ actions are restricted to their assigned permissions, protecting sensitive functionalities and maintaining the integrity of the API.

How to Test the API \
You can use Postman to test the endpoints. Below are examples to guide you:

1. Registration \
Use the POST method to register a new user.

Endpoint: \
http://localhost:3001/auth/register

Request Body (JSON):
```
json
Copy code
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "testpassword"
}
Expected Response:

json
Copy code
{
  "message": "User registered successfully",
  "user": {
    "username": "testuser",
    "email": "testuser@example.com",
    "roles": ["user"]
  }
}
```
2. Login \
Use the POST method to log in with your credentials. \

Endpoint:
http://localhost:3001/auth/login

Request Body (JSON): \

```
{
  "username": "testuser",
  "password": "testpassword"
}
```
Expected Response: \
```
{
  "access_token": "your_generated_jwt_token"
}
```
3. Fetch a Random Question \
Use the GET method to fetch a random question. Add the JWT token to the Authorization header in Postman. \

Endpoint:
http://localhost:3001/questions/random

Authorization:

Select Bearer Token in Postman and paste your token.
Expected Response (Example):
```
{
  "_id": "671fc275e5d854174d3733aa",
  "question": "What is the smallest country in the world?",
  "options": ["Monaco", "Malta", "Vatican City", "San Marino"],
  "correctAnswer": "Vatican City"
}
```
If the token is invalid or missing, you'll receive:

```
{
  "message": "Unauthorized",
  "statusCode": 401
}
```
4. Submit an Answer
Use the POST method to submit an answer.

Endpoint:
http://localhost:3001/answers


Authorization:

Add the JWT token to the Authorization header.
Request Body (JSON): \

```
{
  "questionId": "671fc275e5d854174d3733c0",
  "selectedOption": "Vatican City"
}
```
Expected Response: \
```
{
  "result": "win"
}
```
If the token is invalid or missing, you'll receive: \
```
{
  "message": "Unauthorized",
  "statusCode": 401
}
```
5. Admin-Specific Features
Admin Login: Admins can log in to perform additional tasks such as adding questions or accessing admin-only endpoints. \

Login Credentials:

```
{
  "username": "adminuser",
  "password": "adminpassword"
}
```
Endpoint:
http://localhost:3001/auth/login

Expected Response:
```
{
  "access_token": "admin_jwt_token"
}
```
Admin-Only Endpoint
Admins can access an admin-only route to test restricted access.

Endpoint:
http://localhost:3001/questions/admin-only

Authorization:

Add the admin JWT token to the Authorization header.
Expected Response:

```
{
  "message": "This is an admin-only endpoint"
}
```
If a regular user or an invalid token is used, you'll receive:
```
{
  "message": "Unauthorized",
  "statusCode": 401
}
```
## Roles Overview
We have implemented the following roles: \
- User: Can fetch questions and submit answers.
- Admin: Can fetch questions, submit answers, and add new questions. Admins can also access admin-only endpoints.
