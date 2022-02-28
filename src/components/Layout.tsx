import { Suspense } from 'react';
import { NavLink as Link, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import tw, { styled } from 'twin.macro';

import { walletAtom } from 'src/state/atoms';

import Spinner from './icons/Spinner';
import StellarLogoFull from './icons/StellarLogoFull';
import { WalletMenu } from './Wallet';

const Layout = () => {
  return (
    <MainLayout>
      <Header>
        <HeaderContent>
          <div tw="flex items-center gap-2 text-xl">
            <StellarLogoFull />
            <div tw="border-l h-full border-gray-300" />
            <p>nw</p>
          </div>
          <WalletMenu />
        </HeaderContent>
      </Header>

      <Nav />

      <Content>
        <Outlet />
      </Content>
    </MainLayout>
  );
};

const Nav = () => {
  const { publicKey } = useRecoilValue(walletAtom);

  if (!publicKey) return null;

  return (
    <NavBar>
      <NavMenu tw="py-4 gap-2">
        <NavLink to="/">NFTs</NavLink>
        <NavLink to="/create">Create</NavLink>
        <NavLink to="/mint">Mint</NavLink>
        <NavLink to="/claim">Claim</NavLink>
      </NavMenu>
    </NavBar>
  );
};

const MainLayout = tw.div`min-h-screen`;
const MainSize = tw.div`max-w-4xl mx-auto`;

const Header = tw.header`py-8 bg-white`;
const HeaderContent = tw(MainSize)`flex justify-between`;

const NavBar = tw.nav`sticky top-0 z-10 bg-gray-100 border border-gray-200 shadow-sm`;
const NavMenu = tw(MainSize)`gap-2 py-4 flex justify-between`;

const NavLink = styled(Link).attrs({
  style: ({ isActive }) =>
    isActive ? tw`text-stellar-violet bg-gray-300` : {},
})(
  tw`block rounded flex-1 text-center p-2 transition-colors hover:bg-gray-200`
);

const Content = tw(MainSize)`my-8`;

export default Layout;
