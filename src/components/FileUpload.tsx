import React, { useState } from 'react';
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { fileAtom, uploadingErrorAtom } from '../state/atoms';
import 'twin.macro';

import Button from 'src/components/elements/Button';

const cloudflareGateway = 'https://cloudflare-ipfs.com/ipfs';
const nftStorageApi = 'https://api.nft.storage';
const nftStorageApiKey = import.meta.env.VITE_NFT_STORAGE_API_KEY;

function Mint() {
  const [uploadingError, setUploadingError] =
    useRecoilState(uploadingErrorAtom);

  const [fileInfo, setFileInfo] = useRecoilState(fileAtom);
  const setProgress = useSetRecoilState(progressAtom);
  const isLoading = useRecoilValue(progressSelector);

  const dropFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (file && file.type === 'image/png') {
      setFileInfo((oldState) => ({ ...oldState, file }));
    }
  };

  const uploadFile = () => {
    setProgress((oldState) => ({ ...oldState, isLoading: true }));

    return new Promise((resolve: (value: string) => void, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', `${nftStorageApi}/upload`, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Authorization', `Bearer ${nftStorageApiKey}`);

      xhr.upload.addEventListener('progress', (e) => {
        const progress = Math.round((e.loaded * 100.0) / e.total);
        setProgress((oldState) => ({ ...oldState, progress }));
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          setProgress((oldState) => ({
            ...oldState,
            isLoading: false,
          }));

          let { value, ok } = JSON.parse(xhr.responseText);

          if (!ok) {
            setUploadingError('Something went wrong!');
            reject();
            return;
          }

          setFileInfo((oldState) => ({
            ...oldState,
            cid: value.cid,
            isUploaded: true,
          }));

          resolve(value.cid);
        }
      };

      xhr.send(fileInfo.file);
    });
  };

  return (
    <div tw="space-y-4">
      <label tw="cursor-pointer">
        <input
          tw="invisible opacity-0 hidden disabled:sibling:(bg-green-700 cursor-not-allowed)"
          type="file"
          multiple={false}
          accept="image/png"
          onInput={dropFile}
          disabled={isLoading || fileInfo.isUploaded}
        />
        <p tw="flex items-center justify-center rounded bg-green px-6 py-2 text-white">
          <span tw="text-2xl mr-2">📁</span> Add File
        </p>
      </label>

      <div tw="space-y-4">
        <div>
          <h2 tw="font-bold">File Info:</h2>
          {fileInfo.file ? (
            <p>{`Name: ${fileInfo.file.name}`}</p>
          ) : (
            <p>Please add a file to upload.</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!fileInfo.file || fileInfo.isUploaded}
          isLoading={isLoading}
          onClick={() => uploadFile()}
          tw="ml-auto"
        >
          {fileInfo.isUploaded ? '✔️ Uploaded' : 'Upload'}
        </Button>
      </div>
    </div>
  );
}

const progressAtom = atom({
  key: 'progress',
  default: { progress: 0, isLoading: false },
});

const progressSelector = selector({
  key: 'progressIsLoading',
  get: ({ get }) => get(progressAtom).isLoading,
});

const ProgressBar = () => {
  const { progress } = useRecoilValue(progressAtom);

  return (
    <div tw="flex justify-center relative bg-gray-200 rounded p-1 z-0">
      <div
        tw="absolute inset-0 rounded bg-gradient-to-b from-green-300 to-green z-index[-1]"
        style={{
          width: `${progress}%`,
        }}
      />
      <p>
        {progress === 0
          ? 'Progress'
          : progress === 100
          ? 'Complete'
          : 'Loading'}
      </p>
    </div>
  );
};

export default Mint;
