# Personal Data Inventory
# Personal Data Inventory System

## 📌 Overview
Personal Data Inventory is a Spring Boot backend application that allows users to manage personal data items securely.  
It includes authentication, caching, email notifications, logging, and monitoring features.

---

## 🚀 Features

- 🔐 JWT Authentication & Authorization
- 📦 CRUD Operations (Create, Read, Update, Delete)
- ⚡ Redis Caching with TTL (10 minutes)
- 📧 Email Notifications on Data Creation (JavaMailSender + Thymeleaf)
- ❗ Global Exception Handling (400, 404, 403)
- 📊 Logging using AOP (Request/Response tracking)
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