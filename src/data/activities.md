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
    "count": 10,
    "data": [
      {
        "id": "activity_id",
        "name": "Activity Name",
        "description": "Activity description",
        "price": 99.99,
        "duration": 120,
        "date": "2025-05-01T10:00:00Z",
        "location": "Activity Location"
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
      "id": "activity_id",
      "name": "Activity Name",
      "description": "Activity description",
      "price": 99.99,
      "duration": 120,
      "date": "2025-05-01T10:00:00Z",
      "location": "Activity Location"
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
      "id": "booking_id",
      "activityId": "activity_id",
      "userId": "user_id",
      "date": "booking_date",
      "status": "confirmed"
    }
  }
  ``` 