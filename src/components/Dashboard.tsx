import { Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import NFTClaim from './NFTClaim';
import NFTCreate from './NFTCreate';
import NFTList from './NFTList';
import NFTMint from './NFTMint';

const Dashboard = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<NFTList />} />
        <Route path="create" element={<NFTCreate />} />
        <Route path="mint" element={<NFTMint />} />
        <Route path="claim" element={<NFTClaim />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;
