import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'react-toastify/dist/ReactToastify.css';

import Login from 'src/components/Login';
import Dashboard from 'src/components/Dashboard';
import Layout from 'src/components/Layout';
import useWallet from './hooks/useWallet';

function App() {
  const { publicKey } = useWallet();

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

      {/* <ReactQueryDevtools /> */}
    </div>
  );
}

export default App;
