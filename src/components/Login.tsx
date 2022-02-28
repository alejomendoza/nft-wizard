import { Navigate, Route, Routes } from 'react-router-dom';
import 'twin.macro';

import Wallet from './Wallet';

function Login() {
  return (
    <Routes>
      <Route index element={<Wallet />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Login;
