import { toast } from 'react-toastify';

export const isDev = import.meta.env.VITE_WEB_ENV !== 'production';
export const baseUrl = isDev
  ? 'https://horizon-testnet.stellar.org'
  : 'https://horizon.stellar.org';

export async function handleResponse(response: Response) {
  const { headers, ok } = response;
  const contentType = headers.get('content-type');

  const content = contentType
    ? contentType.includes('json')
      ? response.json()
      : response.text()
    : { status: response.status, message: response.statusText };

  if (ok) return content;
  else throw await content;
}

export const parseError = (error: any) => {
  if (error instanceof Error) error = error.toString();

  return {
    ...(typeof error === 'string' ? { message: error } : error),
    action:
      '<a href="https://developers.stellar.org/docs" target="_blank" rel="noopener">Get help from the Stellar Docs</a>',
  };
};

export const parseAndToast = (err: any) => {
  console.log(err);
  const error = parseError(err);
  toast.error(error.message, {
    position: toast.POSITION.TOP_RIGHT,
  });
};
