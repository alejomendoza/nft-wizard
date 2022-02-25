import { getMetadata, handleResponse } from 'src/utils';
import {
  TransactionBuilder,
  Memo,
  Operation,
  Account,
  BASE_FEE,
  Claimant,
  Asset,
  Keypair,
} from 'stellar-base';
import { getConfig } from './config';

export const submitTransaction = async (xdr: string) => {
  const body = new FormData();
  body.append('tx', xdr);

  return await fetch(getConfig().horizonUrl + '/transactions', {
    method: 'POST',
    body,
  }).then(handleResponse);
};

export const getAccount = async (publicKey: string) => {
  return await fetch(
    getConfig().horizonUrl + `/accounts/?sponsor=${publicKey}`
  ).then(handleResponse);
};

export const getSponsoredAccounts = async (sponsor: string) => {
  return await fetch(
    getConfig().horizonUrl + `/accounts/?sponsor=${sponsor}`
  ).then(handleResponse);
};

export const getSponsoredClaimableBalances = async (
  sponsor: string,
  claimant: string
) => {
  return await fetch(
    getConfig().horizonUrl +
      `/claimable_balances/?sponsor=${sponsor}&claimant=${claimant}`
  ).then(handleResponse);
};

export async function createNFT(
  source: string,
  issuerKeypair: Keypair,
  assetCode: string,
  domain: string,
  cid: string
) {
  const issuer = issuerKeypair.publicKey();

  const account = await getAccount(source).catch(() => {
    throw new Error(
      `Your account ${issuer} does not exist on the Stellar ${
        getConfig().network
      } network. It must be created before it can be used to submit transactions.`
    );
  });

  const txBuilder = new TransactionBuilder(
    new Account(account.id, account.sequence),
    {
      fee: BASE_FEE,
      networkPassphrase: getConfig().networkPassphrase,
    }
  );

  txBuilder
    .addOperation(
      Operation.beginSponsoringFutureReserves({
        sponsoredId: issuer,
      })
    )
    .addOperation(
      Operation.createAccount({
        destination: issuer,
        startingBalance: '0',
      })
    )
    .addOperation(
      Operation.manageData({
        source: issuer,
        name: `ipfshash`,
        value: cid,
      })
    )
    .addOperation(
      Operation.setOptions({
        source: issuer,
        signer: { ed25519PublicKey: account.id, weight: 1 },
      })
    )
    .addOperation(
      Operation.endSponsoringFutureReserves({
        source: issuer,
      })
    )
    .addOperation(
      Operation.setOptions({
        source: issuer,
        // @ts-ignore
        setFlags: 11,
        masterWeight: 0,
        lowThreshold: 0,
        medThreshold: 0,
        highThreshold: 0,
        homeDomain: domain,
      })
    );

  txBuilder.addMemo(Memo.text(`Create ${assetCode} NFT ✨`));
  const tx = txBuilder.setTimeout(300).build();
  tx.sign(issuerKeypair);

  return tx.toXDR();
}

export const mintNFT = async (
  sponsor: string,
  issuer: string,
  ipfshash: string,
  destination: string
) => {
  const account = await getAccount(sponsor).catch(() => {
    throw new Error(
      `Your account ${sponsor} does not exist on the Stellar ${
        getConfig().network
      } network. It must be created before it can be used to submit transactions.`
    );
  });

  const ipfsMetadata = await getMetadata(ipfshash);

  const asset = new Asset(ipfsMetadata.code, issuer);

  const txBuilder = new TransactionBuilder(
    new Account(account.id, account.sequence),
    {
      fee: BASE_FEE,
      networkPassphrase: getConfig().networkPassphrase,
    }
  );

  const claimants = [
    new Claimant(destination, Claimant.predicateUnconditional()),
  ];

  txBuilder
    .addOperation(
      Operation.beginSponsoringFutureReserves({
        sponsoredId: issuer,
      })
    )
    .addOperation(
      Operation.createClaimableBalance({
        claimants,
        asset,
        amount: '0.0000001',
        source: issuer,
      })
    )
    .addOperation(Operation.endSponsoringFutureReserves({ source: issuer }));

  txBuilder.addMemo(Memo.text(`Mint NFT ✨`));

  const tx = txBuilder.setTimeout(300).build();

  return tx.toXDR();
};
