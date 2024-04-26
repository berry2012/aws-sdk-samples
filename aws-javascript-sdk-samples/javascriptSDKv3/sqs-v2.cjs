const { SQS, ListQueuesCommand } = require( '@aws-sdk/client-sqs' );
const { fromContainerMetadata } = require("@aws-sdk/credential-providers"); // CommonJS import


const client = new SQS({
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

async function run(){
    try {
        const data = await client.send(new ListQueuesCommand({}))
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}
run()