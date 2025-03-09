const cors = require('cors');
const express = require('express');
const { generateUploadURL } = require('./s3');

const app = express();
app.use(cors());

app.get('/s3Url', async (req, res) => {
  const url = await generateUploadURL();
  res.json({ url });
});

app.listen(5000, () => console.log("listening on port 5000"));
