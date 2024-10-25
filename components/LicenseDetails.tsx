'use client';

import React, { useEffect, useState } from 'react';

interface LicenseDetailsProps {
  ipId: string;
}

interface License {
  id: string;
  licenseTerms: Array<{
    trait_type: string;
    value: string | number;
    max_value?: number;
  }>;
}

const LicenseDetails: React.FC<LicenseDetailsProps> = ({ ipId }) => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        // Первый запрос для получения лицензий IP
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-API-Key': process.env.NEXT_PUBLIC_X_API_KEY as string,
            'X-CHAIN': process.env.NEXT_PUBLIC_X_CHAIN as string,
          },
        };

        const response = await fetch(`https://api.storyprotocol.net/api/v1/licenses/ip/terms/${ipId}`, options);
        if (!response.ok) {
          throw new Error('Error fetching licenses');
        }

        const licenseData = await response.json();

        // Фильтрация лицензий: если licenseTermsId === 1, то это некоммерческая лицензия
        const commercialLicenses = licenseData.data.filter(
          (license: any) => license.licenseTermsId !== '0' && license.licenseTermsId !== '1'
        );

        // Добавление некоммерческой лицензии, если она присутствует
        const nonCommercialLicense = licenseData.data.find((license: any) => license.licenseTermsId === '1');

        const licenseDetails = await Promise.all(
          commercialLicenses.map(async (license: any) => {
            const termsResponse = await fetch(
              `https://api.storyprotocol.net/api/v1/licenses/terms/${license.licenseTermsId}`,
              options
            );

            if (!termsResponse.ok) {
              throw new Error('Error fetching license terms');
            }

            const termsData = await termsResponse.json();
            return {
              id: termsData.data.id,
              licenseTerms: termsData.data.licenseTerms,
            };
          })
        );

        // Добавление некоммерческой лицензии в список лицензий
        if (nonCommercialLicense) {
          licenseDetails.unshift({
            id: '1',
            licenseTerms: [
              { trait_type: 'License Type', value: 'Non-Commercial' },
              { trait_type: 'Description', value: 'This is a non-commercial license.' },
            ],
          });
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
            License ID: {license.id} {license.id === '1' && '(Non-Commercial)'}
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
