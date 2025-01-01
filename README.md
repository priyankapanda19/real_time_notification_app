
# Real-Time Notification Application

A real-time notification application built with Node.js, Express, Socket.io, and MongoDB.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)

---

## Features

- Real-time notifications using Socket.io.
- User authentication and authorization using JWT.
- RESTful API endpoints for managing users and notifications.
- Persistent data storage with MongoDB.

---

## Prerequisites

I have the following installed:

- [Node.js](https://nodejs.org/) (v18.16.1 or above)
- [npm](https://www.npmjs.com/) (v9.5.1 or above)
- [MongoDB](https://www.mongodb.com/)

---

## Installation

1. **Clone the repository:**


   git clone https://github.com/priyankapanda19/real_time_notification_app.git
   

2. **Install dependencies:**

   
   cd real_time_notification_app
   npm install


3. **Start the server:**

   
   npm start
   

4. **Configure environment variables:**

   Update the `.env` file with your MongoDB URI, JWT secret, and other configurations.


## API Documentation

The application exposes RESTful APIs to manage users and notifications. Below are the details:

### Base URL


http://localhost:8080/api


### Authentication

All endpoints, unless specified, require a valid JWT token in the `Authorization` header:

Authorization: Bearer <jwt_token>


### User APIs

#### 1. Create User

- **Endpoint:** `/user`
- **Method:** `POST`
- **Description:** Creates a new user.
- **Request Body:**

  
  {
    "username": "JohnDoe",
    "password": "password123",
    "role": "admin"
  }


- **Response:**


  {
    "message": "User created successfully",
    "data": {
        "username": "John Doe2",
        "password": "$2a$10$dfMBkaY1y/HscA0kOxTFEu02WaKZKNKiNNLW8VuJMeUkt6FrUTj1e",
        "role": "user",
        "isOnline": false,
        "_id": "6774d3e9aa306f0160136370",
        "createdAt": "2025-01-01T05:34:33.535Z",
        "updatedAt": "2025-01-01T05:34:33.535Z",
        "__v": 0
    }
}


#### 2. User Login

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**


  {
    "username": "JohnDoe",
    "password": "password123"
  }


- **Response:**


  {
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Nzc0YzY0MDQ1Yzg1ZDFkYTczMmIxYzkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzU3MDczODAsImV4cCI6MTczNTc5Mzc4MH0.64RD6140SsFNQrFyjLtLxo6wZPo9dDW5yT0yZT9SD3g",
        "user": {
            "id": "6774c64045c85d1da732b1c9",
            "username": "John Doe",
            "role": "admin"
        }
    }
}


#### 3. Get User by ID

- **Endpoint:** `/user/:id`
- **Method:** `GET`
- **Description:** Fetches user details by ID.

- **Response:**


  {
    "message": "User fetched successfully",
    "data": {
        "_id": "6774c64045c85d1da732b1c9",
        "username": "John Doe",
        "role": "admin",
        "isOnline": false,
        "createdAt": "2025-01-01T04:36:16.689Z",
        "updatedAt": "2025-01-01T04:36:16.689Z",
        "__v": 0
    }
}
  

#### 4. Update User

- **Endpoint:** `/user/:id`
- **Method:** `PUT`
- **Description:** Updates user details.
- **Request Body:**


  {
    "username": "UpdatedJohn",
    "password": "newPassword123"
  }


- **Response:**


  {
    "message": "User updated successfully",
    "data": {
        "_id": "6774c64045c85d1da732b1c9",
        "username": "John Doe1",
        "role": "admin",
        "isOnline": false,
        "createdAt": "2025-01-01T04:36:16.689Z",
        "updatedAt": "2025-01-01T05:07:52.441Z",
        "__v": 0
    }
}


#### 5. Delete User

- **Endpoint:** `/user/:id`
- **Method:** `DELETE`
- **Description:** Deletes a user by their ID.
- **Response:**

  
  {
    "message": "User deleted successfully"
  }



### Notification APIs

#### 1. Send Notification to a User

- **Endpoint:** `/notify/user/:id`
- **Method:** `POST`
- **Description:** Sends a notification to a specific user.
- **Request Body:**


  {
    "title": "Notification Title",
    "message": "Notification message content"
  }
  

- **Response:**

  {
    "message": "User Notify",
    "status": {
        "message": "Notification for specific user",
        "sender": {
            "_id": "6774c64045c85d1da732b1c9",
            "username": "John Doe1",
            "role": "admin"
        },
        "recipient": {
            "_id": "6774d3e9aa306f0160136370",
            "username": "John Doe2",
            "role": "user"
        },
        "recipientRole": "user",
        "isRead": false,
        "_id": "6774d97acb7c6d448f5abd6d",
        "createdAt": "2025-01-01T05:58:18.844Z",
        "updatedAt": "2025-01-01T05:58:18.844Z",
        "__v": 0
    }
}


#### 2. Send Notification to a Role

- **Endpoint:** `/notify/role/:role`
- **Method:** `POST`
- **Description:** Sends a notification to all users with a specific role.
- **Request Body:**

  
  {
    "title": "Notification Title",
    "message": "Notification message content"
  }
  

- **Response:**

{
    "message": "Notify By Role",
    "data": [
        {
            "message": "Notification for all admins",
            "sender": {
                "_id": "6774c64045c85d1da732b1c9",
                "username": "John Doe1",
                "role": "admin"
            },
            "recipient": {
                "_id": "6774c64045c85d1da732b1c9",
                "username": "John Doe1",
                "role": "admin"
            },
            "recipientRole": "admin",
            "isRead": false,
            "_id": "6774d7540fdab953f6db6066",
            "__v": 0,
            "createdAt": "2025-01-01T05:49:08.759Z",
            "updatedAt": "2025-01-01T05:49:08.759Z"
        }
    ]
}

  

#### 3. Get Unread Notifications

- **Endpoint:** `/notifications?isRead=false`
- **Method:** `GET`
- **Description:** Retrieves all unread notifications for the authenticated user.
- **Response:**

  
  {
    "message": "Unread Notifications",
    "data": [
        {
            "_id": "6774d7540fdab953f6db6066",
            "message": "Notification for all admins",
            "sender": {
                "_id": "6774c64045c85d1da732b1c9",
                "username": "John Doe1"
            },
            "recipient": "6774c64045c85d1da732b1c9",
            "recipientRole": "admin",
            "isRead": false,
            "__v": 0,
            "createdAt": "2025-01-01T05:49:08.759Z",
            "updatedAt": "2025-01-01T05:49:08.759Z"
        }
    ]
}

#### 4. Mark Notifications as Read

- **Endpoint:** `/notifications/mark-read`
- **Method:** `PUT`
- **Description:** Marks unread notifications as read for the authenticated user.
- **Request Body:**


  {
    "notificationIds": ["notificationId1", "notificationId2"]
  }


- **Response:**

  
  {
    "message": "Notifications marked as read successfully",
    "data": null
}


### Middleware

- **authenticateToken:** Ensures the user is authenticated.
- **authorizeRole:** Checks if the user has the required role(s) for access.
- **Validation Schemas:** Validates the structure of request bodies (e.g., `UserSchemaValidation`, `NotificationSchemaValidation`).


## Notes

- Error handling: Each endpoint provides appropriate error messages and HTTP status codes for validation errors, authentication failures, or missing resources.
- For testing, you can use the provided Postman collection.




