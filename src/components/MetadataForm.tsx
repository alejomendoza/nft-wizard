import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import albedo from '@albedo-link/intent';
import { Keypair } from 'stellar-base';
import { useRecoilValue } from 'recoil';
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
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form tw="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <StyledLabel>
        <p>Name</p>
        <StyledInput {...register('name', { required: true })} />
      </StyledLabel>

      <StyledLabel>
        <p>Asset Code</p>
        <StyledInput
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
      </StyledLabel>

      <StyledLabel>
        <p>Description</p>
        <StyledTextbox {...register('description', { required: true })} />
      </StyledLabel>

      <StyledLabel>
        <p>File Hash</p>
        <StyledInput readOnly disabled value={fileInfo.hash} />
      </StyledLabel>

      <StyledLabel>
        <p>IPFS CID</p>
        <StyledInput readOnly disabled value={fileInfo.cid} />
      </StyledLabel>

      <Button
        disabled={!isValid || !fileInfo.isUploaded}
        tw="ml-auto"
        type="submit"
        isLoading={isLoading}
        loadingText="Submitting"
      >
        Submit
      </Button>
    </form>
  );
};

const StyledLabel = tw.label`block space-y-2`;
const StyledInput = tw.input`w-full p-2 bg-gray-100 rounded`;
const StyledTextbox = styled(StyledInput).attrs({
  as: 'textarea',
  rows: 3,
})``;
const StyledError = tw.p`text-sm text-red-500`;

export default MetadataForm;
