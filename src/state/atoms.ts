import { atom, RecoilState, DefaultValue, selector } from 'recoil';
import { User } from 'src/types';

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

export const loadingUserAtom = atom({
  key: 'loading_user',
  default: false,
}) as RecoilState<boolean>;

export const userAtom = atom({
  key: 'user',
  default: null,
  effects_UNSTABLE: [localStorageEffect('nu:current_user')],
}) as RecoilState<null | User>;

export const uploadingErrorAtom = atom({
  key: 'uploading_error',
  default: '',
}) as RecoilState<string>;

export const fileAtom = atom<{
  isUploaded: boolean;
  file: File | null;
  cid: string;
  hash: string;
}>({
  key: 'file',
  default: { isUploaded: false, file: null, cid: '', hash: '' },
});

export const fileHash = selector({ key: 'fileHash', get: ({ get }) => {} });
