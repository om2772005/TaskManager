# Project overview
TaskVerse is a responsive web-based task management system designed to help users organize, track, and manage their tasks efficiently. Built with modern technologies including NestJS for the backend, Next.js for the frontend, and MongoDB for data storage, this app supports full CRUD operations via REST APIs.

# Tech Stack
Backend: NestJS (Node.js)

Frontend: Next.js (React.js)

Database: MongoDB

Communication: REST API

# Core Features
Create Task: Add new tasks with essential details including title, description, due date, and status (To-Do, In Progress, Completed).

Read Tasks: View all tasks with sorting, filtering, and pagination support.

Update Task: Modify task details anytime.

Delete Task: Remove tasks when no longer needed.

# Goals
Provide a seamless user experience through a responsive and intuitive frontend.

Ensure robust and secure backend APIs with proper authentication and validation.

Maintain data consistency and integrity in MongoDB.

# Setup Instructions 
1. Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

2. Clone the repository-
    git clone https://github.com/om2772005/TaskManager
                   or
   Download the file and extract locally

3. Open it on vs code for better understanding or can use the simple terminal
4. edit the .env File in both Folder
    Backend -
       uri =<MongoDb url>
      secret=< JWT Secret Key>
      host=<Frontend url>
   Frontend -
       VITE_API=<Backend url>
5. Install the dependencies
     Backend -
       Type in Terminal-
           -cd Backend
           -npm i
   Frontend -
       -Type cd ..
      (to come back to prevoius Directory)
       -cd Frontend
       -npm i
6. To start Locally on localHost-
     1.Change the host key in backend .env file as-
        host=http://localhost:5173
     2. Change the VITE_API key in Frontend .env file as-
        VITE_API=http://localhost:5000

  7. To Start the app-
     (Make sure you are on root directory in which Frontend and Backend folder are there)
     type:
       -cd Backend
       -npx nodemon app.js or node app.js (any one would work)
       - cd ..
       - cd Frontend
       - npm run dev
  8. This will start your app on url -  http://localhost:5173

  9. For demo -
     Have a look to this wonderfull task manager-
       https://hilarious-faloodeh-4662f4.netlify.app
 
           

    




