import blobToHash from 'blob-to-hash';
import { toast } from 'react-toastify';
import * as clipboard from 'clipboard-polyfill/text';
import { NFTStorage } from 'nft.storage';
import { PinStatus } from 'nft.storage/dist/src/lib/interface';

import { Metadata } from 'src/types';

export const isDev = import.meta.env.VITE_WEB_ENV !== 'production';

export const baseUrl = isDev
  ? 'https://horizon-testnet.stellar.org'
  : 'https://horizon.stellar.org';

export const institutionAccount = import.meta.env
  .VITE_INSTITUTION_ACCOUNT as string;

export const nftStorageApiKey = import.meta.env
  .VITE_NFT_STORAGE_API_KEY as string;

export const ipfsProtocol = 'ipfs://';
export const cloudflareGateway = 'https://cloudflare-ipfs.com/ipfs';
export const nftStorageClient = new NFTStorage({ token: nftStorageApiKey });
const nftStorageApi = 'https://api.nft.storage';

export const getMetadata = async (cid: String) => {
  return fetch(cloudflareGateway + `/${cid}`).then(handleResponse);
};

export async function handleResponse(response: Response) {
  const { headers, ok } = response;
  const contentType = headers.get('content-type');

  const content = contentType
    ? contentType.includes('json')
      ? response.json()
      : response.text()
    : { status: response.status, message: response.statusText };

  if (ok) return content;
  else throw await content;
}

export const parseError = (error: any) => {
  if (error instanceof Error) error = error.toString();

  return {
    ...(typeof error === 'string' ? { message: error } : error),
    action:
      '<a href="https://developers.stellar.org/docs" target="_blank" rel="noopener">Get help from the Stellar Docs</a>',
  };
};

export const parseAndToast = (err: any) => {
  console.log(err);
  const error = parseError(err);
  toast.error(error.message, {
    position: toast.POSITION.TOP_RIGHT,
  });
};

export const hashFile = async (file: File) => {
  return blobToHash(
    'sha256',
    new Blob([new Uint8Array(await file.arrayBuffer())], {
      type: file.type,
    })
  );
};

export const uploadFileNFT = async (file: File | Blob) => {
  const { cid: localCid } = await NFTStorage.encodeBlob(file);
  let uploadStatus: { cid: string; status?: PinStatus };

  try {
    const {
      cid,
      pin: { status },
    } = await nftStorageClient.check(localCid.toString());

    if (status === 'failed') throw 'IPFS failed.';

    uploadStatus = { cid, status };
  } catch (e) {
    const cid = await nftStorageClient.storeBlob(file);
    uploadStatus = { cid };
  }

  return uploadStatus;
};

export const uploadNFTMetadata = (metadata: Metadata) => {
  const blob = new Blob([JSON.stringify(metadata)], {
    type: 'application/json',
  });

  return uploadFileNFT(blob);
};

export const uploadFile = (file: File | Blob) => {
  return new Promise((resolve: (value: string) => void, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${nftStorageApi}/upload`, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Authorization', `Bearer ${nftStorageApiKey}`);

    xhr.upload.addEventListener('progress', (e) => {
      const progress = Math.round((e.loaded * 100.0) / e.total);
      // setProgress((oldState) => ({ ...oldState, progress }));
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        let { value, ok } = JSON.parse(xhr.responseText);
        if (!ok) reject('Something went wrong!');
        resolve(value.cid);
      }
    };

    xhr.send(file);
  });
};

export const truncateMiddle = (text: string, maxLength: number) => {
  return (
    text.substring(0, maxLength / 2) +
    '...' +
    text.substring(text.length - maxLength / 2)
  );
};

export function copyText(text: string) {
  clipboard.writeText(text);
}
