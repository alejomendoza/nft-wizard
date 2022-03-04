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
import { StyledTable, TableContainer } from 'src/styles/TableStyles';

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
        data._embedded.records
          .filter(({ data: { ipfshash } }) => !!ipfshash)
          .map(({ id, last_modified_time, data: { ipfshash } }) => ({
            id,
            ipfshash: Buffer.from(ipfshash || '', 'base64').toString(),
            last_modified: last_modified_time,
          })),
    }
  );

  const sponsoredAccounts = sponsoredQuery.data;

  return (
    <TableContainer>
      <h2>
        <span>Your NFTs</span>

        <StyledLink to="upload">
          <FaRegPlusSquare /> <span>Upload</span>
        </StyledLink>
      </h2>

      <StyledTable>
        <thead>
          <tr>
            <th scope="col">Issuer</th>
            <th>Last Modified</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {sponsoredAccounts &&
            sponsoredAccounts.length > 0 &&
            sponsoredAccounts.map((account) => (
              <tr key={account.id}>
                <td>
                  <a
                    tw="inline-flex items-baseline gap-2 cursor-pointer"
                    href={getConfig().explorerIssuerUrl(account.id)}
                    target="_blank"
                  >
                    <span>{truncateMiddle(account.id, 8)}</span>
                    <span tw="text-sm">
                      <FaExternalLinkAlt />
                    </span>
                  </a>
                </td>
                <td>
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
                  <StyledLink
                    to="mint"
                    tw="inline"
                    state={{ issuer: account.id, ipfshash: account.ipfshash }}
                  >
                    Mint
                  </StyledLink>
                </td>
              </tr>
            ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

const StyledLink = styled(Link)(
  tw`bg-primary text-white rounded-sm px-4 py-1 flex items-center gap-2`
);

export default NFTList;
