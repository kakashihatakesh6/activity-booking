# Bookings API

## Endpoints

### GET /api/bookings/me
- **Description**: Get all bookings for the logged-in user
- **Authentication**: Required
- **Controller**: `getMyBookings`
- **Middleware**: `protect`
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

### Error Responses

The endpoint may return the following error responses:

- **400 Bad Request**:
  ```json
  {
    "success": false,
    "error": "Error message"
  }
  ```

- **503 Service Unavailable**:
  ```json
  {
    "success": false,
    "error": "Database connection unavailable"
  }
  ``` 