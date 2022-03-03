import { forwardRef } from 'react';
import 'twin.macro';

import upload from 'src/assets/upload.svg';

const FileUpload = forwardRef<HTMLInputElement, any>(
  ({ onChange, value }, ref) => {
    const dropFile = async (e: any) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.target?.files
        ? e.target.files[0]
        : e.dataTransfer.items[0].getAsFile();

      if (file) {
        onChange(file);
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
            ref={ref}
            tw="invisible opacity-0 hidden inset-0 disabled:sibling:(bg-background-tertiary cursor-not-allowed)"
            type="file"
            multiple={false}
            onInput={dropFile}
          />
          <div tw="flex flex-col gap-8 items-center rounded border-4 border-dashed p-8 bg-background-secondary">
            <img src={upload} tw="max-w-[12rem]" />
            <p tw="font-bold">{value ? '✓ Ready For Upload' : '+ Add File'}</p>
          </div>
        </label>

        <div tw="space-y-4">
          <div>
            <h3 tw="font-bold">File Info:</h3>
            <p>
              {value ? `Name: ${value.name}` : 'Please add a file to upload.'}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

export default FileUpload;
