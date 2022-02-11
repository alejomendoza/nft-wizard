import { baseUrl, handleResponse } from './utils';

export const defaultQueryOptions = {
  retry: false,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
};

export const loginUser = (publicKey: string): Promise<any> => {
  return fetch(`${baseUrl}/accounts/${publicKey}`, {
    method: 'GET',
  }).then(handleResponse);
};
