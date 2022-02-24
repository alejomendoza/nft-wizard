import { baseUrl, handleResponse } from '.';

export const loginUser = (publicKey: string): Promise<any> => {
  return fetch(`${baseUrl}/accounts/${publicKey}`, {
    method: 'GET',
  }).then(handleResponse);
};
