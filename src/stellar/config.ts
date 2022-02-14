import { Networks } from 'stellar-base';

export function getConfig() {
  switch (import.meta.env.VITE_STELLAR_NETWORK) {
    case 'testnet':
      return {
        network: 'testnet',
        networkPassphrase: Networks['TESTNET'],
        horizonUrl: 'https://horizon-testnet.stellar.org',
        ipfsUrl: (cid: string) => `https://ipfs.io/ipfs/${cid}`,
        explorerAssetUrl: (code: string, issuer: string) =>
          `https://stellar.expert/explorer/testnet/asset/${code}-${issuer}`,
        explorerAssetHoldersUrl: (code: string, issuer: string) =>
          `https://stellar.expert/explorer/testnet/asset/${code}-${issuer}?filter=asset-holders`,
        dexAssetUrl: (code: string, issuer: string) =>
          `https://stellarterm.com/exchange/${code}-${issuer}/XLM-native/testnet`,
      };
    default:
      return {
        network: 'pubnet',
        networkPassphrase: Networks['PUBLIC'],
        horizonUrl: 'https://horizon.stellar.org',
        ipfsUrl: (cid: string) => `https://ipfs.io/ipfs/${cid}`,
        explorerAssetUrl: (code: string, issuer: string) =>
          `https://stellar.expert/explorer/public/asset/${code}-${issuer}`,
        explorerAssetHoldersUrl: (code: string, issuer: string) =>
          `https://stellar.expert/explorer/public/asset/${code}-${issuer}?filter=asset-holders`,
        dexAssetUrl: (code: string, issuer: string) =>
          `https://stellarterm.com/exchange/${code}-${issuer}/XLM-native`,
      };
  }
}

export async function getAccount(publicKey: string) {
  let account = await fetch(
    `${getConfig().horizonUrl}/accounts/${publicKey}`
  ).then(({ data }: any) => data);
  return account;
}
