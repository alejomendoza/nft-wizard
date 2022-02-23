import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Login';
import CreateNFT from 'src/components/CreateNFT';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MintNFT from './components/MintNFT';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<CreateNFT />} />
          <Route path="mint" element={<MintNFT />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
      <ToastContainer autoClose={10000} />
      <ReactQueryDevtools />
    </div>
  );
}

export default App;
