## Jukeboxd
Music is a core part of Gen Z’s culture, yet there is no centralized platform for music reviews. Instead, discussions are scattered across several online platforms, which are cluttered and lack structured review systems. Jukeboxd bridges this gap by providing a dedicated, community-driven space for music lovers to rate, review, and discuss their favorite songs and artists.

## Installation and Getting started
```bash
npm install && npm run dev
```
# Firebase-React App

## Overview
This is a React application integrated with Firebase, allowing users to manage users, add songs, and leave comments. It leverages Firestore for data storage and authentication.

## Features
- User authentication
- Adding and managing users
- Adding songs with metadata
- Commenting on songs
- Fetching and displaying comments sorted in descending order

## Setup Instructions
### Prerequisites
- Node.js (v16+ recommended)
- Firebase SDK configured

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/SreyaMuppalla/jukeboxd.git
   cd jukeboxd/jukeboxd-next
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Firebase:
   - Create a `.env` file and add the Firebase configurations:
     ```sh
     REACT_APP_FIREBASE_API_KEY=<your_api_key>
     REACT_APP_FIREBASE_AUTH_DOMAIN=<your_auth_domain>
     REACT_APP_FIREBASE_PROJECT_ID=<your_project_id>
     REACT_APP_FIREBASE_STORAGE_BUCKET=<your_storage_bucket>
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
     REACT_APP_FIREBASE_APP_ID=<your_app_id>
     ```
4. Run the app locally:
    ```bash
    npm run dev
    ```
The app should now be running on `http://localhost:3000/`.
