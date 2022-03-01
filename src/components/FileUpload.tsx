import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import 'twin.macro';

import upload from 'src/assets/upload.svg';

import { fileAtom, uploadingErrorAtom } from 'src/state/atoms';
import Button from 'src/components/elements/Button';
import { hashFile, uploadFile } from 'src/utils';

function FileUpload() {
  const [uploadingError, setUploadingError] =
    useRecoilState(uploadingErrorAtom);

  const [fileInfo, setFileInfo] = useRecoilState(fileAtom);
  const setProgress = useSetRecoilState(progressAtom);
  const isLoading = useRecoilValue(progressSelector);

  const dropFile = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.target?.files
      ? e.target.files[0]
      : e.dataTransfer.items[0].getAsFile();

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
      <label
        tw="cursor-pointer"
        onDrop={dropFile}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
      >
        <input
          tw="invisible opacity-0 hidden inset-0 disabled:sibling:(bg-background-tertiary cursor-not-allowed)"
          type="file"
          multiple={false}
          accept="image/png"
          onInput={dropFile}
          disabled={isLoading || fileInfo.isUploaded}
        />
        <div tw="flex flex-col gap-8 items-center rounded border-4 border-dashed p-8 bg-background-secondary">
          <img src={upload} tw="max-w-[12rem]" />
          <p tw="font-bold">
            {fileInfo.isUploaded
              ? '✓ Uploaded'
              : fileInfo.file
              ? '✓ Ready For Upload'
              : '+ Add File'}
          </p>
        </div>
      </label>

      <div tw="space-y-4">
        <div>
          <h2 tw="font-bold">File Info:</h2>
          <p>
            {fileInfo.file
              ? `Name: ${fileInfo.file.name}`
              : 'Please add a file to upload.'}
          </p>
        </div>

        <Button
          type="submit"
          disabled={!fileInfo.file || fileInfo.isUploaded}
          isLoading={isLoading}
          onClick={() => handleUpload()}
          tw="ml-auto"
          loadingText="Uploading"
        >
          {fileInfo.isUploaded ? '✓ Uploaded' : 'Upload'}
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
        tw="absolute inset-0 rounded bg-gradient-to-b from-green-300 to-green-500 z-index[-1]"
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

export default FileUpload;
