'use client';

import React, { useEffect, useState } from 'react';
import { readContracts } from '@/utils/readContracts';
import { licenseRegistryAddress, licenseRegistryABI } from '@/abi/licenseRegistry';
import { PILicenseTemplateAddress, PILicenseTemplateABI } from '@/abi/PILicenseTemplate';
import { Abi } from 'viem';
import { currencyTokensAddress } from '@/utils/currencyTokenAddress';
import { Tooltip } from '@/components/TitleToolip';
import MintLicenseTokensButton from './MintLicenseTokensButton';


interface LicenseDetailsProps {
  ipId: string;
  isConnected: boolean;
  isOwner: boolean;
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

const LicenseDetails: React.FC<LicenseDetailsProps> = ({ ipId, isConnected, isOwner }) => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLicenseIds, setExpandedLicenseIds] = useState<string[]>([]);


  const tooltips: Record<string, string> = {
    'Transferable': 'If false, the License Token cannot be transferred once it is minted to a recipient address.',
    'Royalty Policy': 'The address of the royalty policy contract. The royalty policy must have been approved by Story Protocol in advance.',
    'Minting Fee (currency)': 'The fee to be paid when minting a license.',
    'Expiration': 'The expiration period of the license.',
    'Commercial Use': 'You can make money from using the original IP Asset, subject to limitations below.',
    'Commercial Attribution': 'If true, people must give credit to the original work in their commercial application (eg. merch)',
    'Commercializer Checker': 'Commercializers that are allowed to commercially exploit the original work. If zero address, then no restrictions are enforced.',
    'Commercializer Checker Data': 'The data to be passed to the commercializer checker contract.',
    'Commercial Rev Share (%)': 'Amount of revenue (from any source, original & derivative) that must be shared with the licensor.',
    'Commercial Rev Ceiling (currency)': 'This value determines the maximum revenue which licensee can earn from your original work.',
    'Derivatives Allowed': 'Indicates whether the licensee can create derivatives of his work or not.',
    'Derivatives Attribution': 'If true, derivatives that are made must give credit to the original work.',
    'Derivatives Approval': 'If true, the licensor must approve derivatives of the work.',
    'Derivatives Reciprocal': 'If true, derivatives of this derivative can be created indefinitely as long as they have the exact same terms.',
    'Derivative Rev Ceiling (currency)': 'This value determines the maximum revenue which can be earned from derivative works.',
    'Currency': 'The ERC20 token to be used to pay the minting fee.',
    'URI': 'The URI of the license terms, which can be used to fetch off-chain license terms.',
  };

  const getLicenseTermsCount = async (ipId: `0x${string}`): Promise<bigint> => {
    return await readContracts(
      licenseRegistryAddress as `0x${string}`,
      licenseRegistryABI as Abi,
      "getAttachedLicenseTermsCount",
      [ipId]
    );
  };

  const getAttachedLicenseTerms = async (ipId: `0x${string}`, index: number): Promise<number> => {
    const licenseTerms = await readContracts(
      licenseRegistryAddress as `0x${string}`,
      licenseRegistryABI as Abi,
      "getAttachedLicenseTerms",
      [ipId, index]
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

  useEffect(() => {
    const fetchLicenses = async () => {
      setLoading(true);
      try {
        const licenseTermsCount = await getLicenseTermsCount(ipId as `0x${string}`);
        const licenseDetails: License[] = [];

        for (let index = 0; index < Number(licenseTermsCount); index++) {
          const attachedLicenseTermId = await getAttachedLicenseTerms(ipId as `0x${string}`, index);
          const licenseTerm = await getLicenseTerm(attachedLicenseTermId as number);
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

  const toggleLicenseDetails = (licenseId: string) => {
    setExpandedLicenseIds(prev =>
      prev.includes(licenseId)
        ? prev.filter(id => id !== licenseId)
        : [...prev, licenseId]
    );
  };

  const getCurrencySymbol = (address: string) => {
    const entry = Object.entries(currencyTokensAddress).find(
      ([, tokenAddress]) => tokenAddress === address
    );
    return entry ? entry[0] : address;
  };

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
    <div className="mt-6 space-y-4">
      {licenses.map((license) => (
        <div key={license.id} className="p-4 rounded shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h4
              className="text-lg font-semibold cursor-pointer text-gray-800 w-1/2 hover:underline hover:text-gray-600"
              onClick={() => toggleLicenseDetails(license.id)}
            >
              License ID: {license.id} {license.id === '1' ? '(Non-commercial)' : '(Commercial)'}
            </h4>
            {isConnected && isOwner && license.id !== '1' && (
              <MintLicenseTokensButton ipId={ipId} licenseTermsId={license.id} />
            )}
          </div>
          {expandedLicenseIds.includes(license.id) && (
            <div className="space-y-2 mt-4">
              {license.licenseTerms.map((term, termIndex) => (
                <div key={termIndex} className="flex justify-between items-center border-b pb-2 mb-2">
                  <Tooltip text={tooltips[term.trait_type] || ''}>
                    <span className="font-medium text-gray-700">
                      {term.trait_type}:
                    </span>
                  </Tooltip>
                  <span className="text-gray-900">
                    {term.trait_type === 'Currency'
                      ? getCurrencySymbol(term.value as string)
                      : term.value.toString()}
                    {term.max_value ? ` (Max: ${term.max_value})` : ''}
                  </span>
                </div>
              ))}
              <div className="">
                <span className="font-medium text-gray-700">
                  {license.id !== '1'
                    ? <p>License Legal Text: <a className='underline mt-8' href='https://github.com/storyprotocol/protocol-core-v1/blob/main/PIL_Testnet.pdf'>https://github.com/storyprotocol/protocol-core-v1/blob/main/PIL_Testnet.pdf</a></p> : ''
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LicenseDetails;
