import tw from 'twin.macro';

import MetadataForm from 'src/components/MetadataForm';

const NFTUpload = () => {
  return (
    <div tw="space-y-8">
      <StyledSection>
        <h2>Upload</h2>
        <MetadataForm />
      </StyledSection>
    </div>
  );
};

const StyledSection = tw.section`[h2]:(text-xl border-b border-border-secondary pb-3 mb-8)`;

export default NFTUpload;
