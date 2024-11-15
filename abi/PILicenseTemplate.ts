export const PILicenseTemplateAddress = "0x58E2c909D557Cd23EF90D14f8fd21667A5Ae7a93" as const;

export const PILicenseTemplateABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "accessController",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "ipAccountRegistry",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "licenseRegistry",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "royaltyModule",
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
                "name": "ipAccount",
                "type": "address"
            }
        ],
        "name": "AccessControlled__NotIpAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "AccessControlled__ZeroAddress",
        "type": "error"
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
        "name": "FailedInnerCall",
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
        "inputs": [],
        "name": "PILicenseTemplate__CommercialDisabled_CantAddAttribution",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__CommercialDisabled_CantAddCommercializers",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__CommercialDisabled_CantAddDerivativeRevCeiling",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__CommercialDisabled_CantAddRevCeiling",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__CommercialDisabled_CantAddRevShare",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__CommercialDisabled_CantAddRoyaltyPolicy",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__CommercialEnabled_RoyaltyPolicyRequired",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "checker",
                "type": "address"
            }
        ],
        "name": "PILicenseTemplate__CommercializerCheckerDoesNotSupportHook",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__CurrencyTokenNotWhitelisted",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__DerivativesDisabled_CantAddApproval",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__DerivativesDisabled_CantAddAttribution",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__DerivativesDisabled_CantAddDerivativeRevCeiling",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__DerivativesDisabled_CantAddReciprocal",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__RoyaltyPolicyNotWhitelisted",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__RoyaltyPolicyRequiresCurrencyToken",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__ZeroAccessManager",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__ZeroLicenseRegistry",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PILicenseTemplate__ZeroRoyaltyModule",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
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
                "internalType": "uint256",
                "name": "licenseTermsId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "ipId",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "caller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "DerivativeApproved",
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
                "indexed": true,
                "internalType": "uint256",
                "name": "licenseTermsId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "licenseTemplate",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bytes",
                "name": "licenseTerms",
                "type": "bytes"
            }
        ],
        "name": "LicenseTermsRegistered",
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
        "name": "ACCESS_CONTROLLER",
        "outputs": [
            {
                "internalType": "contract IAccessController",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "IP_ACCOUNT_REGISTRY",
        "outputs": [
            {
                "internalType": "contract IIPAccountRegistry",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "LICENSE_REGISTRY",
        "outputs": [
            {
                "internalType": "contract ILicenseRegistry",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ROYALTY_MODULE",
        "outputs": [
            {
                "internalType": "contract IRoyaltyModule",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "TERMS_RENDERER",
        "outputs": [
            {
                "internalType": "contract PILTermsRenderer",
                "name": "",
                "type": "address"
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
                "internalType": "uint256",
                "name": "licenseTermsId",
                "type": "uint256"
            }
        ],
        "name": "exists",
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
                "internalType": "uint256[]",
                "name": "licenseTermsIds",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256",
                "name": "start",
                "type": "uint256"
            }
        ],
        "name": "getEarlierExpireTime",
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
                "internalType": "uint256",
                "name": "licenseTermsId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "start",
                "type": "uint256"
            }
        ],
        "name": "getExpireTime",
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
                "internalType": "uint256",
                "name": "selectedLicenseTermsId",
                "type": "uint256"
            }
        ],
        "name": "getLicenseTerms",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "transferable",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "royaltyPolicy",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "defaultMintingFee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "commercialUse",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "commercialAttribution",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "commercializerChecker",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "commercializerCheckerData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "uint32",
                        "name": "commercialRevShare",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "commercialRevCeiling",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "derivativesAllowed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "derivativesAttribution",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "derivativesApproval",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "derivativesReciprocal",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "derivativeRevCeiling",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "currency",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "uri",
                        "type": "string"
                    }
                ],
                "internalType": "struct PILTerms",
                "name": "terms",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "transferable",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "royaltyPolicy",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "defaultMintingFee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "commercialUse",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "commercialAttribution",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "commercializerChecker",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "commercializerCheckerData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "uint32",
                        "name": "commercialRevShare",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "commercialRevCeiling",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "derivativesAllowed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "derivativesAttribution",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "derivativesApproval",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "derivativesReciprocal",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "derivativeRevCeiling",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "currency",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "uri",
                        "type": "string"
                    }
                ],
                "internalType": "struct PILTerms",
                "name": "terms",
                "type": "tuple"
            }
        ],
        "name": "getLicenseTermsId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "selectedLicenseTermsId",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "licenseTermsId",
                "type": "uint256"
            }
        ],
        "name": "getLicenseTermsURI",
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
        "inputs": [],
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
                "internalType": "uint256",
                "name": "licenseTermsId",
                "type": "uint256"
            }
        ],
        "name": "getRoyaltyPolicy",
        "outputs": [
            {
                "internalType": "address",
                "name": "royaltyPolicy",
                "type": "address"
            },
            {
                "internalType": "uint32",
                "name": "royaltyPercent",
                "type": "uint32"
            },
            {
                "internalType": "uint256",
                "name": "mintingFee",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "currency",
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
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "metadataURI",
                "type": "string"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
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
                "name": "parentIpId",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "licenseTermsId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "childIpId",
                "type": "address"
            }
        ],
        "name": "isDerivativeApproved",
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
                "internalType": "uint256",
                "name": "licenseTermsId",
                "type": "uint256"
            }
        ],
        "name": "isLicenseTransferable",
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
                "components": [
                    {
                        "internalType": "bool",
                        "name": "transferable",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "royaltyPolicy",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "defaultMintingFee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "commercialUse",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "commercialAttribution",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "commercializerChecker",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "commercializerCheckerData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "uint32",
                        "name": "commercialRevShare",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "commercialRevCeiling",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "derivativesAllowed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "derivativesAttribution",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "derivativesApproval",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "derivativesReciprocal",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "derivativeRevCeiling",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "currency",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "uri",
                        "type": "string"
                    }
                ],
                "internalType": "struct PILTerms",
                "name": "terms",
                "type": "tuple"
            }
        ],
        "name": "registerLicenseTerms",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "parentIpId",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "licenseTermsId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "childIpId",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApproval",
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
        "inputs": [
            {
                "internalType": "uint256",
                "name": "licenseTermsId",
                "type": "uint256"
            }
        ],
        "name": "toJson",
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
        "inputs": [],
        "name": "totalRegisteredLicenseTerms",
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
                "internalType": "uint256[]",
                "name": "licenseTermsIds",
                "type": "uint256[]"
            }
        ],
        "name": "verifyCompatibleLicenses",
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
                "internalType": "uint256",
                "name": "licenseTermsId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "licensee",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "licensorIpId",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "verifyMintLicenseToken",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "childIpId",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "parentIpId",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "licenseTermsId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "licensee",
                "type": "address"
            }
        ],
        "name": "verifyRegisterDerivative",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "childIpId",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "parentIpIds",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "licenseTermsIds",
                "type": "uint256[]"
            },
            {
                "internalType": "address",
                "name": "childIpOwner",
                "type": "address"
            }
        ],
        "name": "verifyRegisterDerivativeForAllParents",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;