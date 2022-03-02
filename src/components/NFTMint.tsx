import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import albedo from '@albedo-link/intent';
import { useQuery } from 'react-query';
import { StrKey } from 'stellar-base';
import tw, { styled } from 'twin.macro';

import Button from './elements/Button';
import { copyText, getMetadata } from 'src/utils';
import { getConfig } from 'src/utils/stellar/config';
import { mintNFT, getAccount } from 'src/utils/stellar';
import { walletAtom } from 'src/state/atoms';
import { FaLink, FaCopy, FaDownload } from 'react-icons/fa';
import { cloudflareGateway } from 'src/utils';

import Spinner from './icons/Spinner';

const NFTMint = () => {
  const { publicKey } = useRecoilValue(walletAtom);
  const { state } = useLocation() as any;
  const [issuer, setIssuer] = useState('');
  const [cid, setCid] = useState('');
  const [destination, setDestination] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const timeoutRef = useRef<any>();

  const accountQuery = useQuery(['mint', 'account'], () => getAccount(issuer), {
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

  const handleMint = async () => {
    setIsMinting(true);
    try {
      const xdr = await mintNFT(publicKey, issuer, cid, destination);
      await albedo.tx({
        xdr,
        network: getConfig().network,
        submit: true,
        pubkey: publicKey,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsMinting(false);
    }
  };

  const isReady =
    StrKey.isValidEd25519PublicKey(issuer) &&
    StrKey.isValidEd25519PublicKey(destination) &&
    ipfsQuery.data;

  const downloadMetaJson = (data: any) => {
    const blob = new Blob([JSON.stringify(data)]);
    const blobUrl = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = `${data?.name || 'metadata'}.json`;

    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  };

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
        <div tw="space-y-4">
          <h2 tw="font-bold">Metadata</h2>
          <StyledLabel>
            <p>Name</p>
            <StyledInput value={ipfsQuery.data.name} disabled />
          </StyledLabel>
          <StyledLabel>
            <p>Code</p>
            <StyledInput value={ipfsQuery.data.code} disabled />
          </StyledLabel>
          <StyledLabel>
            <p>Description</p>
            <StyledInput value={ipfsQuery.data.description} disabled />
          </StyledLabel>
          <StyledLabel>
            <p>Issuer</p>
            <StyledInput value={ipfsQuery.data.issuer} disabled />
          </StyledLabel>
          <StyledLabel>
            <div tw="flex-row flex mb-2 space-x-2 items-center justify-start">
              <p>Domain </p>{' '}
              <a href={ipfsQuery.data.domain} target="_blank">
                <FaLink tw="hover:text-primary" />
              </a>
            </div>
            <a
              href={ipfsQuery.data.domain}
              target="_blank"
              tw="hover:text-primary cursor-pointer"
            >
              <StyledInputLink value={ipfsQuery.data.domain} disabled />
            </a>
          </StyledLabel>
          <StyledLabel>
            <div tw="flex-row flex  mb-2 space-x-2 items-center justify-start">
              <p>Url </p>{' '}
              <a
                href={`${cloudflareGateway}/${ipfsQuery.data.url.replace(
                  'ipfs://',
                  ''
                )}`}
                target="_blank"
              >
                <FaLink tw="hover:text-primary" />
              </a>
            </div>
            <a
              href={`${cloudflareGateway}/${ipfsQuery.data.url.replace(
                'ipfs://',
                ''
              )}`}
              target="_blank"
              tw="hover:text-primary cursor-pointer"
            >
              <StyledInputLink value={ipfsQuery.data.url} disabled />
            </a>
          </StyledLabel>
          <StyledLabel>
            <p>Hash</p>
            <StyledInput value={ipfsQuery.data.hash} disabled />
          </StyledLabel>
          <StyledLabel>
            <p>Cid</p>
            <StyledInput value={ipfsQuery.data.cid} disabled />
          </StyledLabel>
          <div tw="overflow-auto rounded-sm">
            <p tw="mb-2">JSON</p>
            <div tw="relative">
              <div tw="absolute right-2 top-2">
                <CopyButton
                  onClick={() =>
                    copyText(JSON.stringify(ipfsQuery.data, null, 2))
                  }
                >
                  <FaCopy />
                </CopyButton>
                <CopyButton onClick={() => downloadMetaJson(ipfsQuery.data)}>
                  <FaDownload />
                </CopyButton>
              </div>

              <pre
                tw="text-xs leading-6 p-4 bg-background-tertiary"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(ipfsQuery.data, null, 2),
                }}
              />
            </div>
          </div>
        </div>
      )}

      <Button
        disabled={!isReady}
        tw="ml-auto"
        loadingText="Minting"
        isLoading={isMinting}
        onClick={handleMint}
      >
        Mint
      </Button>
    </div>
  );
};

const StyledLabel = tw.label`block space-y-2`;
const StyledInput = tw.input`w-full p-2 bg-background-tertiary rounded-sm`;
const StyledInputLink = tw.input`cursor-pointer w-full p-2 bg-background-tertiary rounded-sm`;

const CopyButton = styled.button(
  (props) =>
    tw`ml-3 text-gray-300 bg-primary p-2 rounded transition-opacity opacity-80 active:(opacity-100)`
);

const IpfsData = ({ cid }: { cid: string }) => {
  const ipfsQuery = useQuery(['mint', cid], () => getMetadata(cid), {
    enabled: !!cid,
    retry: false,
    suspense: true,
  });

  if (!ipfsQuery.data) return null;

  return (
    <div tw="overflow-auto rounded-sm">
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

export default NFTMint;
