// load and use only the individual AWS Services you need
const { S3 } = require( '@aws-sdk/client-s3' );

const { fromContainerMetadata } = require("@aws-sdk/credential-providers"); // CommonJS import

const s3 = new S3({
  credentials: fromContainerMetadata({
    // Optional. The connection timeout (in milliseconds) to apply to any remote requests.
    // If not specified, a default value of `1000` (one second) is used.
    timeout: 1000,
    // Optional. The maximum number of times any HTTP connections should be retried. If not
    // specified, a default value of `0` will be used.
    maxRetries: 0,
  }),
  region: "eu-west-1",
});
require('dotenv').config()


const key = process.env.KEY || "file.txt";
const bucket = process.env.BUCKET;
console.log("S3 BUCKET:", bucket);
console.log("S3 OBJECT:", key);

async function main() {
  const tasks = [];
  for (let i = 0; i < 100000; i++) {
    tasks.push(getObject(i));
  }
}

async function getObject() {
  try {
    const result = await s3.getObject({Bucket: bucket,  Key: key });
    console.log("Success", result);
  }
  catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(error);
  }
}

main();