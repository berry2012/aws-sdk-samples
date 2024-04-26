const AWS = require('aws-sdk');
require('dotenv').config()

const customBackoff = (retryCount) => {
  console.log(`retry count: ${retryCount}, waiting: 1000ms`)
  return 1000
}

const s3 = new AWS.S3({
  credentialProvider: new AWS.CredentialProviderChain(),
  maxRetries: 3,
  // retryDelayOptions: { customBackoff },
  httpOptions: {
    connectTimeout: 2 * 100, // time succeed in starting the call
    timeout: 2 * 100, // time to wait for a response
    // the aws-sdk defaults to automatically retrying
    // if one of these limits are met.
  },  
});

const key = process.env.KEY || "file.txt";
const bucket = process.env.BUCKET;
console.log("S3 BUCKET:", bucket);
console.log("S3 OBJECT:", key);

async function main() {
  const tasks = [];
  for (let i = 0; i < 100000; i++) {
    tasks.push(getObject(i));
  }
  await Promise.all(tasks);
}


async function getObject() {
  try {
    const result = await s3.getObject({Bucket: bucket,  Key: key }).promise();
    console.log("Success", result);
  }
  catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(error);
  }
}

main();