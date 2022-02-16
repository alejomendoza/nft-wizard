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
import { hashFile, uploadFile } from 'src/state/utils';

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
      const hash = await hashFile(file);
      setFileInfo((oldState) => ({ ...oldState, file, hash }));
    }
  };

  const handleUpload = async () => {
    if (fileInfo.file) {
      setProgress((oldState) => ({ ...oldState, isLoading: true }));
      try {
        const cid = await uploadFile(fileInfo.file);
        setFileInfo((oldState) => ({
          ...oldState,
          cid: cid,
          isUploaded: true,
        }));
      } catch (err) {
        setUploadingError(err as any);
      } finally {
        setProgress((oldState) => ({ ...oldState, isLoading: false }));
      }
    }
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
          onClick={() => handleUpload()}
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
