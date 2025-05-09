# Activity Booking API Documentation

## Overview
This file contains links to all API route documentation for the activity booking system.

## Available Routes

- [Authentication API](./auth.md) - User registration and login
- [Activities API](./activities.md) - Browse and book activities
- [Bookings API](./bookings.md) - Manage user bookings
- [Health Check API](#health-check) - System health status

## Project Structure
The API is organized into three main route groups:
- **auth**: Handles user authentication (register, login)
- **activities**: Manages activities (listing, details, booking)
- **bookings**: Handles user bookings (viewing personal bookings)

## Additional API Endpoints

### Health Check

#### GET /api/health
- **Description**: Check if the API and database are running
- **Authentication**: Not required
- **Response**:
  ```json
  {
    "status": "success",
    "message": "API is running",
    "dbConnected": true
  }
  ```

## Developer Information
- **Developer**: Nikhil
- **Project**: Activity Booking System
- **Version**: 1.2.0
- **Last Updated**: June 2024 