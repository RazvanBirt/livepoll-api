# LivePoll API

This API is currently in its MVP phase, with many improvements planned. It powers a simple polling service that lets users create polls, gather votes, and retrieve live results.

---

## 📌 General Idea

This API is being developed to eventually run a custom polling system for my Discord server, intended for use among my friends and me.

It will serve as the backbone for a frontend application built with Angular, handling all core data and interaction logic.

The project also serves as a way for me to apply my current programming skills, explore new technologies, and bring them together in a fun and interactive idea.

---

## 🧭 Table of Contents

- [Objectives](#objectives)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contact](#contact)

---

## 🎯 Objectives

- Create single choice and multi-choice polls ☑️
- Vote submission and updating ☑️
- Real-time result broadcasting using Socket.IO ☑️
- RESTful API design with Express.js ☑️
- JWT authentication for secure access ☑️
- PostgreSQL with Prisma ORM ☑️
- Redis integration for fast data access and caching ⬜
- Docker for containerized database and environment setup ☑️
- Unit and integration tests using Jest ☑️
- Apply DevOps methodologies to automate processes and ensure secure, reliable delivery ⬜
- Deploy and host on a Linux-based home server, managing and maintaining the infrastructure ⬜

---

## 🛠️ Tech Stack

- **Language:** Node.js with TypeScript
- **Framework:** Express.js
- **Real-Time Communication:** Socket.IO
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Cache/Performance Layer:** Redis
- **Containerization:** Docker
- **Testing:** Jest
- **Code Quality:** ESLint

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/RazvanBirt/livepoll-api.git
cd livepoll-api

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create your .env file with database and JWT secrets
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev

```

---

## 📦 Usage

```bash
# Start in development mode
npm run dev

```

---


## 📖 API Endpoints

| Method     | Endpoint                   | Description                                 | Auth Required |
|------------|----------------------------|---------------------------------------------|---------------|
| **POST**   | `/api/auth/register`       | Register a new user and receive a JWT token | No            |
| **POST**   | `/api/auth/login`          | Authenticate and receive a JWT token        | No            |
| **GET**    | `/api/polls`               | Retrieve all polls                          | Yes           |
| **POST**   | `/api/polls`               | Create a new poll                           | Yes           |
| **GET**    | `/api/polls/:id`           | Retrieve details of a specific poll         | Yes           |
| **POST**   | `/api/votes`               | Submit a vote for a poll option             | Yes           |
|-------------------------------------------------------------------------------------------------------|


## 📬 Contact
Created by Razvan Birt
GitHub @RazvanBirt