import blobToHash from 'blob-to-hash';
import { toast } from 'react-toastify';
import { Metadata } from './atoms';

export const isDev = import.meta.env.VITE_WEB_ENV !== 'production';
export const baseUrl = isDev
  ? 'https://horizon-testnet.stellar.org'
  : 'https://horizon.stellar.org';
export const ipfsProtocol = 'ipfs://';
const nftStorageApi = 'https://api.nft.storage';
const nftStorageApiKey = import.meta.env.VITE_NFT_STORAGE_API_KEY;
const cloudflareGateway = 'https://cloudflare-ipfs.com/ipfs';

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

export const uploadNFTMetadata = (metadata: Metadata) => {
  const blob = new Blob([JSON.stringify(metadata)], {
    type: 'application/json',
  });

  return uploadFile(blob);
};
