import albedo from '@albedo-link/intent';
import { useNavigate } from 'react-router';
import { useSetRecoilState } from 'recoil';

import { userAtom } from 'src/state/atoms';
import 'twin.macro';

import Button from './elements/Button';

const Wallet = () => {
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const openAlbedoAuth = () => {
    albedo.publicKey({}).then((result) => {
      setUser({ account_id: result.pubkey });
      navigate('/mint');
    });
  };

  return (
    <Button tw="w-full" onClick={() => openAlbedoAuth()}>
      Albedo
    </Button>
  );
};

export default Wallet;
