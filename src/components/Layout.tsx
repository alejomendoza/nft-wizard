import { NavLink as Link, Outlet } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import tw, { styled } from 'twin.macro';
import { FaSun, FaMoon } from 'react-icons/fa';

import { darkModeAtom, walletAtom } from 'src/state/atoms';

import StellarLogoFull from './icons/StellarLogoFull';
import { WalletMenu } from './Wallet';

const Layout = () => {
  const [isDarkMode, setIsDarkMode] = useRecoilState(darkModeAtom);

  return (
    <MainLayout>
      <Header>
        <HeaderContent>
          <div tw="flex items-center gap-2 text-xl">
            <StellarLogoFull />
            <div tw="border-l h-full border-current" />
            <p>nw</p>
          </div>
          <div tw="flex items-center gap-4 all-child:h-full">
            <WalletMenu />
            <button
              tw="rounded-full border border-current p-2"
              onClick={() => setIsDarkMode((oldState) => !oldState)}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
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

const MainLayout = tw.div`min-h-screen transition-colors dark:(bg-background text-white)`;
const MainSize = tw.div`max-w-4xl mx-auto`;

const Header = tw.header`py-8`;
const HeaderContent = tw(MainSize)`flex justify-between`;

const NavBar = tw.nav`sticky top-0 z-10 border-t border-b border-black/5 bg-black/5 shadow-sm`;
const NavMenu = tw(MainSize)`gap-2 py-4 flex justify-between`;

const NavLink = styled(Link).attrs({
  style: ({ isActive }) =>
    isActive ? tw`text-stellar-violet bg-black/20` : {},
})(
  tw`block rounded flex-1 text-center p-2 transition-colors bg-black/0 hover:bg-black/10 dark:(text-white)!`
);

const Content = tw(MainSize)`my-16`;

export default Layout;
