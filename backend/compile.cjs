const path = require("path");
const fs = require("fs");
const solc = require("solc");

const contractPath = path.resolve(__dirname, "contracts", "DecisionLedgerAudit.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "DecisionLedgerAudit.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

console.log("Compiling contract...");
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((err) => {
    console.error(err.formattedMessage);
  });
}

const buildPath = path.resolve(__dirname, "build");
if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath);
}

const contract = output.contracts["DecisionLedgerAudit.sol"]["DecisionLedgerAudit"];

fs.writeFileSync(
  path.resolve(buildPath, "DecisionLedgerAudit.json"),
  JSON.stringify({
    abi: contract.abi,
    bytecode: contract.evm.bytecode.object,
  }, null, 2)
);

console.log("Compilation successful! Saved to build/DecisionLedgerAudit.json");
