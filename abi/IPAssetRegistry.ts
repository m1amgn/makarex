export const IPAssetRegistryContractAddress = "0x28E59E91C0467e89fd0f0438D47Ca839cDfEc095" as const;

export const IPAssetRegistryContractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "erc6551Registry",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "ipAccountImpl",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "groupingModule",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "authority",
                "type": "address"
            }
        ],
        "name": "AccessManagedInvalidAuthority",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "caller",
                "type": "address"
            },
            {
                "internalType": "uint32",
                "name": "delay",
                "type": "uint32"
            }
        ],
        "name": "AccessManagedRequiredDelay",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "caller",
                "type": "address"
            }
        ],
        "name": "AccessManagedUnauthorized",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "target",
                "type": "address"
            }
        ],
        "name": "AddressEmptyCode",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "AddressInsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "implementation",
                "type": "address"
            }
        ],
        "name": "ERC1967InvalidImplementation",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ERC1967NonPayable",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "EnforcedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ExpectedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FailedInnerCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "caller",
                "type": "address"
            }
        ],
        "name": "GroupIPAssetRegistry__CallerIsNotGroupingModule",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "groupPool",
                "type": "address"
            }
        ],
        "name": "GroupIPAssetRegistry__GroupRewardPoolNotRegistered",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "rewardPool",
                "type": "address"
            }
        ],
        "name": "GroupIPAssetRegistry__InvalidGroupRewardPool",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "groupId",
                "type": "address"
            }
        ],
        "name": "GroupIPAssetRegistry__NotRegisteredGroupIP",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "ipId",
                "type": "address"
            }
        ],
        "name": "GroupIPAssetRegistry__NotRegisteredIP",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "IPAccountRegistry_ZeroERC6551Registry",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "IPAccountRegistry_ZeroIpAccountImpl",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "IPAssetRegistry__AlreadyRegistered",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "contractAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "IPAssetRegistry__InvalidToken",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "contractAddress",
                "type": "address"
            }
        ],
        "name": "IPAssetRegistry__UnsupportedIERC721",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "contractAddress",
                "type": "address"
            }
        ],
        "name": "IPAssetRegistry__UnsupportedIERC721Metadata",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "IPAssetRegistry__ZeroAccessManager",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "IPAssetRegistry__ZeroAddress",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidInitialization",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotInitializing",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
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
        "name": "UUPSUnauthorizedCallContext",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "slot",
                "type": "bytes32"
            }
        ],
        "name": "UUPSUnsupportedProxiableUUID",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "authority",
                "type": "address"
            }
        ],
        "name": "AuthorityUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "implementation",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "IPAccountRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "ipId",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "uri",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "registrationDate",
                "type": "uint256"
            }
        ],
        "name": "IPRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "payer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "treasury",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "feeToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint96",
                "name": "amount",
                "type": "uint96"
            }
        ],
        "name": "IPRegistrationFeePaid",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint64",
                "name": "version",
                "type": "uint64"
            }
        ],
        "name": "Initialized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "treasury",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "feeToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint96",
                "name": "feeAmount",
                "type": "uint96"
            }
        ],
        "name": "RegistrationFeeSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "implementation",
                "type": "address"
            }
        ],
        "name": "Upgraded",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "ERC6551_PUBLIC_REGISTRY",
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
        "name": "GROUPING_MODULE",
        "outputs": [
            {
                "internalType": "contract IGroupingModule",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "IP_ACCOUNT_IMPL",
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
        "name": "IP_ACCOUNT_SALT",
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
        "inputs": [],
        "name": "UPGRADE_INTERFACE_VERSION",
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
                "name": "accessManager",
                "type": "address"
            }
        ],
        "name": "__ProtocolPausable_init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "groupId",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "ipIds",
                "type": "address[]"
            }
        ],
        "name": "addGroupMember",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "authority",
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
                "name": "groupId",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "ipId",
                "type": "address"
            }
        ],
        "name": "containsIp",
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
        "name": "getFeeAmount",
        "outputs": [
            {
                "internalType": "uint96",
                "name": "",
                "type": "uint96"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getFeeToken",
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
                "name": "groupId",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "startIndex",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "size",
                "type": "uint256"
            }
        ],
        "name": "getGroupMembers",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "results",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "groupId",
                "type": "address"
            }
        ],
        "name": "getGroupRewardPool",
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
        "name": "getIPAccountImpl",
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
        "name": "getTreasury",
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
                "name": "accessManager",
                "type": "address"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ipAccount",
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
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ipId",
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
        "name": "isConsumingScheduledOp",
        "outputs": [
            {
                "internalType": "bytes4",
                "name": "",
                "type": "bytes4"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "id",
                "type": "address"
            }
        ],
        "name": "isRegistered",
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
        "inputs": [
            {
                "internalType": "address",
                "name": "groupId",
                "type": "address"
            }
        ],
        "name": "isRegisteredGroup",
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
        "inputs": [
            {
                "internalType": "address",
                "name": "rewardPool",
                "type": "address"
            }
        ],
        "name": "isWhitelistedGroupRewardPool",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isWhitelisted",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
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
        "name": "proxiableUUID",
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
                "internalType": "uint256",
                "name": "chainid",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "register",
        "outputs": [
            {
                "internalType": "address",
                "name": "id",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "groupNft",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "groupNftId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "rewardPool",
                "type": "address"
            }
        ],
        "name": "registerGroup",
        "outputs": [
            {
                "internalType": "address",
                "name": "groupId",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "groupId",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "ipIds",
                "type": "address[]"
            }
        ],
        "name": "removeGroupMember",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newAuthority",
                "type": "address"
            }
        ],
        "name": "setAuthority",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "treasury",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "feeToken",
                "type": "address"
            },
            {
                "internalType": "uint96",
                "name": "feeAmount",
                "type": "uint96"
            }
        ],
        "name": "setRegistrationFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "groupId",
                "type": "address"
            }
        ],
        "name": "totalMembers",
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
        "inputs": [],
        "name": "totalSupply",
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
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newImplementation",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "upgradeToAndCall",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "rewardPool",
                "type": "address"
            }
        ],
        "name": "whitelistGroupRewardPool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;