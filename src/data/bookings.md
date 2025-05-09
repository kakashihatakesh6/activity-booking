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
    "data": [
      {
        "id": "booking_id",
        "activityId": "activity_id",
        "userId": "user_id",
        "date": "booking_date",
        "status": "confirmed"
      }
    ]
  }
  ``` 