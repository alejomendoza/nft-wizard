import albedo from '@albedo-link/intent';
import { useNavigate } from 'react-router';
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from 'recoil';
import { HiKey } from 'react-icons/hi';
import { RiFileCopyFill } from 'react-icons/ri';
import 'twin.macro';

import { walletAtom } from 'src/state/atoms';
import { copyText, truncateMiddle } from 'src/utils';

import Button from './elements/Button';

export const ConnectWallets = () => {
  return (
    <div tw="mx-auto max-w-3xl text-center">
      <h2 tw="text-5xl">Connect with a wallet</h2>

      <div tw="mx-auto max-w-2xl mt-20 justify-center items-center flex">
        <Wallet />
      </div>
    </div>
  );
};

const Wallet = () => {
  const setWallet = useSetRecoilState(walletAtom);
  const navigate = useNavigate();

  const openAlbedoAuth = () => {
    albedo.publicKey({}).then((result) => {
      setWallet({ publicKey: result.pubkey });
      navigate('/');
    });
  };

  return (
    <Button
      onClick={() => openAlbedoAuth()}
      leftIcon={() => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="896"
          height="1024"
          viewBox="0 0 896 1024"
          tw="w-4 h-4 block"
        >
          <path
            fill="#0691b7"
            d="M463.313 7.189h-42.172L-5.776 1016.272l1.276.54h113.923l85.432-201.929a843.025 843.025 0 00546.847-2.85l86.639 204.779h60.61l1.277-.54L463.31 7.189zm.856 813.714A804.155 804.155 0 01209.8 779.56l259.081-612.373 257.936 609.659a804.61 804.61 0 01-262.648 44.056z"
          ></path>
        </svg>
      )}
    >
      <p>Connect with Albedo</p>
    </Button>
  );
};

export const WalletMenu = () => {
  const { publicKey } = useRecoilValue(walletAtom);
  const resetWallet = useResetRecoilState(walletAtom);

  if (!publicKey) return null;

  return (
    <div tw="flex items-center gap-2 sm:gap-4">
      <p
        onClick={() => copyText(publicKey)}
        tw="flex items-center gap-1 transition-colors hover:(cursor-pointer text-primary)"
      >
        <HiKey />
        {truncateMiddle(publicKey, 8)}
        <RiFileCopyFill tw="text-primary" />
      </p>

      <div tw="h-full border-l border-current" />

      <p tw="text-text-link hover:cursor-pointer" onClick={resetWallet}>
        Logout
      </p>
    </div>
  );
};

export default Wallet;
