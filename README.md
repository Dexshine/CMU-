# Event Matching Service

This is an Express.js application for event matching.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- CMU OAuth credentials
- MongoDB Account
- Google Cloud account
- Google firebase account

### MongoDB Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection credentials:

- Username
- Password
- Cluster address

### CMU OAuth Setup

1. Take a look of how to implement it from example code.

- https://github.com/CPE-CMU-Internal-Projects/cmu-oauth-example-nextjs

2. Retrieve credential from CPE CMU Department

### Google OAuth

1. Go to Google Cloud Console
2. Create new OAuth 2.0 credentials
3. Configure authorized redirect URIs
4. Copy the client ID and client secret

### Firebase Setup

1. Create a new Firebase project
2. Generate a new service account key:

- Go to Project Settings > Service Accounts
- Generate New Private Key
- Copy the entire JSON content into SERVICE_ACCOUNT_KEY

3. Copy your storage bucket name from Firebase Storage settings

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Dexshine/CMU-EventFinding-API.git
   ```
2. Navigate to the project directory:
3. copy .env.example and rename it to .env
4. fill in credential in .env file
5. Install the dependencies:
   ```sh
   npm install
   ```

### Running the Application

#### In Development Mode

To start the application in development mode with `nodemon`, run:

```sh
npm run dev
```

#### In Production Mode

To start the application in production mode, run:

```sh
npm start
```

The application will be available at `http://localhost:8000`.

## Scripts

- `start`: Starts the application using Node.js.
- `dev`: Starts the application using `nodemon` for automatic restarts during development.

## License

This project is licensed under the MIT License.

