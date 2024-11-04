'use client';

import React, { useEffect, useState } from 'react';
import { readContracts } from '@/utils/readContracts';
import { licenseRegistryAddress, licenseRegistryABI } from '@/abi/licenseRegistry';
import { PILicenseTemplateAddress, PILicenseTemplateABI } from '@/abi/PILicenseTemplate';
import { Abi } from 'viem';

interface LicenseDetailsProps {
  ipId: string;
}

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

const LicenseDetails: React.FC<LicenseDetailsProps> = ({ ipId }) => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getLicenseTermsCount = async (
    ipId: `0x${string}`
  ): Promise<bigint> => {
    return await readContracts(
      licenseRegistryAddress as `0x${string}`,
      licenseRegistryABI as Abi,
      "getAttachedLicenseTermsCount",
      [ipId]
    );
  };

  const getAttachedLicenseTerms = async (
    ipId: `0x${string}`,
    index: number
  ): Promise<number> => {
    const licenseTerms = await readContracts(
      licenseRegistryAddress as `0x${string}`,
      licenseRegistryABI as Abi,
      "getAttachedLicenseTerms",
      [ipId, index]
    );
    return Number(licenseTerms[1]);
  };

  const getLicenseTerm = async (
    attachedLicenseTerm: number,
  ): Promise<Terms> => {
    return await readContracts(
      PILicenseTemplateAddress as `0x${string}`,
      PILicenseTemplateABI as Abi,
      "getLicenseTerms",
      [attachedLicenseTerm]
    );
  };

  useEffect(() => {
    const fetchLicenses = async () => {
      setLoading(true);
      try {
        const licenseTermsCount = await getLicenseTermsCount(ipId as `0x${string}`);
        const licenseDetails: License[] = [];

        for (let index = 0; index < Number(licenseTermsCount); index++) {
          const attachedLicenseTermId = await getAttachedLicenseTerms(ipId as `0x${string}`, index);
          const licenseTerm = await getLicenseTerm(attachedLicenseTermId as number); // attachedLicenseTermId уже в формате BigInt
          const license: License = {
            id: attachedLicenseTermId.toString(),
            licenseTerms: [
              { trait_type: 'Transferable', value: licenseTerm.transferable.toString() },
              { trait_type: 'Royalty Policy', value: licenseTerm.royaltyPolicy },
              { trait_type: 'Default Minting Fee', value: licenseTerm.defaultMintingFee.toString() },
              { trait_type: 'Expiration', value: licenseTerm.expiration.toString() },
              { trait_type: 'Commercial Use', value: licenseTerm.commercialUse.toString() },
              { trait_type: 'Commercial Attribution', value: licenseTerm.commercialAttribution.toString() },
              { trait_type: 'Commercializer Checker', value: licenseTerm.commercializerChecker },
              { trait_type: 'Commercializer Checker Data', value: licenseTerm.commercializerCheckerData },
              { trait_type: 'Commercial Rev Share', value: licenseTerm.commercialRevShare },
              { trait_type: 'Commercial Rev Ceiling', value: licenseTerm.commercialRevCeiling.toString() },
              { trait_type: 'Derivatives Allowed', value: licenseTerm.derivativesAllowed.toString() },
              { trait_type: 'Derivatives Attribution', value: licenseTerm.derivativesAttribution.toString() },
              { trait_type: 'Derivatives Approval', value: licenseTerm.derivativesApproval.toString() },
              { trait_type: 'Derivatives Reciprocal', value: licenseTerm.derivativesReciprocal.toString() },
              { trait_type: 'Derivative Rev Ceiling', value: licenseTerm.derivativeRevCeiling.toString() },
              { trait_type: 'Currency', value: licenseTerm.currency },
              { trait_type: 'URI', value: licenseTerm.uri },
            ]
          };

          licenseDetails.push(license);
        }

        setLicenses(licenseDetails);
      } catch (error: any) {
        console.error('Error loading licenses:', error);
        setError('Failed to load licenses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchLicenses();
  }, [ipId]);

  if (loading) {
    return <div>Loading license details...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (licenses.length === 0) {
    return <div>No commercial or non-commercial licenses available.</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Licenses</h3>
      {licenses.map((license, index) => (
        <div key={index} className="bg-gray-100 p-4 rounded mb-4">
          <h4 className="text-lg font-semibold mb-2">
            License ID: {license.id} {license.id === '1' ? '(Non commercial)' : '(Commercial)'}
          </h4>
          <ul className="list-disc list-inside">
            {license.licenseTerms.map((term, termIndex) => (
              <li key={termIndex}>
                <strong>{term.trait_type}:</strong> {term.value}
                {term.max_value ? ` (Max: ${term.max_value})` : ''}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LicenseDetails;
