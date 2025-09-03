# 🚀 NestJS Redis Project

A **modular NestJS backend application** with Redis integration for caching and high-performance data handling.  
This project demonstrates **clean architecture**, feature modules (Users, Jokes), and shared utilities.

---

## 📂 Project Structure

src/
├─ app.module.ts # Root module
├─ main.ts # Application bootstrap
├─ common/redis/ # Redis module & service
├─ jokes/ # Jokes feature module
├─ user/ # User feature module (DTOs & schema)
└─ utils/
└─ response.util.ts # Standardized response helper


---

## ⚡ Features

- **NestJS Modular Architecture**  
- **Redis Integration** (caching / pub-sub ready)  
- **User Management** (DTOs, Mongoose schema)  
- **Jokes API** (example feature)  
- **Centralized Response Utility** for consistent API responses  

---

## 🛠️ Tech Stack

[![NestJS](https://img.shields.io/badge/NestJS-Backend-red?logo=nestjs)](https://nestjs.com/)
[![Redis](https://img.shields.io/badge/Redis-Enabled-green?logo=redis)](https://redis.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-blue?logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)

---
Built with ❤️ using NestJS, Redis & TypeScript
## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Install dependencies
npm install

# Run the application
npm run start:dev
