import { useCallback, useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import { walletAtom } from 'src/state/atoms';
import { WalletAdapters } from 'src/types';
import { AdapterInterface } from 'src/utils/wallet/Adapter';
import AlbedoAdapter from 'src/utils/wallet/AlbedoAdapter';
import FreighterAdapter from 'src/utils/wallet/FreighterAdapter';

let walletAdapters: WalletAdapters;
let selectedAdapter: AdapterInterface;

const useWallet = (wallet?: keyof WalletAdapters) => {
  const [{ publicKey, network, selectedWallet }, setWallet] =
    useRecoilState(walletAtom);

  const resetWallet = useResetRecoilState(walletAtom);

  useEffect(() => {
    walletAdapters = {
      albedo: new AlbedoAdapter(network),
      freighter: new FreighterAdapter(network),
    };

    if (selectedWallet) selectedAdapter = walletAdapters[selectedWallet];
  }, [network]);

  const login = async () => {
    if (wallet) {
      selectedAdapter = walletAdapters[wallet];
      const publicKey = await selectedAdapter.publicKey();

      setWallet((oldState) => ({
        ...oldState,
        selectedWallet: wallet,
        publicKey,
      }));
    }
  };

  const signTransaction = async (xdr: string) => {
    if (selectedAdapter) return selectedAdapter.signTransaction(xdr);
    throw 'User is not logged in.';
  };

  return {
    login,
    signTransaction,
    logout: resetWallet,
    publicKey,
  };
};

export default useWallet;
