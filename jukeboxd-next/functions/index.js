const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require('firebase-admin');
const next = require('next');

// Initialize admin app without config - it uses the default credentials
admin.initializeApp();

// Access Firebase services
const auth = admin.auth();
const db = admin.firestore();

// Export Firebase auth and Firestore services for use in other files
exports.auth = auth;
exports.db = db;

// // Simple test function to verify deployment works
exports.helloWorld = onRequest((req, res) => {
  logger.info("Hello logs!", {structuredData: true});
  res.send("Hello from Firebase!");
});

// Next.js server function
// We'll keep this commented until we confirm basic deployment works
// exports.nextServer = onRequest({
//   memory: "1GiB",  // Increase memory allocation for Next.js
//   timeoutSeconds: 60  // Increase timeout
// }, (req, res) => {
//   const dev = false;  // Always set to false in production
//   const dir = '.';    // Root directory for Next.js app
  
//   const app = next({ 
//     dev, 
//     conf: { 
//       distDir: '.next',
//       // Keep config minimal to avoid issues
//     }
//   });
  
//   const handle = app.getRequestHandler();
  
//   logger.info(`New request: ${req.url}`);
  
//   return app.prepare()
//     .then(() => handle(req, res))
//     .catch(error => {
//       logger.error('Error during request handling:', error);
//       res.status(500).send('Internal Server Error');
//     });
// });