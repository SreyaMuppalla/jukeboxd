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
3. Configure Firebase & S3:
   - Create a `.env.local` file in the `jukeboxd-next` directory and add the Firebase configurations:
     ```sh
     NEXT_PUBLIC_FIREBASE_API_KEY=<your_api_key>
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your_auth_domain>
     NEXT_PUBLIC_DATABASE_URL=<your_database_url>
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your_project_id>
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your_storage_bucket>
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
     NEXT_PUBLIC_FIREBASE_APP_ID=<your_app_id>
     NEXT_PUBLIC_MEASUREMENT_ID=<your_measurement_id>
     ROOT_DIR=<your_root_dir>
     ```
   - Create a `.env` file in the `jukeboxd-next` directory and add the S3 configurations:
     ```sh
     S3_ACCESS_KEY_ID=<s3_access_key>
     S3_SECRET_ACCESS_KEY=<s3_secret_access_key>
     ```
4. Run the app locally:
    ```bash
    npm run dev
    ```
The app should now be running on `http://localhost:3000/`.
5. To have upload profile picture feature working, also must start server:
   ```bash
    node /path/to/server.js 
    ```

## Directory Structure
The project follows a structures directory layour to keep components, pages and styles organized. The src/ directory contains reusable components such as `bigcomponents/` and `smallcomponents/`, page specific files (`pages/`), global styles (`styles/`) and backend interaction files (`backend/`). A `tests/` directory is included at the root for Jest-based testing, with mock implementations of the database stored in `tests/__mocks__/`. Configuration files like `jest.config.js` and `jest.setup.js` ensure smooth testing setup, whereas `package-lock.json` and `package.json` ensure npm package dependencies are included across development environments. Lastly, `firebase.json`, `firestore.rules` and `firebase.indexes.json` include the standard firebase configurations.

```
jukeboxd-next/
├── eslint.config.mjs
├── firebase.json
├── firebase.indexes.json
├── firestore.rules
├── jsconfig.json
├── next.config.mjs
├── node_modules
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public (includes images)
├── README.md
├── src
│   ├── App.css
│   ├── backend (Interactions with Firebase)
│   │   ├── firebase_api.js (all internal api's)
│   │   ├── firebaseConfig.js (configuration of the firebase project and database)
│   │   ├── sample_user.js (includes sample data for all of the collections in the database)
│   ├── bigcomponents (Utilities that will be used on multiple pages)
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
│   ├── pages (specific pages to route to)
│   │   ├── album-page
│   │   ├── api
│   │   ├── _app.js
│   │   ├── artist-page
│   │   ├── _document.js
│   │   ├── feed
│   │   ├── index.js
│   │   ├── profile
│   │   ├── profile-page
│   │   └── song-page
│   ├── smallcomponents (small scale utilities adding to our features)
│   │   ├── FriendsSearchBar.js
│   │   ├── Logo.js
│   │   ├── PostButton.js
│   │   ├── SearchBar.js
│   │   └── Stars.js
│   └── styles
│       ├── globals.css
│       └── StyledComponents.js
├── tailwind.config.mjs
├── tests
│   ├── [several test files, ex: "WriteAReview.test.js"/"internalAPIs.test.js"]
│   ├── __mocks__ (store mock implementations of modules like external dependencies)
│   │   ├── mockFirestore.js
├── jest.config.js
├── jest.setup.js
└── README.md
```

## Running Local Tests
We are using jest testing and so all you need to do is run:
```bash
   npm test
```