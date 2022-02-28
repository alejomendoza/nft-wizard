import albedo from '@albedo-link/intent';
import { useNavigate } from 'react-router';
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from 'recoil';
import { HiKey } from 'react-icons/hi';
import { RiFileCopyFill } from 'react-icons/ri';
import 'twin.macro';

import { walletAtom } from 'src/state/atoms';
import { copyText, truncateMiddle } from 'src/utils';

import Button from './elements/Button';

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
    <Button tw="w-full" onClick={() => openAlbedoAuth()}>
      Albedo
    </Button>
  );
};

export const WalletMenu = () => {
  const { publicKey } = useRecoilValue(walletAtom);
  const resetWallet = useResetRecoilState(walletAtom);

  if (!publicKey) return null;

  return (
    <div tw="flex items-center gap-2">
      <p
        onClick={() => copyText(publicKey)}
        tw="flex items-center gap-1 transition-colors hover:(cursor-pointer text-stellar-violet)"
      >
        <HiKey />
        {truncateMiddle(publicKey, 8)}
        <RiFileCopyFill tw="text-stellar-violet" />
      </p>

      <div tw="h-full border-l border-gray-300" />

      <p tw="text-stellar-violet hover:cursor-pointer" onClick={resetWallet}>
        Logout
      </p>
    </div>
  );
};

export default Wallet;
