import tw from 'twin.macro';

import { copyText } from 'src/utils';

const ErrorDisplay = ({ error }: any) => {
  const errorString = JSON.stringify(error, null, 2);

  return (
    <Container>
      <div tw="flex justify-between items-end font-mono uppercase">
        <p>Error</p>
        <CopyButton type="button" onClick={() => copyText(errorString)}>
          Copy Error
        </CopyButton>
      </div>
      <ErrorWrapper>
        <pre
          tw="text-xs leading-6"
          dangerouslySetInnerHTML={{
            __html: errorString,
          }}
        />
      </ErrorWrapper>
    </Container>
  );
};

const Container = tw.div`mx-auto w-full space-y-2`;
const ErrorWrapper = tw.div`p-4 overflow-auto bg-error-background border border-error-border rounded-sm`;
const CopyButton = tw.button`bg-error-background border border-error-border py-1 px-3 rounded-sm text-xs tracking-widest uppercase active:(bg-error-border) transition-colors`;

export default ErrorDisplay;
