const { SQS, ListQueuesCommand } = require( '@aws-sdk/client-sqs' );


const client = new SQS( {region: "eu-west-1"} );


async function run(){
    try {
        const data = await client.send(new ListQueuesCommand({}))
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}
run()