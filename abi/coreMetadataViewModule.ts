export const coreMetadataViewModuleAddress = "0x6839De4A647eE2311bd765f615E09f7bd930ed25" as const;

export const coreMetadataViewModuleABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "ipAssetRegistry",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "moduleRegistry",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "length",
                "type": "uint256"
            }
        ],
        "name": "StringsInsufficientHexLength",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "IP_ASSET_REGISTRY",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MODULE_REGISTRY",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "coreMetadataModule",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "ipId",
                "type": "address"
            }
        ],
        "name": "getCoreMetadata",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "nftTokenURI",
                        "type": "string"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "nftMetadataHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "string",
                        "name": "metadataURI",
                        "type": "string"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "metadataHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "registrationDate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "internalType": "struct ICoreMetadataViewModule.CoreMetadata",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "ipId",
                "type": "address"
            }
        ],
        "name": "getJsonString",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "ipId",
                "type": "address"
            }
        ],
        "name": "getMetadataHash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "ipId",
                "type": "address"
            }
        ],
        "name": "getMetadataURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "ipId",
                "type": "address"
            }
        ],
        "name": "getNftMetadataHash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "ipId",
                "type": "address"
            }
        ],
        "name": "getNftTokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "ipId",
                "type": "address"
            }
        ],
        "name": "getOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "ipId",
                "type": "address"
            }
        ],
        "name": "getRegistrationDate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "ipAccount",
                "type": "address"
            }
        ],
        "name": "isSupported",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "updateCoreMetadataModule",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;