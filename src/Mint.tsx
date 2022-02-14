import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { fileAtom, uploadingErrorAtom } from './state/atoms';
import { useForm } from 'react-hook-form';
import { createNFT } from './stellar';

const cloudflareGateway = 'https://cloudflare-ipfs.com/ipfs';
const nftStorageApi = 'https://api.nft.storage';
const nftStorageApiKey = import.meta.env.VITE_NFT_STORAGE_API_KEY;

function Mint() {
  const [uploadingError, setUploadingError] =
    useRecoilState(uploadingErrorAtom);

  const [fileInfo, setFileInfo] = useRecoilState(fileAtom);
  const [progress, setProgress] = useState(0);
  const { handleSubmit } = useForm();

  const dropFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (file && file.type === 'image/png') {
      setFileInfo((oldState) => ({ ...oldState, file }));
    }
  };

  const uploadFile = () => {
    return new Promise((resolve: (value: string) => void, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', `${nftStorageApi}/upload`, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Authorization', `Bearer ${nftStorageApiKey}`);

      xhr.upload.addEventListener('progress', (e) => {
        const progress = Math.round((e.loaded * 100.0) / e.total);
        setProgress(progress);
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          let { value, ok } = JSON.parse(xhr.responseText);

          if (!ok) {
            setUploadingError('Something went wrong!');
            reject();
            return;
          }

          console.log(value);
          setFileInfo((oldState) => ({
            ...oldState,
            status: 'uploaded',
            cid: value.cid,
          }));

          resolve(value.cid);
        }
      };

      xhr.send(fileInfo.file);
    });
  };

  return (
    <div>
      <h1 className="text-2xl m-4 text-center">Mint NFTs</h1>

      <div className="space-y-4">
        <label className="cursor-pointer rounded bg-black flex items-center justify-center bg-green px-6 py-2">
          <input
            className="invisible opacity-0 hidden"
            type="file"
            multiple={false}
            accept="image/png"
            onInput={dropFile}
          />
          <p className="flex items-center text-sm text-white">
            <span className="text-2xl mr-2">📁</span> Add File
          </p>
        </label>

        {fileInfo.file && (
          <>
            <div>
              <h2 className="font-bold text-2xl">File Info:</h2>
              <p>{`Name: ${fileInfo.file.name}`}</p>
            </div>
            <button
              type="submit"
              disabled={!fileInfo}
              className="flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              onClick={() => uploadFile()}
            >
              {fileInfo ? 'Upload NFT' : 'Mint NFT'}
            </button>
          </>
        )}

        {fileInfo.status === 'uploaded' && <form></form>}
      </div>
    </div>
  );
}

export default Mint;
