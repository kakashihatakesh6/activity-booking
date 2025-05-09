# Authentication API

This document outlines the authentication endpoints for the Quantum App API.

## Sign Up

Create a new user account.

- **URL**: `/auth/signup`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "organization_name": "string",
    "user_type": "string",
    "role": "string",
    "designation": "string"
  }
  ```

### Response

- **Success Response**: `201 Created`

  ```json
  {
    "message": "User registered successfully",
    "user_id": "string",
    "email": "string",
    "organization_id": "string",
    "role": "string"
  }
  ```

- **Error Responses**:
  - `400 Bad Request`: Invalid input data
  - `409 Conflict`: User already exists
  - `500 Internal Server Error`: Failed to create organization or register user

## Login

Authenticate a user and receive a JWT token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Response

- **Success Response**: `200 OK`

  ```json
  {
    "message": "Login successful",
    "token": "string",
    "user_id": "string",
    "email": "string",
    "organization_id": "string",
    "role": "string"
  }
  ```

- **Error Responses**:
  - `400 Bad Request`: Invalid input data
  - `401 Unauthorized`: Invalid credentials

## Notes

- The `organization_name` field in the sign-up request is optional. If not provided, a default organization name will be created using the user's full name.
- The `user_type`, `role`, and `designation` fields in the sign-up request are optional. Default values will be assigned if not provided.
- Passwords are hashed before being stored in the database.
- A unique secret access token is generated for each user during sign-up.
- JWT tokens are used for authentication after successful login.
