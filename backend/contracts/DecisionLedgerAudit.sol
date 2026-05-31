// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DecisionLedgerAudit {
    address public owner;
    
    mapping(string => string) private decisionHashes;
    mapping(string => uint256) private anchorTimestamps;

    event DecisionAnchored(string indexed decisionId, string dataHash, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function anchorDecision(string calldata decisionId, string calldata dataHash) external onlyOwner {
        require(bytes(decisionHashes[decisionId]).length == 0, "Decision already anchored");
        decisionHashes[decisionId] = dataHash;
        anchorTimestamps[decisionId] = block.timestamp;
        emit DecisionAnchored(decisionId, dataHash, block.timestamp);
    }

    function getDecisionHash(string calldata decisionId) external view returns (string memory) {
        return decisionHashes[decisionId];
    }

    function getAnchorTimestamp(string calldata decisionId) external view returns (uint256) {
        return anchorTimestamps[decisionId];
    }
}
