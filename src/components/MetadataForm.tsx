import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import albedo from '@albedo-link/intent';
import { Keypair } from 'stellar-base';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import shajs from 'sha.js';

import Button from 'src/components/elements/Button';
import { createNFT, submitTransaction } from 'src/utils/stellar';
import {
  hashFile,
  ipfsProtocol,
  uploadFileNFT,
  uploadNFTMetadata,
} from 'src/utils';
import { getConfig } from 'src/utils/stellar/config';
import ErrorDisplay from 'src/components/elements/ErrorDisplay';
import FileUpload from './FileUpload';
import useWallet from 'src/hooks/useWallet';

type FormData = {
  name: string;
  code: string;
  description: string;
  hash: string;
  cid: string;
};

const MetadataForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm({
    mode: 'onChange',
    defaultValues: { name: '', code: '', description: '', file: null },
  });

  const { publicKey, signTransaction } = useWallet();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const onSubmit = async (formData: any) => {
    if (!publicKey) return;
    setIsLoading(true);

    const { name, code, description, file } = formData;

    try {
      const fileHash = await hashFile(file);
      const { cid: fileCid } = await uploadFileNFT(file);

      const seed = shajs('sha256').update(fileCid).digest();
      const keypair = Keypair.fromRawEd25519Seed(seed);

      const issuer = keypair.publicKey();
      const domain = 'testdomain.com';
      const url = `${ipfsProtocol}${fileCid}`;

      const nftMetadata = {
        name,
        code,
        description,
        issuer,
        domain,
        url,
        hash: fileHash,
        cid: fileCid,
      };

      const { cid: metadataCid } = await uploadNFTMetadata(nftMetadata);

      const xdr = await createNFT(
        publicKey,
        keypair,
        code,
        domain,
        metadataCid
      );

      const signedXdr = await signTransaction(xdr);
      await submitTransaction(signedXdr);

      queryClient.invalidateQueries('sponsored');
      toast.success('Successfully uploaded NFT.');
      navigate('/');
    } catch (err) {
      setError(err);
      toast.error('Failed to upload NFT.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <label>
        <p>Name</p>
        <input {...register('name', { required: true })} />
      </label>

      <label>
        <p>Asset Code</p>
        <input
          {...register('code', {
            required: true,
            pattern: /^[a-zA-Z0-9]{1,12}$/,
          })}
        />
        {errors.code?.type === 'pattern' && (
          <StyledError>
            Asset code must be alphanumeric and 12 characters max.
          </StyledError>
        )}
      </label>

      <label>
        <p>Description</p>
        <textarea rows={3} {...register('description', { required: true })} />
      </label>

      <Controller
        control={control}
        name="file"
        rules={{ required: true }}
        render={({ field }) => <FileUpload {...field} />}
      />

      {error && <ErrorDisplay error={error} />}

      <Button
        disabled={!isValid}
        tw="ml-auto"
        type="submit"
        isLoading={isLoading}
        loadingText="Uploading"
      >
        Upload
      </Button>
    </StyledForm>
  );
};

const StyledForm = tw.form`space-y-4 [label]:(block space-y-2 [input, textarea]:(w-full p-2 bg-background-tertiary rounded-sm))`;
const StyledError = tw.p`text-sm text-red-500`;

export default MetadataForm;
