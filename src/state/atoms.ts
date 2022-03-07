import { atom, DefaultValue, selector } from 'recoil';
import { Networks } from 'stellar-base';

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const storageEventHandler = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setSelf(event.newValue);
      }
    };

    window.addEventListener('storage', storageEventHandler);

    const savedValue = localStorage.getItem(key);
    if (
      savedValue !== null &&
      savedValue !== undefined &&
      savedValue !== 'null' &&
      savedValue !== 'undefined'
    ) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue: any) => {
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    });

    return () => {
      window.removeEventListener('storage', storageEventHandler);
    };
  };

export const walletAtom = atom<{
  publicKey: string;
  network: Networks;
  selectedWallet?: 'albedo' | 'freighter';
}>({
  key: 'wallet',
  default: { publicKey: '', network: Networks.TESTNET },
  effects_UNSTABLE: [localStorageEffect('nw:wallet')],
});

export const darkModeAtom = atom<boolean>({ key: 'darkMode', default: false });
