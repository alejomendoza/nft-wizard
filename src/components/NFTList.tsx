import { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FaExternalLinkAlt, FaRegPlusSquare } from 'react-icons/fa';
import 'twin.macro';

import { getSponsoredAccounts } from 'src/utils/stellar';
import { walletAtom } from 'src/state/atoms';
import { truncateMiddle } from 'src/utils';

import Spinner from './icons/Spinner';
import tw, { styled } from 'twin.macro';
import { getConfig } from 'src/utils/stellar/config';

const NFTList = () => {
  const { publicKey } = useRecoilValue(walletAtom);

  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <SponsoredAccounts publicKey={publicKey} />
      </Suspense>
    </div>
  );
};

const SponsoredAccounts = ({ publicKey }: { publicKey: string }) => {
  const sponsoredQuery = useQuery(
    ['sponsored'],
    () => getSponsoredAccounts(publicKey),
    {
      suspense: true,
      select: (data) =>
        data._embedded.records.map(
          ({ id, last_modified_time, data: { ipfshash } }: any) => ({
            id,
            ipfshash: Buffer.from(ipfshash, 'base64').toString(),
            last_modified: last_modified_time,
          })
        ) as { id: string; ipfshash: string; last_modified: string }[],
    }
  );

  const sponsoredAccounts = sponsoredQuery.data;

  if (!sponsoredAccounts || !(sponsoredAccounts.length > 0)) {
    return <p>No accounts found.</p>;
  }

  return (
    <div tw="rounded-sm border-2 border-black/20 [h2, th, td]:(px-4 py-4 sm:px-8) shadow">
      <h2 tw="font-bold flex items-center justify-between">
        <span>Your NFTs</span>
        <StyledLink to="create">
          <FaRegPlusSquare /> <span>Create</span>
        </StyledLink>
      </h2>

      <table tw="w-full [th]:(text-sm font-normal text-gray-500) [tr]:(border-t border-black/20)">
        <thead>
          <tr>
            <th scope="col" align="left">
              Public Key
            </th>
            <th>Last Modified</th>
            <th scope="col" align="right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {sponsoredAccounts.map((account) => (
            <tr key={account.id}>
              <td>
                <a
                  tw="flex items-baseline gap-2 cursor-pointer max-w-min"
                  href={getConfig().explorerIssuerUrl(account.id)}
                  target="_blank"
                >
                  <span>{truncateMiddle(account.id, 8)}</span>
                  <span tw="text-sm">
                    <FaExternalLinkAlt />
                  </span>
                </a>
              </td>
              <td align="center">
                {new Date(account.last_modified).toLocaleTimeString(
                  navigator.language,
                  {
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  }
                )}
              </td>
              <td>
                <div tw="flex items-center justify-end gap-4">
                  <StyledLink
                    to="mint"
                    state={{ issuer: account.id, ipfshash: account.ipfshash }}
                  >
                    Mint
                  </StyledLink>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StyledLink = styled(Link)(
  tw`bg-brand-primary text-white rounded-sm px-4 py-1 flex items-center gap-2`
);

export default NFTList;
