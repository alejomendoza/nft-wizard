import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import tw, { styled } from 'twin.macro';

import Button from 'src/components/elements/Button';
import { fileAtom } from 'src/state/atoms';

const MetadataForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const fileInfo = useRecoilValue(fileAtom);

  const onSubmit = (data: any) => {
    console.log(data);
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
      >
        Submit
      </Button>
    </form>
  );
};

const StyledLabel = tw.label`block`;
const StyledInput = tw.input`w-full p-2 bg-gray-100 rounded`;
const StyledTextbox = styled(StyledInput).attrs({
  as: 'textarea',
  rows: 3,
})``;
const StyledError = tw.p`text-sm text-red-500`;

export default MetadataForm;
