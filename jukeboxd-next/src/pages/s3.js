require('dotenv').config();
const aws = require('aws-sdk');
const { promisify } = require("util");
const crypto = require("crypto");  
const randomBytes = promisify(crypto.randomBytes);


const region = "us-east-1"
const bucketName = "profile-pictures-jukeboxd"
const accessKeyId = process.env.NEXT_PUBLIC_s3_ACCESS_KEY_ID
const secretAccessKey = process.env.NEXT_PUBLIC_s3_SECRET_ACCESS_KEY

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
});

async function generateUploadURL() {
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = {
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    };

    return await s3.getSignedUrlPromise('putObject', params);
}

module.exports = { generateUploadURL };
