import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import albedo from '@albedo-link/intent';
import { Keypair } from 'stellar-base';
import { useRecoilValue } from 'recoil';
import { toast } from 'react-toastify';
import tw, { styled } from 'twin.macro';
import shajs from 'sha.js';

import Button from 'src/components/elements/Button';
import { fileAtom, walletAtom } from 'src/state/atoms';
import { createNFT, submitTransaction } from 'src/utils/stellar';
import { ipfsProtocol, uploadNFTMetadata } from 'src/utils';
import { getConfig } from 'src/utils/stellar/config';

type FormData = { name: string; code: string; description: string };

const MetadataForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { name: '', code: '', description: '' },
  });

  const fileInfo = useRecoilValue(fileAtom);
  const { publicKey } = useRecoilValue(walletAtom);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!publicKey || !fileInfo.file) return;
    setIsLoading(true);

    const { name, code, description } = data;

    const seed = shajs('sha256').update(fileInfo.cid).digest();
    const keypair = Keypair.fromRawEd25519Seed(seed);

    const issuer = keypair.publicKey();
    const domain = 'testdomain.com';
    const url = `${ipfsProtocol}${fileInfo.cid}`;

    const nftMetadata = {
      name,
      code,
      description,
      issuer,
      domain,
      url,
      hash: fileInfo.hash,
      cid: fileInfo.cid,
    };

    const metadataCid = await uploadNFTMetadata(nftMetadata);

    const xdr = await createNFT(publicKey, keypair, code, domain, metadataCid);

    try {
      const { signed_envelope_xdr } = await albedo.tx({
        xdr,
        network: getConfig().network,
      });
      await submitTransaction(signed_envelope_xdr);

      queryClient.invalidateQueries('sponsored');
      toast.success('Successfully uploaded NFT.');
      navigate('/');
    } catch (err) {
      console.log(err);
      toast.error('Failed to upload.');
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

      <label>
        <p>File Hash</p>
        <input readOnly disabled value={fileInfo.hash} />
      </label>

      <label>
        <p>IPFS CID</p>
        <input readOnly disabled value={fileInfo.cid} />
      </label>

      <Button
        disabled={!isValid || !fileInfo.isUploaded}
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
