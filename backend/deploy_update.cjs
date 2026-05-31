const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

// Load local environment variables (if any)
require("dotenv").config({ path: path.join(__dirname, ".env") });

const client = new S3Client({
  region: "us-east-1"
});

const bucketName = "decisionledger-app-1780231448258";
const distPath = path.join(__dirname, "../frontend/dist");

async function run() {
  console.log(`Uploading updated files to existing S3 bucket: ${bucketName}...`);
  
  if (!fs.existsSync(distPath)) {
    throw new Error(`Build directory does not exist at: ${distPath}. Please run 'npm run build' in the frontend folder first.`);
  }

  function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getFiles(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    }
    return fileList;
  }

  const files = getFiles(distPath);
  for (const file of files) {
    const relativePath = path.relative(distPath, file).replace(/\\/g, "/");
    const fileContent = fs.readFileSync(file);
    const contentType = mime.lookup(file) || 'application/octet-stream';
    
    await client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: relativePath,
      Body: fileContent,
      ContentType: contentType
    }));
    console.log(`Uploaded ${relativePath}`);
  }

  console.log(`\nAWS S3 Deployment Complete!`);
}

run().catch(console.error);
