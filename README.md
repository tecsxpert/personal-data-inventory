# Personal Data Inventory System

## 📌 Overview
Personal Data Inventory is a Spring Boot backend application that allows users to securely manage personal data items.  
The system includes authentication, caching, email notifications, logging, and monitoring features, making it production-ready.

---

## 🚀 Features

- 🔐 JWT Authentication & Authorization
- 📦 CRUD Operations (Create, Read, Update, Delete)
- ⚡ Redis Caching with TTL (10 minutes)
- 📧 Email Notifications on Data Creation (JavaMailSender + Thymeleaf)
- ❗ Global Exception Handling (400, 404, 403)
- 📊 AOP Logging (Request/Response + Execution Time)
- 📁 File Logging (`logs/app.log`)
- 🩺 Spring Boot Actuator for Monitoring
- 🔍 Pagination & Search functionality

---

## 🛠️ Tech Stack

- Java 17
- Spring Boot 3
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Redis
- Thymeleaf
- Maven

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YASHAS-HJ4/personal-data-inventory.git
cd personal-data-inventory