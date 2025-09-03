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

- [NestJS](https://nestjs.com/) – Framework  
- [TypeScript](https://www.typescriptlang.org/) – Language  
- [Redis](https://redis.io/) – Cache / Pub-Sub  
- [Mongoose](https://mongoosejs.com/) – MongoDB ODM  

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
