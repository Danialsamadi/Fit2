# FIT2 Workout Planner

FIT2 is a comprehensive workout planning application that connects coaches with clients. Coaches can create personalized workout plans for their clients, and clients can track their progress and provide feedback.

## Features

- **User Authentication**: Secure login and registration for both coaches and clients
- **Personalized Workout Plans**: Coaches can create custom workout plans for each client
- **Progress Tracking**: Visual progress indicators for clients and coaches
- **Feedback System**: Clients can mark workouts as completed and provide feedback
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React, Material-UI, Formik, Yup
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)

## Deployment Guide

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL database

### Local Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fit2.git
   cd fit2
   ```

2. Install dependencies:
   ```
   npm run install-all
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory based on `.env.example`
   - Configure your database connection and JWT secret

4. Start the development servers:
   ```
   npm run dev
   ```

### Production Deployment

#### Option 1: Cloud Platform Deployment

1. Choose a cloud platform (AWS, Google Cloud, Azure, DigitalOcean, Render, etc.)
2. Set up a server instance or container service
3. Configure your database:
   ```
   # Example for setting up PostgreSQL on your chosen platform
   # Follow the specific instructions for your cloud provider
   ```

4. Set environment variables according to your platform's configuration method:
   ```
   NODE_ENV=production
   JWT_SECRET=your_jwt_secret
   # Add other necessary environment variables
   ```

5. Deploy your application using the platform's deployment tools or CI/CD pipeline

#### Option 2: Manual Deployment

1. Build the frontend:
   ```
   npm run build
   ```

2. Set up your production environment variables in the backend `.env` file:
   ```
   NODE_ENV=production
   PORT=5001
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   ```

3. Start the production server:
   ```
   npm start
   ```

## Database Setup

For a fresh installation, the database tables will be created automatically when you first run the application in development mode. In production, you should manually create the database and run migrations.

### Manual Database Setup

1. Create a PostgreSQL database:
   ```
   createdb fit2_db
   ```

2. Connect to the database and run the SQL schema (if needed):
   ```
   psql -d fit2_db -f schema.sql
   ```

## License


## Author

Daniel Samadi