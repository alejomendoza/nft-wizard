import albedo from '@albedo-link/intent';
import { Networks } from 'stellar-base';
import { Adapter, AdapterInterface } from './Adapter';

class AlbedoAdapter extends Adapter implements AdapterInterface {
  constructor(network: Networks) {
    super(network);
  }

  async signTransaction(xdr: string) {
    return await albedo
      .tx({ xdr, network: this.network })
      .then((result) => result.signed_envelope_xdr);
  }

  async publicKey() {
    return await albedo.publicKey({}).then((result) => result.pubkey);
  }
}

export default AlbedoAdapter;
