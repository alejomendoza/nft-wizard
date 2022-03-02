import { NavLink as Link, Outlet } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import tw, { styled } from 'twin.macro';
import { FaSun, FaMoon } from 'react-icons/fa';

import { darkModeAtom, walletAtom } from 'src/state/atoms';

import StellarLogoFull from './icons/StellarLogoFull';
import { WalletMenu } from './Wallet';
import Footer from './Footer';

const Layout = () => {
  const [isDarkMode, setIsDarkMode] = useRecoilState(darkModeAtom);

  return (
    <>
      <MainLayout>
        <Header>
          <HeaderContent>
            <div tw="flex items-center gap-4 text-xl">
              <StellarLogoFull tw="sibling:(hidden sm:block)" />
              <div tw="border-l h-full border-gray-300" />
              <p>NFT Wizard</p>
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

      <Footer />
    </>
  );
};

const Nav = () => {
  const { publicKey } = useRecoilValue(walletAtom);

  if (!publicKey) return null;

  return (
    <NavBar>
      <NavMenu tw="py-4 gap-2">
        <NavLink to="/">NFTs</NavLink>
        <NavLink to="/upload">Upload</NavLink>
        <NavLink to="/mint">Mint</NavLink>
        <NavLink to="/claim">Claim</NavLink>
      </NavMenu>
    </NavBar>
  );
};

const MainLayout = tw.div`min-h-screen transition-colors`;
const MainSize = tw.div`max-w-4xl mx-auto px-4`;

const Header = tw.header`py-8`;
const HeaderContent = tw(MainSize)`flex flex-wrap justify-between gap-4`;

const NavBar = tw.nav`sticky top-0 z-10 border border-background-tertiary bg-background-secondary shadow-sm`;
const NavMenu = tw(MainSize)`gap-2 py-4 flex justify-between`;

const NavLink = styled(Link).attrs({
  style: ({ isActive }) => (isActive ? tw`bg-black/10` : {}),
})(
  tw`block rounded-sm flex-1 text-center p-2 transition-colors bg-black/0 hover:bg-black/10`
);

const Content = tw(MainSize)`py-8`;

export default Layout;
