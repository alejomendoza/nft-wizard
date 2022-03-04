import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useRecoilValue } from 'recoil';
import { toast } from 'react-toastify';
import albedo from '@albedo-link/intent';
import { FaExternalLinkAlt } from 'react-icons/fa';
import 'twin.macro';

import { walletAtom } from 'src/state/atoms';
import { getSponsoredClaimableBalances } from 'src/utils/stellar';
import { handleResponse, institutionAccount, truncateMiddle } from 'src/utils';
import { getConfig } from 'src/utils/stellar/config';

import Button from './elements/Button';
import { StyledTable, TableContainer } from 'src/styles/TableStyles';
import ErrorDisplay from './elements/ErrorDisplay';

const NFTClaim = () => {
  const queryClient = useQueryClient();

  const { publicKey } = useRecoilValue(walletAtom);
  const [claimId, setClaimId] = useState('');
  const [error, setError] = useState(null);

  const claimsQuery = useQuery(
    ['claimable_balances', publicKey],
    () => getSponsoredClaimableBalances(institutionAccount, publicKey),
    { suspense: true, select: (data) => data._embedded.records }
  );

  const handleClaim = async (balanceId: string) => {
    setClaimId(balanceId);
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

      toast.success('Successfully claimed NFT.');
      queryClient.invalidateQueries('claimable_balances');
    } catch (e: any) {
      toast.error('Failed to claim NFT.');
      setError(e);
    } finally {
      setClaimId('');
    }
  };

  const claimableBalances = claimsQuery.data;

  return (
    <div tw="space-y-4">
      {error && <ErrorDisplay error={error} />}

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
            {claimableBalances &&
              claimableBalances.length > 0 &&
              claimableBalances.map((cb) => {
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
                        tw="inline-flex px-4 py-1"
                        onClick={() => handleClaim(cb.id)}
                        disabled={!!claimId}
                        isLoading={claimId === cb.id}
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
    </div>
  );
};

export default NFTClaim;
