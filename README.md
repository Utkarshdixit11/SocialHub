# SocialHub - Modern Social Media Dashboard

A complete social networking platform built with **React**, **Node.js**, **Express**, and **MongoDB**. It features user authentication, post creation, and mobile-responsive design.

## Features

- **Authentication** (Register/Login with JWT)
- **Post Management** (Create, View, Like, Comment)
- **User Profiles** with Avatar
- **Mobile-First Design** with Responsive Sidebar
- **Search & Filter** Posts
- **Real-time UI Updates**

## Tech Stack

- **Frontend**: React, Vite, Axios, React Router DOM,
- **Backend**: Node.js, Express, Mongoose, MongoDB
- **Security**: JWT, bcrypt, CORS, Validator
- **Tools**: Nodemon, dotenv

## Quick Start

```bash
# Clone project
git clone <repo-url> && cd socialhub

# Start Backend
cd backend
npm install
npm run server

# Start Frontend (in another terminal)
cd frontend
npm install
npm run dev

## Project Structure
socialhub/
├── backend/
│   ├── models/, controllers/, routes/
│   └── server.js, .env
├── frontend/
│   ├── src/Components/, context/, services/
│   └── App.jsx, main.jsx
└── README.md

