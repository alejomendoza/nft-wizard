import { ToastContainer } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'react-toastify/dist/ReactToastify.css';

import { userAtom } from './state/atoms';

import Login from 'src/components/Login';
import Dashboard from 'src/components/Dashboard';

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <div>
      {user ? <Dashboard /> : <Login />}

      <ToastContainer autoClose={10000} />
      <ReactQueryDevtools />
    </div>
  );
}

export default App;
