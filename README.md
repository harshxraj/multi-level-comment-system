# Multi-Level Comment System

A social media platform API for handling posts and multi-level comments. This system allows users to create comments, reply to existing comments, and retrieve comments with pagination. The project is secured with JWT-based user authentication and includes rate limiting to ensure efficient usage.

## Features

- User registration and authentication with JWT
- Create, reply to, and retrieve multi-level comments
- Pagination for retrieving comments
- Rate limiting to prevent abuse
- Dockerized setup for easy deployment
- Integration tests to validate functionality

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User Authentication](#user-authentication)
  - [Create Comment](#create-comment)
  - [Reply to Existing Comment](#reply-to-existing-comment)
  - [Get Comments for a Post](#get-comments-for-a-post)
  - [Expand Parent-Level Comments with Pagination](#expand-parent-level-comments-with-pagination)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Tests](#tests)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/multi-level-comment-system.git
    cd multi-level-comment-system
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory with the following variables:

    ```env
    PORT=3000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

4. Run the development server:

    ```bash
    npm start
    ```

5. To run in a Docker container:

    ```bash
    docker-compose up --build
    ```

## Usage

After starting the server, you can interact with the API using tools like Postman or cURL. All endpoints are prefixed with `/api`.

## API Endpoints

### User Authentication

#### Register a New User

- **Endpoint**: `/api/auth/register`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "password123"
  }

- **Sample Response**:

  ```json
  {
    "message": "User registered successfully"
  }
  ```

#### Login

- **Endpoint**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```

- **Sample Response**:

  ```json
  {
    "token": "your_jwt_token"
  }
  ```

### Create Comment

- **Endpoint**: `/api/posts/{postId}/comments`
- **Method**: `POST`
- **Headers**: 

  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```

- **Request Body**:

  ```json
  {
    "text": "This is a comment"
  }
  ```

- **Sample Response**:

  ```json
  {
    "id": "64fa8f3b12345abc67890123",
    "text": "This is a comment",
    "createdAt": "2024-08-21T14:35:22.947Z",
    "postId": "64fa8f3b12345abc67890123",
    "userId": "64fa8f3b12345abc67890123",
    "parentCommentId": null
  }
  ```

### Reply to Existing Comment

- **Endpoint**: `/api/posts/{postId}/comments/{commentId}/reply`
- **Method**: `POST`
- **Headers**: 

  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```

- **Request Body**:

  ```json
  {
    "text": "This is a reply to a comment"
  }
  ```

- **Sample Response**:

  ```json
  {
    "id": "64fa8f4c98765def12345678",
    "text": "This is a reply to a comment",
    "createdAt": "2024-08-21T14:36:44.123Z",
    "postId": "64fa8f3b12345abc67890123",
    "userId": "64fa8f3b12345abc67890123",
    "parentCommentId": "64fa8f3b12345abc67890123"
  }
  ```

### Get Comments for a Post

- **Endpoint**: `/api/posts/{postId}/comments`
- **Method**: `GET`
- **Query Parameters** (Optional):

  - `sortBy`: Field to sort comments by (e.g., `createdAt`, `repliesCount`)
  - `sortOrder`: Sorting order (`asc` for ascending, `desc` for descending)

- **Sample Response**:

  ```json
  [
    {
      "id": "64fa8f3b12345abc67890123",
      "text": "This is a comment",
      "createdAt": "2024-08-21T14:35:22.947Z",
      "postId": "64fa8f3b12345abc67890123",
      "parentCommentId": null,
      "replies": [
        {
          "id": "64fa8f4c98765def12345678",
          "text": "This is a reply to a comment",
          "createdAt": "2024-08-21T14:36:44.123Z"
        }
      ],
      "totalReplies": 1
    }
  ]
  ```

### Expand Parent-Level Comments with Pagination

- **Endpoint**: `/api/posts/{postId}/comments/{commentId}/expand`
- **Method**: `GET`
- **Query Parameters**:

  - `page`: Page number (e.g., `1`, `2`)
  - `pageSize`: Number of comments per page (e.g., `10`)

- **Sample Response**:

  ```json
  [
    {
      "id": "64fa8f3b12345abc67890123",
      "text": "This is a nested comment",
      "createdAt": "2024-08-21T14:35:22.947Z",
      "postId": "64fa8f3b12345abc67890123",
      "parentCommentId": "64fa8f3b12345abc67890123",
      "replies": [],
      "totalReplies": 0
    }
  ]
  ```

## Database Schema

### Post Schema

```javascript
const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  commentsCount: { type: Number, default: 0 },
});
```

### Comment Schema

```javascript
const commentSchema = new Schema({
  text: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  createdAt: { type: Date, default: Date.now },
});
```

## Deployment

To deploy the Dockerized application:

1. Build and run the Docker container:

    ```bash
    docker-compose up --build -d
    ```

2. The application will be available at `http://localhost:3000`.

3. To deploy on a hosting service like Heroku, follow their specific deployment guidelines for Docker.

## Tests

Run the integration tests to validate the API functionality:

```bash
npm test
```

## Contributing

Contributions are welcome! Please fork this repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License.
```

This README provides a comprehensive overview of the project, including installation instructions, details on the API endpoints, and sample responses. Make sure to replace placeholders like `your-username`, `your_mongodb_uri`, and `your_jwt_secret` with actual values.
