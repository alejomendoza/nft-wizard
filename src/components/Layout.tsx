import { NavLink as Link, Outlet } from 'react-router-dom';
import tw, { styled } from 'twin.macro';

const Layout = () => {
  return (
    <>
      <MainLayout>
        <NavBar>
          <NavMenu>
            <NavMenuTab>
              <NavLink to="/">List</NavLink>
            </NavMenuTab>
            <NavMenuTab>
              <NavLink to="/create">Create</NavLink>
            </NavMenuTab>
          </NavMenu>
        </NavBar>

        <Content>
          <Outlet />
        </Content>
      </MainLayout>
    </>
  );
};

const MainLayout = tw.div`min-h-screen`;

const NavBar = tw.nav`sticky top-0 z-10`;
const NavMenu = tw.ul`max-w-2xl mx-auto flex justify-between items-center`;
const NavMenuTab = tw.li`flex-1 text-center`;

const NavLink = styled(Link).attrs({
  style: ({ isActive }) =>
    isActive ? { ...tw`font-bold border-b-2 border-blue` } : {},
})(tw`block inset-0 p-4`);

const Content = tw.div`mx-auto max-w-2xl my-8`;

export default Layout;
