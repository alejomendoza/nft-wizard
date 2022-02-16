import {
  TransactionBuilder,
  Memo,
  Operation,
  Account,
  BASE_FEE,
} from 'stellar-base';
import { getConfig, getAccount } from './config';

export async function createNFT(
  source: string,
  issuer: string,
  assetCode: string,
  domain: string,
  cid: string
) {
  const account = await (async () => {
    try {
      return await getAccount(source);
    } catch {
      throw new Error(
        `Your account ${issuer} does not exist on the Stellar ${
          getConfig().network
        } network. It must be created before it can be used to submit transactions.`
      );
    }
  })();

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
        signer: { ed25519PublicKey: account.id, weight: 1 },
      })
    );

  txBuilder.addMemo(Memo.text(`Create ${assetCode} NFT ✨`));
  const tx = txBuilder.setTimeout(300).build();

  return tx.toXDR();
}

export const mintNFT = (
  source: string,
  issuer: string,
  assetCode: string
) => {};
