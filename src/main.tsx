import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GlobalStyles } from 'twin.macro';
import '@fontsource/ibm-plex-sans';

import './utils/polyfills';

import './index.css';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

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
