const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

let contractAddress = null;
try {
  const addressConfig = require("../../build/contract_address.json");
  contractAddress = addressConfig.address;
} catch (e) {
  console.log("Blockchain Service: No contract address found. Run deploy_contract.cjs first to enable blockchain anchoring.");
}

const contractJson = require("../../build/UniversalLedgerAudit.json");

const rpcUrl = process.env.POLYGON_RPC_URL || "https://polygon-amoy.infura.io/v3/3f766d1be32544f7912d12723a7ecb99";
let privateKey = process.env.POLYGON_PRIVATE_KEY;
if (!privateKey) {
  try {
    const envContent = fs.readFileSync(path.resolve(__dirname, "../../.env"), "utf8");
    const match = envContent.match(/POLYGON_PRIVATE_KEY\s*=\s*([^\r\n]+)/);
    if (match) {
      privateKey = match[1].trim().replace(/['"]/g, "");
    }
  } catch (e) {}
}

let wallet = null;
let contract = null;

if (privateKey && contractAddress) {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    wallet = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(contractAddress, contractJson.abi, wallet);
    console.log("Blockchain Service: Initialized with contract at", contractAddress);
  } catch (err) {
    console.error("Blockchain Service: Failed to initialize:", err);
  }
}

/**
 * Anchor a record's hash onto the blockchain.
 * @param {string} recordType - e.g., "Decision", "Activity", "Invite"
 * @param {string} recordId - The MongoDB document ID
 * @param {string} dataHash - The SHA-256 hash
 * @returns {Promise<{txHash: string, timestamp: Date} | null>}
 */
async function anchorRecord(recordType, recordId, dataHash) {
  if (!contract || !wallet) {
    try {
      const addressConfig = require("../../build/contract_address.json");
      contractAddress = addressConfig.address;
      const key = process.env.POLYGON_PRIVATE_KEY;
      if (key && contractAddress) {
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        wallet = new ethers.Wallet(key, provider);
        contract = new ethers.Contract(contractAddress, contractJson.abi, wallet);
      }
    } catch (e) {}
  }

  if (!contract || !wallet) {
    console.warn("Blockchain Service: Skipping anchoring (Private key or contract address not set)");
    return null;
  }

  try {
    console.log(`Blockchain Service: Anchoring ${recordType} ${recordId} with hash ${dataHash}...`);
    const tx = await contract.anchorRecord(recordType, recordId, dataHash);
    console.log(`Blockchain Service: Transaction sent: ${tx.hash}. Waiting for confirmation...`);
    const receipt = await tx.wait();
    
    const block = await wallet.provider.getBlock(receipt.blockNumber);
    const timestamp = new Date(block.timestamp * 1000);
    
    console.log(`Blockchain Service: Successfully anchored ${recordType} ${recordId}!`);
    return {
      txHash: tx.hash,
      timestamp
    };
  } catch (err) {
    console.error(`Blockchain Service: Error anchoring ${recordType} ${recordId}:`, err);
    return null;
  }
}


async function getRecordHashOnChain(recordType, recordId) {
  let addr = contractAddress;
  if (!addr) {
    try {
      const addressConfig = require("../../build/contract_address.json");
      addr = addressConfig.address;
    } catch (e) {
      return "";
    }
  }
  
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const readOnlyContract = new ethers.Contract(addr, contractJson.abi, provider);
    const hash = await readOnlyContract.getRecordHash(recordType, recordId);
    return hash;
  } catch (err) {
    console.error(`Blockchain Service: Error verifying ${recordType} ${recordId}:`, err);
    return "";
  }
}

module.exports = {
  anchorRecord,
  getRecordHashOnChain
};
