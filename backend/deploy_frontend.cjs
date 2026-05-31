const { S3Client, CreateBucketCommand, PutBucketWebsiteCommand, PutBucketPolicyCommand, PutPublicAccessBlockCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const client = new S3Client({
  region: "us-east-1"
});

const bucketName = `decisionledger-app-${Date.now()}`;
const distPath = path.join(__dirname, "../frontend/dist");

async function run() {
  console.log(`Creating bucket ${bucketName}...`);
  await client.send(new CreateBucketCommand({ Bucket: bucketName }));
  
  console.log("Removing public access blocks...");
  // Wait a little before putting the public access block
  await new Promise(r => setTimeout(r, 2000));
  await client.send(new PutPublicAccessBlockCommand({
    Bucket: bucketName,
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: false,
      IgnorePublicAcls: false,
      BlockPublicPolicy: false,
      RestrictPublicBuckets: false
    }
  }));

  console.log("Applying public read policy...");
  await new Promise(r => setTimeout(r, 2000));
  const policy = {
    Version: "2012-10-17",
    Statement: [{
      Sid: "PublicReadGetObject",
      Effect: "Allow",
      Principal: "*",
      Action: ["s3:GetObject"],
      Resource: [`arn:aws:s3:::${bucketName}/*`]
    }]
  };
  await client.send(new PutBucketPolicyCommand({ Bucket: bucketName, Policy: JSON.stringify(policy) }));

  console.log("Configuring static website hosting...");
  await client.send(new PutBucketWebsiteCommand({
    Bucket: bucketName,
    WebsiteConfiguration: {
      IndexDocument: { Suffix: "index.html" },
      ErrorDocument: { Key: "index.html" }
    }
  }));

  console.log("Uploading files to S3...");
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

  console.log(`\nDeployment Complete!`);
  console.log(`Your Frontend URL: http://${bucketName}.s3-website-us-east-1.amazonaws.com`);
}

run().catch(console.error);
