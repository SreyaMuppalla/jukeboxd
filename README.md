# Jukeboxd
## Overview
Music is a core part of Gen Z’s culture, yet there is no centralized platform for music reviews. Instead, discussions are scattered across several online platforms, which are cluttered and lack structured review systems. Jukeboxd bridges this gap by providing a dedicated, community-driven space for music lovers to rate, review, and discuss their favorite songs and artists.

## Features
- User Profiles and Social Interactions (following and viewing public reviews)
- Home Feed
   - Trending Songs and Albums
   - Search bar for song, album and artist discovery
   - Algorithm for recommendations according to friend reviews
- Song, Album and Artist Pages
   - View entities with relevant information retreived from the Spotify API
   - Entrypoint popup to cretae your own reviews

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

## Directory Structure
.
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── node_modules
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── src
│   ├── App.css
│   ├── bigcomponents
│   │   ├── Comments.js
│   │   ├── FriendsPopUp.js
│   │   ├── Header.js
│   │   ├── Review.js
│   │   ├── SongsCarousal.js
│   │   └── WriteAReview.js
│   ├── images
│   │   ├── albumpic.jpg
│   │   ├── jkbxlogo.png
│   │   └── pfp.jpg
│   ├── index.css
│   ├── pages
│   │   ├── album-page
│   │   │   └── index.js
│   │   ├── api
│   │   │   └── hello.js
│   │   ├── _app.js
│   │   ├── artist-page
│   │   │   └── index.js
│   │   ├── _document.js
│   │   ├── feed
│   │   │   └── index.js
│   │   ├── index.js
│   │   ├── profile
│   │   │   └── index.js
│   │   ├── profile-page
│   │   │   └── index.js
│   │   └── song-page
│   │       └── index.js
│   ├── smallcomponents
│   │   ├── FriendsSearchBar.js
│   │   ├── Logo.js
│   │   ├── PostButton.js
│   │   ├── SearchBar.js
│   │   └── Stars.js
│   └── styles
│       ├── globals.css
│       └── StyledComponents.js
├── tailwind.config.mjs
└── README.md
