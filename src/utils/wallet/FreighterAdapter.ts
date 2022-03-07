import freighter from '@stellar/freighter-api';
import { Networks } from 'stellar-base';
import { Adapter, AdapterInterface } from './Adapter';

class FreighterAdapter extends Adapter implements AdapterInterface {
  constructor(network: Networks) {
    super(network);
  }

  async signTransaction(xdr: string) {
    return await freighter.signTransaction(xdr, this.network);
  }

  async publicKey() {
    return await freighter.getPublicKey();
  }
}

export default FreighterAdapter;
