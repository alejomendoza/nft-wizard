import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import albedo from '@albedo-link/intent';
import { FaExternalLinkAlt } from 'react-icons/fa';
import 'twin.macro';

import { walletAtom } from 'src/state/atoms';
import { getSponsoredClaimableBalances } from 'src/utils/stellar';
import { handleResponse, truncateMiddle } from 'src/utils';
import { getConfig } from 'src/utils/stellar/config';

import Button from './elements/Button';
import { StyledTable, TableContainer } from 'src/styles/TableStyles';

const NFTClaim = () => {
  const { publicKey } = useRecoilValue(walletAtom);

  const claimsQuery = useQuery(
    [publicKey, 'claimable_balances'],
    () => getSponsoredClaimableBalances(publicKey, publicKey),
    { suspense: true, select: (data) => data._embedded.records }
  );

  const handleClaim = async (balanceId: string) => {
    try {
      const { xdr } = await fetch(
        `https://claim-nft-endpoint-quhceeea5030.runkit.sh/?student=${publicKey}&balanceId=${balanceId}`
      ).then(handleResponse);

      await albedo.tx({
        xdr,
        pubkey: publicKey,
        network: getConfig().network,
        submit: true,
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <TableContainer>
      <h2>Claimable NFTs</h2>

      <StyledTable tw="table-fixed">
        <thead>
          <tr>
            <th scope="col">Issuer</th>
            <th scope="col">Code</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {claimsQuery.data.map((cb: any) => {
            const [asset, issuer] = cb.asset.split(':');

            return (
              <tr key={cb.id}>
                <td>
                  <a
                    tw="inline-flex items-baseline gap-2 cursor-pointer"
                    href={getConfig().explorerIssuerUrl(issuer)}
                    target="_blank"
                  >
                    <span>{truncateMiddle(issuer, 8)}</span>
                    <span tw="text-sm">
                      <FaExternalLinkAlt />
                    </span>
                  </a>
                </td>

                <td>{asset}</td>

                <td>
                  <Button
                    tw="inline px-4 py-1"
                    onClick={() => handleClaim(cb.id)}
                  >
                    Claim
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default NFTClaim;
