import { useCallback, useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import { walletAtom } from 'src/state/atoms';
import { AdapterInterface } from 'src/utils/wallet/Adapter';
import AlbedoAdapter from 'src/utils/wallet/AlbedoAdapter';
import FreighterAdapter from 'src/utils/wallet/FreighterAdapter';

type WalletHandlers = { albedo: AlbedoAdapter; freighter: FreighterAdapter };

let walletHandlers: WalletHandlers;
let walletAdapter: AdapterInterface;

const useWallet = (wallet?: keyof WalletHandlers) => {
  const [{ publicKey, network, selectedWallet }, setWallet] =
    useRecoilState(walletAtom);

  const resetWallet = useResetRecoilState(walletAtom);

  useEffect(() => {
    walletHandlers = {
      albedo: new AlbedoAdapter(network),
      freighter: new FreighterAdapter(network),
    };

    if (selectedWallet) walletAdapter = walletHandlers[selectedWallet];
  }, [network]);

  const login = useCallback(async () => {
    if (wallet) {
      walletAdapter = walletHandlers[wallet];
      const publicKey = await walletAdapter.publicKey();

      setWallet((oldState) => ({
        ...oldState,
        selectedWallet: wallet,
        publicKey,
      }));
    }
  }, []);

  const signTransaction = useCallback(
    (xdr) => {
      if (walletAdapter) return walletAdapter.signTransaction(xdr);
      throw 'User is not logged in.';
    },
    [wallet]
  );

  return {
    login,
    signTransaction,
    logout: resetWallet,
    publicKey,
  };
};

export default useWallet;
