import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import './utils/polyfills';

const queryClient = new QueryClient();

ReactDOM.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </RecoilRoot>,
  document.getElementById('root')
);
