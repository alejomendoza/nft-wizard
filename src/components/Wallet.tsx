import { HiKey } from 'react-icons/hi';
import { RiFileCopyFill } from 'react-icons/ri';
import tw, { styled } from 'twin.macro';

import { copyText, truncateMiddle } from 'src/utils';

import Button from './elements/Button';
import useWallet from 'src/hooks/useWallet';
import albedoLogo from 'src/assets/albedo.svg';
import freighterLogo from 'src/assets/freighter.svg';

export const ConnectWallets = () => {
  return (
    <div tw="text-center my-16">
      <h2 tw="text-5xl mb-20">Connect with a wallet</h2>

      <div tw="grid grid-template-columns[repeat(auto-fit, minmax(25ch, 1fr))] grid-auto-rows[4rem] gap-4 max-w-[70%] mx-auto">
        <AlbedoButton />
        <FreighterButton />
      </div>
    </div>
  );
};

const AlbedoButton = ({ onClick }: any) => {
  const { login } = useWallet('albedo');

  return (
    <StyledButton
      onClick={login}
      leftIcon={() => <img src={albedoLogo} tw="w-6" />}
    >
      <p>Connect with Albedo</p>
    </StyledButton>
  );
};

const FreighterButton = ({ onClick }: any) => {
  const { login } = useWallet('freighter');

  return (
    <StyledButton
      onClick={login}
      leftIcon={() => <img src={freighterLogo} tw="w-5" />}
    >
      <p>Connect with Freighter</p>
    </StyledButton>
  );
};

const StyledButton = styled(Button)(
  tw`text-text bg-transparent! shadow-none border border-border [img]:mr-3 hover:(border-gray-500)`
);

export const WalletMenu = () => {
  const { publicKey, logout } = useWallet();

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

      <p tw="text-text-link hover:cursor-pointer" onClick={logout}>
        Logout
      </p>
    </div>
  );
};

export default ConnectWallets;
