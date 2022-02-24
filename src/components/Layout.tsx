import { Suspense } from 'react';
import { NavLink as Link, Outlet } from 'react-router-dom';
import tw, { styled } from 'twin.macro';

import Spinner from './icons/Spinner';

const Layout = () => {
  return (
    <>
      <MainLayout>
        <NavBar>
          <NavMenu>
            <NavMenuTab>
              <NavLink to="/">NFTs</NavLink>
            </NavMenuTab>
            <NavMenuTab>
              <NavLink to="/create">Create</NavLink>
            </NavMenuTab>
            <NavMenuTab>
              <NavLink to="/mint">Mint</NavLink>
            </NavMenuTab>
            <NavMenuTab>
              <NavLink to="/claim">Claim</NavLink>
            </NavMenuTab>
          </NavMenu>
        </NavBar>

        <Content>
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </Content>
      </MainLayout>
    </>
  );
};

const MainLayout = tw.div`min-h-screen`;

const NavBar = tw.nav`sticky top-0 z-10 bg-white`;
const NavMenu = tw.ul`max-w-2xl mx-auto flex justify-between items-center`;
const NavMenuTab = tw.li`flex-1 text-center`;

const NavLink = styled(Link).attrs({
  style: ({ isActive }) =>
    isActive ? { ...tw`font-bold border-b-2 border-blue` } : {},
})(tw`block inset-0 p-4`);

const Content = tw.div`mx-auto max-w-2xl my-8`;

export default Layout;
