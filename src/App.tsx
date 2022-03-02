import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'react-toastify/dist/ReactToastify.css';

import { walletAtom } from './state/atoms';

import Login from 'src/components/Login';
import Dashboard from 'src/components/Dashboard';
import Layout from 'src/components/Layout';

function App() {
  const { publicKey } = useRecoilValue(walletAtom);

  return (
    <div>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/*" element={publicKey ? <Dashboard /> : <Login />} />
        </Route>
      </Routes>

      <ToastContainer
        autoClose={4000}
        position="bottom-right"
        pauseOnHover={false}
        theme="colored"
      />
      <ReactQueryDevtools />
    </div>
  );
}

export default App;
