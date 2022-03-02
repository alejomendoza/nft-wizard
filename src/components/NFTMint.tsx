import { Suspense, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import albedo from '@albedo-link/intent';
import { useQuery } from 'react-query';
import { StrKey } from 'stellar-base';
import { toast } from 'react-toastify';

import tw from 'twin.macro';

import Button from './elements/Button';
import { copyText, getMetadata } from 'src/utils';
import { getConfig } from 'src/utils/stellar/config';
import { mintNFT } from 'src/utils/stellar';
import { walletAtom } from 'src/state/atoms';
import { FaLink, FaCopy, FaDownload } from 'react-icons/fa';
import { cloudflareGateway } from 'src/utils';

import Spinner from './icons/Spinner';
import ErrorDisplay from './elements/ErrorDisplay';

const NFTMint = () => {
  const {
    state: { issuer, ipfshash },
  } = useLocation() as any;

  const { publicKey } = useRecoilValue(walletAtom);

  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleMint = async () => {
    setIsLoading(true);

    try {
      const xdr = await mintNFT(publicKey, issuer, ipfshash, destination);
      await albedo.tx({
        xdr,
        network: getConfig().network,
        submit: true,
        pubkey: publicKey,
      });

      toast.success('Successfully minted.');
    } catch (e) {
      setError(e);
      toast.error('Failed to mint.');
    } finally {
      setIsLoading(false);
    }
  };

  const isReady = StrKey.isValidEd25519PublicKey(destination);

  return (
    <div tw="space-y-4">
      <StyledSection>
        <h2>Mint</h2>

        <label>
          <p>NFT Issuer</p>
          <input placeholder="G..." value={issuer} disabled />
        </label>

        <label>
          <p>Destination</p>
          <input
            placeholder="G..."
            onChange={(e) => setDestination(e.target.value)}
            value={destination}
          />
        </label>

        {error && <ErrorDisplay error={error} />}

        <Button
          disabled={!isReady}
          tw="ml-auto"
          loadingText="Minting"
          isLoading={isLoading}
          onClick={handleMint}
        >
          Mint
        </Button>
      </StyledSection>

      <Suspense fallback={<Spinner />}>
        <IpfsData cid={ipfshash} />
      </Suspense>
    </div>
  );
};

const IpfsData = ({ cid }: { cid: string }) => {
  const ipfsQuery = useQuery(['mint', cid], () => getMetadata(cid), {
    enabled: !!cid,
    suspense: true,
  });

  if (!ipfsQuery.data) return null;

  return (
    <StyledSection>
      <h2>Metadata</h2>

      {Object.entries(ipfsQuery.data).map(([key, value]: any) => {
        if (key === 'url') {
          const url = `${cloudflareGateway}/${value.replace('ipfs://', '')}`;

          return (
            <label key={key}>
              <div tw="flex items-center gap-2">
                <p tw="capitalize">{key}</p>
                <a href={url} target="_blank">
                  <FaLink tw="hover:text-primary" />
                </a>
              </div>
              <a
                href={url}
                target="_blank"
                tw="block cursor-pointer hover:text-primary"
              >
                <StyledInputLink value={ipfsQuery.data.url} disabled />
              </a>
            </label>
          );
        }

        return (
          <label key={key}>
            <p tw="capitalize">{key}</p>
            <input value={value} disabled />
          </label>
        );
      })}

      <div tw="overflow-auto rounded-sm">
        <p tw="mb-2">JSON</p>
        <div tw="relative">
          <div tw="absolute flex gap-2 right-2 top-2">
            <CopyButton
              onClick={() => copyText(JSON.stringify(ipfsQuery.data, null, 2))}
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
    </StyledSection>
  );
};

const StyledSection = tw.section`space-y-4 [h2]:(text-xl border-b border-border-secondary pb-3 mb-8) [label]:(block space-y-2) [input]:(w-full p-2 bg-background-tertiary rounded-sm)`;
const StyledInputLink = tw.input`cursor-pointer w-full p-2 bg-background-tertiary rounded-sm`;
const CopyButton = tw.button`text-white bg-primary p-2 rounded transition-colors hover:bg-primary-hover`;

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

export default NFTMint;
