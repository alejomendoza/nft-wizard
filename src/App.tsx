import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Login from './Login';
import Mint from 'src/Mint';

function App() {
  return (
    <div className="max-w-md mx-auto">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="mint" element={<Mint />} />
      </Routes>
      <ToastContainer autoClose={10000} />
    </div>
  );
}

export default App;
