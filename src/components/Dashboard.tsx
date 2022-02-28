import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Spinner from './icons/Spinner';

import NFTClaim from './NFTClaim';
import NFTCreate from './NFTCreate';
import NFTList from './NFTList';
import NFTMint from './NFTMint';

const Dashboard = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route index element={<NFTList />} />
        <Route path="create" element={<NFTCreate />} />
        <Route path="mint" element={<NFTMint />} />
        <Route path="claim" element={<NFTClaim />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default Dashboard;
