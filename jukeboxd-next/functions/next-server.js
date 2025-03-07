const functions = require('firebase-functions');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev,
  conf: { distDir: '.next' },
  dir: path.resolve(__dirname, '..')
});
const handle = app.getRequestHandler();

exports.nextServer = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});