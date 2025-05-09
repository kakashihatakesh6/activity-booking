# Authentication API

## Endpoints

### POST /api/auth/register
- **Description**: Register a new user
- **Authentication**: Not required
- **Controller**: `register`
- **Middleware**: `validationErrorHandler`
- **Validation**:
  - `name`: Required
  - `email`: Valid email required
  - `phone`: Required
  - `password`: Minimum 6 characters
- **Request**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN"
  }
  ```

### POST /api/auth/login
- **Description**: Login a user
- **Authentication**: Not required
- **Controller**: `login`
- **Middleware**: `validationErrorHandler`
- **Validation**:
  - `email`: Valid email required
  - `password`: Required
- **Request**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN"
  }
  ```

### Error Responses

The endpoints may return the following error responses:

- **400 Bad Request**:
  ```json
  {
    "success": false,
    "error": "Please provide email and password"
  }
  ```

- **401 Unauthorized**:
  ```json
  {
    "success": false,
    "error": "Invalid credentials"
  }
  ```

- **503 Service Unavailable**:
  ```json
  {
    "success": false,
    "error": "Database connection unavailable"
  }
  ``` 