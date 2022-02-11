import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Login from './Login';
import Mint from './Mint';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="mint" element={<Mint />} />
      </Routes>
      <ToastContainer autoClose={10000} />
    </div>
  );
}

export default App;
