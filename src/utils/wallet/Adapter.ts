import { Networks } from 'stellar-base';

export interface AdapterInterface {
  _network: Networks;
  network: 'PUBLIC' | 'TESTNET';
  signTransaction(xdr: string): Promise<string>;
  publicKey(): Promise<string>;
}

export class Adapter {
  _network: Networks;

  constructor(network: Networks) {
    this._network = network;
  }

  get network() {
    return this._network === Networks.PUBLIC ? 'PUBLIC' : 'TESTNET';
  }
}
