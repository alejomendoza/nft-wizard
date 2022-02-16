import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GlobalStyles } from 'twin.macro';

import './utils/polyfills';

import './index.css';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.render(
  <RecoilRoot>
    <GlobalStyles />
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </RecoilRoot>,
  document.getElementById('root')
);
