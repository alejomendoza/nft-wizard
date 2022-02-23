import { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import 'twin.macro';

import { getSponsored } from 'src/stellar';
import { userAtom } from 'src/state/atoms';
import Spinner from './icons/Spinner';
import { truncateMiddle } from 'src/state/utils';
import Button from './elements/Button';

const Dashboard = () => {
  const user = useRecoilValue(userAtom);
  if (!user?.account_id) return null;

  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <SponsoredAccounts publicKey={user.account_id} />
      </Suspense>
    </div>
  );
};

const SponsoredAccounts = ({ publicKey }: { publicKey: string }) => {
  const sponsoredQuery = useQuery(
    ['sponsored'],
    () => getSponsored(publicKey),
    {
      suspense: true,
      refetchOnWindowFocus: false,
      select: (data) =>
        data._embedded.records.map(
          ({ id, data: { ipfshash }, ...rest }: any) => ({
            id,
            ipfshash: Buffer.from(ipfshash, 'base64').toString(),
          })
        ) as { id: string; ipfshash: string }[],
    }
  );

  const sponsoredAccounts = sponsoredQuery.data;

  if (!sponsoredAccounts || !(sponsoredAccounts.length > 0)) {
    return <p>No accounts found.</p>;
  }

  return (
    <table tw="w-full table-fixed">
      <thead>
        <tr tw="all-child:py-4">
          <th scope="col" tw="text-left">
            Public Key
          </th>
          <th scope="col" tw="text-right">
            Options
          </th>
        </tr>
      </thead>
      <tbody>
        {sponsoredAccounts.map((account) => (
          <tr key={account.id}>
            <td>{truncateMiddle(account.id, 8)}</td>
            <td tw="flex gap-2 justify-end">
              <Link
                to="mint"
                state={{ issuer: account.id, ipfshash: account.ipfshash }}
              >
                Mint
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Dashboard;
