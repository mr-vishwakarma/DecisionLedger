require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const contractJson = require("./build/UniversalLedgerAudit.json");

const rpcUrl = process.env.POLYGON_RPC_URL || "https://polygon-amoy.infura.io/v3/3f766d1be32544f7912d12723a7ecb99";
let privateKey = process.env.POLYGON_PRIVATE_KEY;
if (!privateKey) {
  try {
    const envContent = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
    const match = envContent.match(/POLYGON_PRIVATE_KEY\s*=\s*([^\r\n]+)/);
    if (match) {
      privateKey = match[1].trim().replace(/['"]/g, "");
    }
  } catch (e) {}
}

if (!privateKey) {
  console.error("Please set POLYGON_PRIVATE_KEY in your .env file first!");
  process.exit(1);
}

async function main() {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("Deploying contract from account:", wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  console.log("Account balance (in MATIC):", ethers.formatEther(balance));
  
  if (balance === 0n) {
    console.error("Wallet has 0 MATIC. Please add some MATIC to cover gas fees.");
    process.exit(1);
  }

  const factory = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode, wallet);
  
  console.log("Deploying contract...");
  const contract = await factory.deploy();
  
  console.log("Waiting for deployment transaction to be mined...");
  await contract.waitForDeployment();
  
  const deployedAddress = await contract.getAddress();
  console.log("Contract deployed successfully to:", deployedAddress);
  
  // Save address for backend usage
  fs.writeFileSync(
    path.join(__dirname, "build", "contract_address.json"),
    JSON.stringify({ address: deployedAddress }, null, 2)
  );
}

main().catch(console.error);
