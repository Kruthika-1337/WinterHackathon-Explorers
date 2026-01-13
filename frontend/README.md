# Project Name
Workspace Transperency Platform
## Description
The Workspace Transparency Platform is a web-based system designed to improve transparency and accountability in government infrastructure projects.
It allows contractors to upload real-time progress updates of their work and enables citizens to view ongoing and completed projects in their locality.

The platform reduces information gaps between contractors, authorities, and citizens by providing verified, geo-tagged, and time-stamped project updates in one place.
# Demo Video Link: (https://drive.google.com/file/d/1W9-f9EyikVdBpAmoN9zTN4w4UW0iSplH/view?usp=sharing)

## Features
- Role-based Login
    Contractors and Citizens log in using Google Sign-In
- Contractor Dashboard
    Upload new project details
    Upload weekly progress images
    View project status (Live / Completed)
    Request project time extensions
- Citizen Dashboard
    View ongoing and completed projects in their area
    Track progress through images and progress indicators
    Raise complaints and give feedback
- Transparency & Accountability
    All contractor uploads are visible to citizens
    Prevents fake progress reporting and promotes trust
- Scalable Architecture
    Designed to support authority verification and backend integration

## Tech Stack
- Frontend
    React.js
    Vite
    CSS

- Backend
    Node.js
    Express.js + Multer

- Database / Storage (Planned & Demo-level)
    LocalStorage (for demo persistence)
    Firebase (planned for production use)

## Google Technologies Used
- Google Firebase API
- Google Cloud Storage
- Google drive
- Google Console cloud

## Setup Instructions
Steps to run the project locally:

1️. Clone the Repository
git clone <https://github.com/Kruthika-1337/WinterHackathon-Explorers
cd workspace-transparency-platform

2 Install Dependencies
Frontend
    cd frontend
    npm install

Backend
    cd backend
    npm install

3️ Configure Firebase
    Create a Firebase project
    Enable Google Authentication
    Add Firebase config in firebase.js

4️ Run the Project
    Start Backend
        cd backend
        node server.js

5 Start Frontend
    cd frontend
    npm run dev

## Team Members
- Elfrida Anisha Veigas--frontend
- Kruthika  K R--backend
- Clarice A Dsilva--backend
- Hrimurali K S--frontend