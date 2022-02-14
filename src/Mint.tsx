import React from 'react';
import { useRecoilState } from 'recoil';
import { fileAtom, filesInfoAtom, uploadingErrorAtom } from './state/atoms';
import { useForm } from 'react-hook-form';

const cloudflareGateway = 'https://cloudflare-ipfs.com/ipfs';
const nftStorageApi = 'https://api.nft.storage';
const nftStorageApiKey = import.meta.env.VITE_NFT_STORAGE_API_KEY;

function Mint() {
  const [uploadingError, setUploadingError] =
    useRecoilState(uploadingErrorAtom);

  const [filesInfo, setFilesInfo] = useRecoilState(filesInfoAtom);
  const { handleSubmit } = useForm();

  const dropFile = async (e: any) => {
    e.preventDefault();
    dragClass(e);
    const file = e.target.files
      ? e.target.files[0]
      : e.dataTransfer.items[0].getAsFile();
    if (file?.type === 'image/png') {
      const id = file.name;
      console.log(file);
      setFilesInfo((oldState) => {
        const clone = { ...oldState, [id]: { progress: 0, file } };
        return clone;
      });
    }
  };

  const dragClass = (e: any) => {
    e.preventDefault();
    if (e.type == 'dragover') {
      e.target.classList.add('dragging');
    } else {
      e.target.classList.remove('dragging');
    }
  };

  const uploadFile = (file: any, id: string) => {
    return new Promise((resolve: (value: string) => void, reject) => {
      setFilesInfo((oldState: any) => {
        oldState[id] = { progress: 0 };
        return oldState;
      });
      let xhr = new XMLHttpRequest();
      xhr.open('POST', `${nftStorageApi}/upload`, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Authorization', `Bearer ${nftStorageApiKey}`);

      xhr.upload.addEventListener('progress', (e) => {
        const progress = Math.round((e.loaded * 100.0) / e.total);
        setFilesInfo((oldState: any) => {
          const clone = { ...oldState, [id]: { ...oldState[id], progress } };
          return clone;
        });
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
          setFilesInfo((oldState: any) => {
            const clone = {
              ...oldState,
              [id]: {
                ...oldState[id],
                imgSrc: `${cloudflareGateway}/${value.cid}`,
                cid: value.cid,
              },
            };

            return clone;
          });
          resolve(value.cid);
        }
      };

      xhr.send(file);
    });
  };

  const mintFile = () => {};

  return (
    <div>
      <h1 className="text-2xl m-4">Mint NFTs</h1>
      <div className="flex items-center justify-center space-x-4">
        {Object.keys(filesInfo).map((val) => {
          return (
            <form
              className="flex items-center justify-center space-x-4"
              onSubmit={handleSubmit(() => {
                if (filesInfo[val].cid) {
                  return mintFile();
                }
                uploadFile(filesInfo[val].file, val);
              })}
            >
              <button
                type="submit"
                disabled={!filesInfo[val].file}
                className={`${
                  !filesInfo[val].file ? 'bg-indigo-400' : 'bg-indigo-600'
                } group relative w-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {filesInfo[val].file ? 'Upload NFT' : 'Mint NFT'}
              </button>
            </form>
          );
        })}

        <label
          className="cursor-pointer rounded bg-black flex items-center justify-center bg-green h-10 w-40"
          onDrop={dropFile}
          onDragOver={dragClass}
          onDragLeave={dragClass}
        >
          <input
            className="invisible opacity-0 hidden"
            type="file"
            multiple={false}
            accept="image/png"
            onInput={dropFile}
          />
          <p className="text-2xl">📁 </p>
          <p className="text-sm text-white pl-2">Add File</p>
        </label>
      </div>
    </div>
  );
}

export default Mint;
