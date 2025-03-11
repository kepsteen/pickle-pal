# 🥒 Pickle-Pal

## Find Your Perfect Pickleball Partner

Pickle-Pal is a modern web application designed to connect pickleball enthusiasts, helping them find compatible playing partners based on skill level, play style, and preferences built with React, Node.js, and MongoDB.

![Pickle-Pal Logo](/Frontend/public/pickle-pal-icon.svg)

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Getting Started](#️-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Installation and Running](#installation-and-running)
- [Development](#-development)
  - [Backend Development](#backend-development)
  - [Frontend Development](#frontend-development)

## 🎯 Problem Statement

Pickleball is one of the fastest-growing sports in the world, but finding compatible partners at your skill level can be challenging. Pickle-Pal solves this problem by:

- Connecting players with similar skill levels and play styles
- Facilitating match scheduling and coordination
- Building a community of pickleball enthusiasts

## 🚀 Features

- **User Authentication**: Secure login and registration using Clerk
- **Profile Creation**: Set up your pickleball profile with skill level, play style, and preferences
- **Partner Matching**: Swipe-based interface to find compatible pickleball partners
- **Real-time Chat**: Communicate with your matches to coordinate games
- **Collaborative PairSwipe**: Grab a partner and swipe on other pairs to find a compatible match

## 💻 Tech Stack

### Frontend

- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and development server
- **React Router v7**: For application routing
- **TailwindCSS**: Utility-first CSS framework
- **DaisyUI**: Component library for Tailwind
- **Socket.io-client**: Real-time communication
- **React Query**: Data fetching and state management
- **Clerk**: Authentication and user management

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL database for storing user data and matches
- **Mongoose**: MongoDB object modeling
- **Socket.io**: Real-time bidirectional communication
- **Redis**: In-memory data structure store for caching
- **AWS S3**: Cloud storage for user profile images
- **Clerk**: Authentication middleware

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn or pnpm
- MongoDB instance
- Redis instance
- AWS S3 bucket (for profile images)
- Clerk account for authentication

### Environment Setup

#### Backend

Create a `.env` file in the Backend directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
FRONTEND_BUILD_DIR=path_to_frontend_build_directory
```

#### Frontend

Create a `.env` file in the Frontend directory with the following variables:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Installation and Running

#### Backend

```bash
cd Backend
npm install
npm run dev  # For development
# OR
npm run build
npm start    # For production
```

#### Frontend

```bash
cd Frontend
npm install
npm run dev  # For development
# OR
npm run build  # For production build
```

## 🧪 Development

### Backend Development

- The backend server runs on port 3000 by default
- API routes are defined in the `/api/routes` directory
- WebSocket functionality is in the `/websocket` directory
- Database models are in the `/api/models` directory

### Frontend Development

- The frontend development server runs on port 5173 by default
- Components are in the `/src/components` directory
- Pages are in the `/src/pages` directory
- API calls are in the `/src/lib/api.ts`
- Socket.io setup is in `/src/socket.ts`
