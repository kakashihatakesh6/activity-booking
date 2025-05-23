# Bookings API

## Endpoints

### GET /api/bookings/me
- **Description**: Get all bookings for the logged-in user
- **Authentication**: Bearer Token
- **Headers**: Bearer Token
  Authorization:  Bearer YOUR_TOKEN_HERE
- **Controller**: `getMyBookings`
- **Middleware**: `protect`, `checkDbConnection`
- **Request**: No request body required
- **Response**:
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": "booking_id",
        "user": "user_id",
        "activity": {
          "_id": "activity_id",
          "title": "Hiking Adventure",
          "description": "Enjoy a scenic hike through beautiful trails and breathtaking views.",
          "location": "Mountain Trail Park",
          "date": "2023-12-15T00:00:00.000Z",
          "time": "09:00 AM"
        },
        "bookingDate": "2023-11-30T12:00:00.000Z",
        "createdAt": "2023-11-30T12:00:00.000Z",
        "updatedAt": "2023-11-30T12:00:00.000Z"
      }
    ]
  }
  ```

### POST /api/bookings
- **Description**: Create a new booking directly
- **Authentication**: Bearer Token
- **Headers**: Bearer Token
  Authorization:  Bearer YOUR_TOKEN_HERE
- **Controller**: `createBooking`
- **Middleware**: `protect`, `checkDbConnection`
- **Request**:
  ```json
  {
    "activity": "activity_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "booking_id",
      "user": "user_id",
      "activity": {
        "_id": "activity_id",
        "title": "Hiking Adventure",
        "description": "Enjoy a scenic hike through beautiful trails and breathtaking views.",
        "location": "Mountain Trail Park",
        "date": "2023-12-15T00:00:00.000Z",
        "time": "09:00 AM"
      },
      "bookingDate": "2023-11-30T12:00:00.000Z",
      "createdAt": "2023-11-30T12:00:00.000Z",
      "updatedAt": "2023-11-30T12:00:00.000Z"
    }
  }
  ```

## Error Responses

All endpoints may return the following error responses:

- **400 Bad Request**:
  ```json
  {
    "success": false,
    "error": "Please provide activity ID"
  }
  ```

  ```json
  {
    "success": false,
    "error": "Invalid activity ID format"
  }
  ```

  ```json
  {
    "success": false,
    "error": "You have already booked this activity"
  }
  ```

- **401 Unauthorized**:
  ```json
  {
    "success": false,
    "error": "User authentication failed"
  }
  ```

- **500 Internal Server Error**:
  ```json
  {
    "success": false,
    "error": "Failed to retrieve bookings from database"
  }
  ```

  ```json
  {
    "success": false,
    "error": "Failed to save booking to database"
  }
  ```

- **503 Service Unavailable**:
  ```json
  {
    "success": false,
    "error": "Database connection unavailable (Status: Disconnected). Please try again later."
  }
  ```

  ```json
  {
    "success": false,
    "error": "Database operation failed. Please try again later."
  }
  ``` 