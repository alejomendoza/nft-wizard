import tw from 'twin.macro';

import FileUpload from 'src/components/FileUpload';
import MetadataForm from 'src/components/MetadataForm';

const NFTCreate = () => {
  return (
    <div tw="my-8 space-y-8">
      <h1 tw="text-2xl font-bold mb-4 text-center">Create NFT</h1>

      <StyledSection>
        <StyledTitle>1. IPFS File Upload</StyledTitle>
        <FileUpload />
      </StyledSection>

      <StyledSection>
        <StyledTitle>2. NFT Metadata</StyledTitle>
        <MetadataForm />
      </StyledSection>
    </div>
  );
};

const StyledSection = tw.section``;
const StyledTitle = tw.h2`mb-4 text-lg font-bold`;

export default NFTCreate;
