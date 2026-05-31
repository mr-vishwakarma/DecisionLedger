require("dotenv").config();
const { SSMClient, PutParameterCommand } = require("@aws-sdk/client-ssm");

const client = new SSMClient({ 
  region: "us-east-1"
});

const params = [
  { Name: "/decisionledger/prod/MONGO_URI", Value: process.env.MONGO_URI, Type: "SecureString" },
  { Name: "/decisionledger/prod/JWT_SECRET", Value: process.env.JWT_SECRET, Type: "SecureString" },
  { Name: "/decisionledger/prod/EMAIL_SERVICE", Value: process.env.EMAIL_SERVICE || "gmail", Type: "SecureString" },
  { Name: "/decisionledger/prod/EMAIL_USER", Value: process.env.EMAIL_USER, Type: "SecureString" },
  { Name: "/decisionledger/prod/EMAIL_PASS", Value: process.env.EMAIL_PASS, Type: "SecureString" },
  { Name: "/decisionledger/prod/GOOGLE_CLIENT_ID", Value: process.env.GOOGLE_CLIENT_ID, Type: "SecureString" },
  { Name: "/decisionledger/prod/GOOGLE_CLIENT_SECRET", Value: process.env.GOOGLE_CLIENT_SECRET, Type: "SecureString" }
];

async function upload() {
  for (const param of params) {
    try {
      const command = new PutParameterCommand({ ...param, Overwrite: true });
      await client.send(command);
      console.log(`Successfully uploaded ${param.Name}`);
    } catch (err) {
      console.error(`Failed to upload ${param.Name}:`, err);
    }
  }
}

upload();
