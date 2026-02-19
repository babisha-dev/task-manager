# Task Manager — React + Node.js + MySQL

A full-stack task management app with JWT authentication and CRUD operations,
using **MySQL** (via Sequelize ORM) instead of MongoDB.

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, TailwindCSS         |
| Backend   | Node.js, Express                    |
| Database  | **MySQL** + Sequelize ORM           |
| Auth      | JWT + bcryptjs                      |
| Security  | Helmet, CORS, express-rate-limit    |

---

## ⚡ Quick Start

### Step 1 — Install MySQL

**Option A — Local MySQL**

- **Windows**: Download from https://dev.mysql.com/downloads/installer/
- **Mac**: `brew install mysql` then `brew services start mysql`
- **Ubuntu**: `sudo apt install mysql-server && sudo systemctl start mysql`

**Option B — Free Cloud (easier)**

Use [PlanetScale](https://planetscale.com) or [Railway MySQL](https://railway.app) — both have free tiers.
Just grab the connection string and put it in `.env`.

---

### Step 2 — Create the database

Open MySQL shell:

```bash
# Windows / Mac
mysql -u root -p

# Ubuntu
sudo mysql
```

Then run:

```sql
CREATE DATABASE taskmanager;
-- Confirm it was created:
SHOW DATABASES;
EXIT;
```

> ✅ That's it! Sequelize will auto-create the `users` and `tasks` tables on first run.

---

### Step 3 — Configure backend

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# ← Change these to match your MySQL setup
DB_HOST=localhost
DB_PORT=3306
DB_NAME=taskmanager
DB_USER=root
DB_PASSWORD=your_mysql_password   # leave empty if no password set

JWT_SECRET=change_this_to_a_long_random_string_32_chars_minimum
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

---

### Step 4 — Run the backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ MySQL connected
✅ MySQL tables synced
🚀 Task Manager Server (MySQL) running on port 5000
```

---

### Step 5 — Run the frontend

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
task-manager-mysql/
│
├── backend/
│   ├── config/
│   │   └── database.js          ← Sequelize connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js              ← JWT verify
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── index.js             ← associations + sync
│   │   ├── User.js              ← MySQL users table
│   │   └── Task.js              ← MySQL tasks table
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── PrivateRoute.jsx
        │   ├── TaskCard.jsx
        │   ├── TaskForm.jsx
        │   └── TaskStats.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Login.jsx
        │   ├── NotFound.jsx
        │   ├── Profile.jsx
        │   └── Register.jsx
        ├── services/
        │   └── api.js
        ├── App.jsx
        └── main.jsx
```

---

## 🗄 MySQL Schema

Sequelize auto-creates these tables:

### `users`
| Column    | Type         | Notes                  |
|-----------|--------------|------------------------|
| id        | INT PK AI    | Auto-increment         |
| name      | VARCHAR(50)  | Required               |
| email     | VARCHAR(100) | Unique                 |
| password  | VARCHAR(255) | bcrypt hashed          |
| avatar    | VARCHAR(500) | URL                    |
| role      | ENUM         | user / admin           |
| isActive  | BOOLEAN      | default true           |
| createdAt | DATETIME     | auto                   |
| updatedAt | DATETIME     | auto                   |

### `tasks`
| Column      | Type         | Notes                    |
|-------------|--------------|--------------------------|
| id          | INT PK AI    | Auto-increment           |
| title       | VARCHAR(100) | Required                 |
| description | TEXT         | Optional                 |
| status      | ENUM         | pending/in-progress/completed |
| priority    | ENUM         | low/medium/high          |
| dueDate     | DATE         | Optional                 |
| isCompleted | BOOLEAN      | auto-set                 |
| completedAt | DATETIME     | auto-set                 |
| userId      | INT FK       | → users.id (CASCADE)     |
| createdAt   | DATETIME     | auto                     |
| updatedAt   | DATETIME     | auto                     |

---

## 🔌 API Endpoints

All task and user endpoints require `Authorization: Bearer <token>`.

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout

GET    /api/tasks           ?search=&status=&priority=&page=&limit=
GET    /api/tasks/stats
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/change-password
DELETE /api/users/account
```

---

## 🔍 Verifying the DB

After the server starts you can inspect the tables:

```sql
USE taskmanager;
SHOW TABLES;
DESCRIBE users;
DESCRIBE tasks;
SELECT * FROM users;
SELECT * FROM tasks;
```

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| `ER_ACCESS_DENIED_ERROR` | Wrong DB_USER / DB_PASSWORD in .env |
| `ER_BAD_DB_ERROR` | Run `CREATE DATABASE taskmanager;` in MySQL shell |
| `ECONNREFUSED` | MySQL service is not running — start it |
| `TokenExpiredError` | JWT expired — log in again |
| Frontend blank page | Check browser console; confirm backend is on port 5000 |

---

## 🚀 Production Deployment

**Backend** → Railway, Render, Heroku (set env vars in dashboard)  
**Frontend** → Vercel, Netlify (`VITE_API_URL=https://your-api.com/api`)  
**Database** → PlanetScale (free MySQL), Railway MySQL, AWS RDS

---

## 🔐 Security Features

- Passwords hashed with **bcrypt** (10 salt rounds)
- **JWT** tokens expire after 7 days
- **Helmet** sets secure HTTP headers
- **CORS** restricts origin to frontend URL
- **Rate limiting** — 100 requests / 15 min per IP
- Server-side **validation** on every endpoint
- SQL injection prevented by Sequelize parameterised queries
- Cascade delete — removing a user removes all their tasks

---

## MongoDB → MySQL: Key Differences

| Aspect | MongoDB version | This MySQL version |
|--------|----------------|--------------------|
| IDs | ObjectId strings | Integer AUTO_INCREMENT |
| ORM | Mongoose | **Sequelize** |
| Schema | Flexible / schemaless | Strict typed columns |
| Relations | Manual ref | Foreign key + CASCADE |
| Queries | `find({ userId })` | `WHERE userId = ?` |
| Aggregation | `$group` pipeline | `GROUP BY` + `fn('COUNT')` |
| Auto tables | Collections auto-created | `sequelize.sync()` |
