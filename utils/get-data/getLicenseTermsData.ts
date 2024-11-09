import { Abi } from "viem";
import { readContracts } from "./readContracts";
import { licenseRegistryABI, licenseRegistryAddress } from "@/abi/licenseRegistry";
import { PILicenseTemplateABI, PILicenseTemplateAddress } from "@/abi/PILicenseTemplate";

interface License {
  id: string;
  licenseTerms: Array<{
    trait_type: string;
    value: string | boolean | bigint | number;
    max_value?: number;
  }>;
}

interface Terms {
    transferable: boolean;
    royaltyPolicy: string;
    defaultMintingFee: bigint;
    expiration: bigint;
    commercialUse: boolean;
    commercialAttribution: boolean;
    commercializerChecker: string;
    commercializerCheckerData: string;
    commercialRevShare: number;
    commercialRevCeiling: bigint;
    derivativesAllowed: boolean;
    derivativesAttribution: boolean;
    derivativesApproval: boolean;
    derivativesReciprocal: boolean;
    derivativeRevCeiling: bigint;
    currency: string;
    uri: string;
  }

const getLicenseTermsCount = async (ipaid: `0x${string}`): Promise<bigint> => {
  return await readContracts(
    licenseRegistryAddress as `0x${string}`,
    licenseRegistryABI as Abi,
    "getAttachedLicenseTermsCount",
    [ipaid]
  );
};

const getAttachedLicenseTerms = async (ipaid: `0x${string}`, index: number): Promise<number> => {
  const licenseTerms = await readContracts(
    licenseRegistryAddress as `0x${string}`,
    licenseRegistryABI as Abi,
    "getAttachedLicenseTerms",
    [ipaid, index]
  );
  return Number(licenseTerms[1]);
};

const getLicenseTerm = async (attachedLicenseTerm: number): Promise<Terms> => {
  return await readContracts(
    PILicenseTemplateAddress as `0x${string}`,
    PILicenseTemplateABI as Abi,
    "getLicenseTerms",
    [attachedLicenseTerm]
  );
};

export const getLicenseTermsData = async (ipaid: `0x${string}`): Promise<License[]> => {
  try {
    const licenseTermsCount = await getLicenseTermsCount(ipaid);
    const licenseDetails: License[] = [];

    for (let index = 0; index < Number(licenseTermsCount); index++) {
      const attachedLicenseTermId = await getAttachedLicenseTerms(ipaid, index);
      const licenseTerm = await getLicenseTerm(attachedLicenseTermId);

      const license: License = {
        id: attachedLicenseTermId.toString(),
        licenseTerms: [
          { trait_type: 'Commercial Use', value: licenseTerm.commercialUse.toString() },
          { trait_type: 'Transferable', value: licenseTerm.transferable.toString() },
          { trait_type: 'Derivatives Allowed', value: licenseTerm.derivativesAllowed.toString() },
          { trait_type: 'Derivatives Attribution', value: licenseTerm.derivativesAttribution.toString() },
          { trait_type: 'Derivatives Approval', value: licenseTerm.derivativesApproval.toString() },
          { trait_type: 'Derivatives Reciprocal', value: licenseTerm.derivativesReciprocal.toString() },
          // { trait_type: 'Expiration', value: licenseTerm.expiration.toString() },
          { trait_type: 'Commercial Attribution', value: licenseTerm.commercialAttribution.toString() },
          // { trait_type: 'Commercializer Checker', value: licenseTerm.commercializerChecker },
          // { trait_type: 'Commercializer Checker Data', value: licenseTerm.commercializerCheckerData },
          { trait_type: 'Minting Fee (currency)', value: licenseTerm.defaultMintingFee.toString() },
          { trait_type: 'Commercial Rev Share (%)', value: licenseTerm.commercialRevShare / 10 ** 6 },
          { trait_type: 'Commercial Rev Ceiling (currency)', value: licenseTerm.commercialRevCeiling.toString() },
          { trait_type: 'Derivative Rev Ceiling (currency)', value: licenseTerm.derivativeRevCeiling.toString() },
          { trait_type: 'Currency', value: licenseTerm.currency },
          { trait_type: 'Royalty Policy', value: licenseTerm.royaltyPolicy },
          // { trait_type: 'URI', value: licenseTerm.uri },
        ]
      };

      licenseDetails.push(license);
    }
    return licenseDetails;
  } catch (error) {
    console.error("Error fetching license data:", error);
    throw new Error("Failed to fetch license data");
  }
};
