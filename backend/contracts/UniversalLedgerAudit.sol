// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UniversalLedgerAudit {
    address public owner;
    
    // Mapping: recordType -> recordId -> dataHash
    mapping(string => mapping(string => string)) private recordHashes;
    // Mapping: recordType -> recordId -> timestamp
    mapping(string => mapping(string => uint256)) private anchorTimestamps;

    event RecordAnchored(string indexed recordType, string indexed recordId, string dataHash, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function anchorRecord(string calldata recordType, string calldata recordId, string calldata dataHash) external onlyOwner {
        require(bytes(recordHashes[recordType][recordId]).length == 0, "Record already anchored");
        recordHashes[recordType][recordId] = dataHash;
        anchorTimestamps[recordType][recordId] = block.timestamp;
        emit RecordAnchored(recordType, recordId, dataHash, block.timestamp);
    }

    function getRecordHash(string calldata recordType, string calldata recordId) external view returns (string memory) {
        return recordHashes[recordType][recordId];
    }

    function getAnchorTimestamp(string calldata recordType, string calldata recordId) external view returns (uint256) {
        return anchorTimestamps[recordType][recordId];
    }
}
