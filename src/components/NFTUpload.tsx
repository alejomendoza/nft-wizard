import tw from 'twin.macro';

import FileUpload from 'src/components/FileUpload';
import MetadataForm from 'src/components/MetadataForm';

const NFTUpload = () => {
  return (
    <div tw="space-y-8">
      <StyledSection>
        <h2>1. IPFS File Upload</h2>
        <FileUpload />
      </StyledSection>

      <StyledSection>
        <h2>2. NFT Metadata</h2>
        <MetadataForm />
      </StyledSection>
    </div>
  );
};

const StyledSection = tw.section`[h2]:(text-xl border-b border-border-secondary pb-3 mb-8)`;

export default NFTUpload;
