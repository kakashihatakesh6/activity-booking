# 🎯 Activity Booking API

A modern RESTful API for an activity booking application built with Node.js, Express, TypeScript, and MongoDB.

<div align="center">
  
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

## ✨ Features

- 🔐 User authentication (register, login)
- 📋 Activity listing and details
- 📅 Activity booking
- 👤 User bookings management
- 🛡️ Graceful database connection failure handling
- 🔍 API health check endpoint

## 🛠️ Technologies Used

- ⚡ Node.js
- 🚂 Express.js
- 📘 TypeScript
- 🍃 MongoDB with Mongoose
- 🔑 JWT Authentication
- 🔒 bcrypt for password hashing
- ✅ express-validator for input validation

## 🚀 Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd activity-booking
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/activity-booking
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   ```
   
   > 💡 **Note:** You can replace the MongoDB URI with a MongoDB Atlas connection string for a cloud-hosted database.

4. Build the TypeScript code:
   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm start
   ```

For development mode with auto-reload:
```bash
npm run dev
```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

1. Make sure Docker and Docker Compose are installed on your system
2. Run the application and MongoDB with a single command:
   ```bash
   docker-compose up -d
   ```
3. The API will be available at `http://localhost:5000/api`
4. To stop the containers:
   ```bash
   docker-compose down
   ```

### Building and Running the Docker Image Manually

1. Build the Docker image:
   ```bash
   docker build -t activity-booking-app .
   ```
2. Run the container:
   ```bash
   docker run -p 5000:5000 -e MONGODB_URI=mongodb://host.docker.internal:27017/activity-booking activity-booking-app
   ```

> ⚠️ **Note:** When running the container manually, you need to ensure MongoDB is accessible to the container.

## 🌱 Seeding the Database

To seed the database with sample activities:
```bash
npm run seed:import
```

To clear the database:
```bash
npm run seed:delete
```

## 📡 API Endpoints

### Health Check

- `GET /api/health` - Check API and database status
  - Returns: `{ "status": "success", "message": "API is running", "dbConnected": true|false }`

### 🔐 Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ name, email, phone, password }`
  - Returns: JWT token

- `POST /api/auth/login` - Login a user
  - Body: `{ email, password }`
  - Returns: JWT token

### 🎯 Activities

- `GET /api/activities` - Get all activities
  - Public access
  - Returns: Array of activities

- `GET /api/activities/:id` - Get a single activity
  - Public access
  - Returns: Activity details

- `POST /api/activities/:id/book` - Book an activity
  - Protected route (requires authentication)
  - Returns: Booking details

### 📅 Bookings

- `GET /api/bookings/me` - Get all bookings for the logged-in user
  - Protected route (requires authentication)
  - Returns: Array of user's bookings with activity details

## ⚠️ Error Handling

The API includes comprehensive error handling:

- 🔌 Database connection failures are handled gracefully
- ✓ Validation errors are returned with appropriate messages
- 🔒 Authentication errors return meaningful responses
- 🔍 Not found resources are properly identified

## 🔑 Authentication

The API uses JWT for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN
```

## 📋 API Request Examples

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "phone": "1234567890", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### Get All Activities
```bash
curl -X GET http://localhost:5000/api/activities
```

### Book an Activity
```bash
curl -X POST http://localhost:5000/api/activities/activity_id/book \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<div align="center">
  <p>Made with ❤️ for activity booking management</p>
</div> 