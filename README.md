# LivePoll API

This stands as the **backend API MVP** for managing live polls in real-time. This service powers the core logic for creating polls, collecting votes, and returning live results.

---

## 📌 General Idea

This API is being developed to eventually run a custom polling system for my Discord server, intended for use among my friends and me.

The project also serves as a way for me to apply my current programming skills, explore new technologies, and bring them together in a fun and interactive idea.

It will serve as the backend for a frontend application built with Angular, handling all core data and interaction logic.

---

## 🧭 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Contact](#contact)

---

## 📖 Overview

LivePoll API is designed to handle high-performance, real-time polling. It allows clients to create polls, vote, and receive instant updates. It's ideal for integrating into live events, apps, or platforms that need real-time audience interaction.

---

## ✨ Features

- Create single or multi-choice polls
- Vote submission and updating
- Real-time result broadcasting using Socket.IO
- RESTful API design with Express.js
- JWT authentication for secure access
- PostgreSQL with Prisma ORM
- Redis integration for fast data access and caching
- Docker for containerized database and environment setup
- Unit and integration tests using Jest

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

## 📬 Contact
Created by Razvan Birt
GitHub @RazvanBirt