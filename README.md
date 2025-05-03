Smart Notes Application
A web application for creating, editing, and managing notes with AI-powered features for automatic summarization and tagging.
Live Demo

Frontend URL: https://smartnotefrontend.onrender.com
Backend URL: https://smartnotebackend.onrender.com

Features

User authentication (login/signup)
Create, edit, and delete notes
Rich text editing
Automatic summarization of notes using OpenAI's GPT
Automatic tag suggestions based on note content
Search functionality by content or tags
Responsive dashboard with pagination
First-time user onboarding flow

Tech Stack
Frontend

React.js
Redux for state management
React Router for navigation
TailwindCSS for styling
React-Quill for rich text editing

Backend

Node.js
Express.js
MongoDB with Mongoose
JWT for authentication
OpenAI API for AI features

Prerequisites
Before running this application, make sure you have the following installed:

Node.js (v14.x or later)
npm
MongoDB (local installation or MongoDB Atlas account)
An OpenAI API key

Getting Started
1. Clone the repository
bashgit clone https://github.com/yourusername/smart-notes-app.git
cd smart-notes-app
2. Set up environment variables
Create a .env file in the server directory:
bashcd server
touch .env
Add the following variables to the .env file:
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-notes
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
Replace your_jwt_secret_key with a random string for JWT encryption and your_openai_api_key with your actual OpenAI API key.
3. Install dependencies
Install dependencies for both frontend and backend:
bash# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
4. Start MongoDB
Make sure your MongoDB service is running. If using a local installation:
bash# On Linux/macOS
sudo service mongod start

# On Windows (via Command Prompt as Administrator)
net start MongoDB
5. Run the application
Backend:
bashcd server
node src/app.js
Frontend:
bashcd client
npm run dev
Access the application at: http://localhost:3000
