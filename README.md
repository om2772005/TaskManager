
# TaskVerse

**TaskVerse** is a responsive web-based task management system designed to help users organize, track, and manage their tasks efficiently.

Built with modern technologies including **NestJS** for the backend, **Next.js** for the frontend, and **MongoDB** for data storage, this app supports full CRUD operations via REST APIs.

---

## 🚀 Tech Stack

- **Backend:** NestJS (Node.js)
- **Frontend:** Next.js (React.js)
- **Database:** MongoDB
- **Communication:** REST API

---

## ✅ Core Features

- **Create Task:** Add tasks with title, description, due date, and status (`To-Do`, `In Progress`, `Completed`)
- **Read Tasks:** View tasks with support for sorting, filtering, and pagination
- **Update Task:** Edit task details anytime
- **Delete Task:** Remove tasks when no longer needed

---

## 🎯 Goals

- Deliver a seamless and intuitive user experience
- Ensure secure and scalable backend APIs with proper authentication
- Maintain data consistency and integrity in MongoDB

---

## 🛠️ Setup Instructions

### 1. Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or cloud)

---

### 2. Clone the Repository

```bash
git clone https://github.com/om2772005/TaskManager
# or download ZIP and extract manually
```

---

### 3. Open the Project

Use **VS Code** or any editor/terminal of your choice to open the folder.

---

### 4. Environment Setup

Create `.env` files in both `Backend` and `Frontend` folders:

#### 🔹 Backend `.env`
```env
uri=<Your MongoDB URL>
secret=<Your JWT Secret Key>
host=http://localhost:5173
```

#### 🔹 Frontend `.env`
```env
VITE_API=http://localhost:5000
```

---

### 5. Install Dependencies

#### Backend:
```bash
cd Backend
npm install
```

#### Frontend:
```bash
cd ../Frontend
npm install
```

---

### 6. Run Locally

Update `.env` values for local development:

- `host=http://localhost:5173` (in backend)
- `VITE_API=http://localhost:5000` (in frontend)

Then run the servers:

#### Start Backend:
```bash
cd Backend
npx nodemon app.js
# or
node app.js
```

#### Start Frontend:
```bash
cd ../Frontend
npm run dev
```

---

### 7. Access the App

Open your browser at:

```
http://localhost:5173
```

---

## 🌐 Live Demo

Check out the live version:
(Takes 40-50 second at first login please be patient!)

🔗 [https://hilarious-faloodeh-4662f4.netlify.app](https://hilarious-faloodeh-4662f4.netlify.app)


