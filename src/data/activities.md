# Activities API

## Endpoints

### GET /api/activities
- **Description**: Get all activities
- **Authentication**: Not required
- **Controller**: `getActivities`
- **Request**: No request body required
- **Response**:
  ```json
  {
    "success": true,
    "count": 5,
    "data": [
      {
        "_id": "activity_id",
        "title": "Hiking Adventure",
        "description": "Enjoy a scenic hike through beautiful trails and breathtaking views.",
        "location": "Mountain Trail Park",
        "date": "2023-12-15T00:00:00.000Z",
        "time": "09:00 AM",
        "createdAt": "2023-11-30T12:00:00.000Z",
        "updatedAt": "2023-11-30T12:00:00.000Z"
      }
    ]
  }
  ```

### GET /api/activities/:id
- **Description**: Get a single activity by ID
- **Authentication**: Not required
- **Controller**: `getActivity`
- **Request**: No request body required
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "activity_id",
      "title": "Hiking Adventure",
      "description": "Enjoy a scenic hike through beautiful trails and breathtaking views.",
      "location": "Mountain Trail Park",
      "date": "2023-12-15T00:00:00.000Z",
      "time": "09:00 AM",
      "createdAt": "2023-11-30T12:00:00.000Z",
      "updatedAt": "2023-11-30T12:00:00.000Z"
    }
  }
  ```

### POST /api/activities/:id/book
- **Description**: Book an activity
- **Authentication**: Required
- **Controller**: `bookActivity`
- **Middleware**: `protect`
- **Request**: No request body required (user ID comes from auth token)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "booking_id",
      "user": "user_id",
      "activity": "activity_id",
      "bookingDate": "2023-11-30T12:00:00.000Z",
      "createdAt": "2023-11-30T12:00:00.000Z",
      "updatedAt": "2023-11-30T12:00:00.000Z"
    }
  }
  ```

### Error Responses

All endpoints may return the following error responses:

- **404 Not Found**:
  ```json
  {
    "success": false,
    "error": "Activity not found"
  }
  ```

- **400 Bad Request**:
  ```json
  {
    "success": false,
    "error": "You have already booked this activity"
  }
  ```

- **503 Service Unavailable**:
  ```json
  {
    "success": false,
    "error": "Database connection unavailable"
  }
  ``` 