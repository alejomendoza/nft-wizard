import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useIsFetching } from 'react-query';
import { StrKey } from 'stellar-base';
import tw from 'twin.macro';

import Button from './elements/Button';
import { getMetadata } from 'src/state/utils';
import { getAccount } from 'src/stellar/config';
import Spinner from './icons/Spinner';

const MintNFT = () => {
  const { state } = useLocation() as any;
  const [issuer, setIssuer] = useState('');
  const [cid, setCid] = useState('');
  const [destination, setDestination] = useState('');
  const timeoutRef = useRef<any>();

  const accountQuery = useQuery(['mint', 'account'], () => getAccount(issuer), {
    refetchOnWindowFocus: false,
    enabled: false,
    onSuccess: (account) => {
      setCid(Buffer.from(account.data?.ipfshash || '', 'base64').toString());
    },
  });

  const ipfsQuery = useQuery(['mint', cid], () => getMetadata(cid), {
    enabled: !!cid,
  });

  useEffect(() => {
    if (state?.issuer && state?.ipfshash) {
      setIssuer(state.issuer);
      setCid(state.ipfshash);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const issuer = e.target.value;
    setIssuer(issuer);

    clearTimeout(timeoutRef.current);

    if (StrKey.isValidEd25519PublicKey(issuer)) {
      timeoutRef.current = setTimeout(() => {
        accountQuery.refetch();
      }, 1500);
    }
  };

  const isReady =
    StrKey.isValidEd25519PublicKey(issuer) &&
    StrKey.isValidEd25519PublicKey(destination) &&
    ipfsQuery.data;

  return (
    <div tw="space-y-4">
      <StyledLabel>
        <p>NFT Issuer</p>
        <StyledInput value={issuer} onChange={handleInput} />
      </StyledLabel>

      <StyledLabel>
        <p>Destination</p>
        <StyledInput
          onChange={(e) => setDestination(e.target.value)}
          value={destination}
        />
      </StyledLabel>

      {ipfsQuery.data && (
        <div tw="overflow-auto rounded-md">
          <p>NFT Metadata</p>
          <pre
            tw="text-xs leading-6 p-4 bg-gray-100"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(ipfsQuery.data, null, 2),
            }}
          />
        </div>
      )}

      <Button disabled={!isReady} tw="ml-auto">
        Mint
      </Button>
    </div>
  );
};

const StyledLabel = tw.label`block`;
const StyledInput = tw.input`w-full p-2 bg-gray-100 rounded`;

const IpfsData = ({ cid }: { cid: string }) => {
  const ipfsQuery = useQuery(['mint', cid], () => getMetadata(cid), {
    enabled: !!cid,
    retry: false,
    suspense: true,
  });

  if (!ipfsQuery.data) return null;

  return (
    <div tw="overflow-auto rounded-md">
      <p>NFT Metadata</p>
      <pre
        tw="text-xs leading-6 p-4 bg-gray-100"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ipfsQuery.data, null, 2),
        }}
      />
    </div>
  );
};

export default MintNFT;
