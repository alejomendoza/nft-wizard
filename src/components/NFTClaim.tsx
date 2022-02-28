import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import albedo from '@albedo-link/intent';
import 'twin.macro';

import { walletAtom } from 'src/state/atoms';
import { getSponsoredClaimableBalances } from 'src/utils/stellar';
import { handleResponse, truncateMiddle } from 'src/utils';
import { getConfig } from 'src/utils/stellar/config';

import Button from './elements/Button';

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
    <div>
      <table tw="w-full table-fixed">
        <thead>
          <tr tw="all-child:py-4">
            <th scope="col" align="left">
              Code
            </th>
            <th scope="col">Issuer</th>
            <th scope="col" align="right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {claimsQuery.data.map((cb: any) => {
            const [asset, issuer] = cb.asset.split(':');

            return (
              <tr>
                <td>{asset}</td>
                <td align="center">{truncateMiddle(issuer, 8)}</td>
                <td align="right">
                  <Button size="sm" onClick={() => handleClaim(cb.id)}>
                    Claim
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NFTClaim;
