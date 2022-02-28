import { Navigate, Route, Routes } from 'react-router-dom';
import 'twin.macro';

import { ConnectWallets } from './Wallet';

function Login() {
  return (
    <Routes>
      <Route index element={<ConnectWallets />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Login;
