const { CloudFrontClient, CreateDistributionCommand } = require("@aws-sdk/client-cloudfront");

const client = new CloudFrontClient({
  region: "us-east-1"
});

const originDomainName = "decisionledger-app-1780231448258.s3-website-us-east-1.amazonaws.com";

async function run() {
  console.log("Creating CloudFront Distribution. This may take a few minutes...");
  
  const params = {
    DistributionConfig: {
      CallerReference: Date.now().toString(),
      Comment: "DecisionLedger Frontend CloudFront",
      Enabled: true,
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: "S3-Website",
            DomainName: originDomainName,
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginProtocolPolicy: "http-only",
              OriginSslProtocols: {
                Quantity: 1,
                Items: ["TLSv1.2"]
              }
            }
          }
        ]
      },
      DefaultCacheBehavior: {
        TargetOriginId: "S3-Website",
        ViewerProtocolPolicy: "redirect-to-https",
        TrustedSigners: {
          Enabled: false,
          Quantity: 0
        },
        ForwardedValues: {
          QueryString: false,
          Cookies: { Forward: "none" }
        },
        MinTTL: 0,
        DefaultTTL: 86400,
        MaxTTL: 31536000
      },
      CustomErrorResponses: {
        Quantity: 2,
        Items: [
          {
            ErrorCode: 403,
            ResponsePagePath: "/index.html",
            ResponseCode: "200",
            ErrorCachingMinTTL: 300
          },
          {
            ErrorCode: 404,
            ResponsePagePath: "/index.html",
            ResponseCode: "200",
            ErrorCachingMinTTL: 300
          }
        ]
      }
    }
  };

  try {
    const command = new CreateDistributionCommand(params);
    const response = await client.send(command);
    console.log("\nSuccess! CloudFront has accepted the request and is deploying.");
    console.log("Your new HTTPS URL (it might take 2-5 minutes to start working):");
    console.log(`https://${response.Distribution.DomainName}`);
  } catch (error) {
    console.error("Error creating distribution:", error);
  }
}

run();
