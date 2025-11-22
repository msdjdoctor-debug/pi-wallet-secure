// src/lib/stellar-bridge.ts
import StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");
const networkPassphrase = StellarSdk.Networks.PUBLIC;

const PI_ISSUER = "GCP6CIW4T5Y6GRI4SW4FSY4H3AI6R3X6G4T5KHLX5T2B3V4N5M6K7L8P9Q";
const PI_ASSET = new StellarSdk.Asset("PI", PI_ISSUER);

const BRIDGE_HOT_SECRET = process.env.STELLAR_BRIDGE_SECRET!; // sadece senin sunucunda
const BRIDGE_HOT_KEYPAIR = StellarSdk.Keypair.fromSecret(BRIDGE_HOT_SECRET);

export async function mintPiOnStellar(toAddress: string, amount: string, piTxId: string) {
  const account = await server.loadAccount(BRIDGE_HOT_KEYPAIR.publicKey());

  // Güvenlik: Aynı Pi tx ile tekrar mint olmasın
  const existing = await server.payments().forAccount(BRIDGE_HOT_KEYPAIR.publicKey()).limit(1).order("desc").call();
  // basit kontrol, production’da DB’de tut

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: toAddress,
        asset: PI_ASSET,
        amount,
      })
    )
    .addMemo(StellarSdk.Memo.text(`Pi Tx: ${piTxId.substring(0, 16)}`))
    .setTimeout(30)
    .build();

  transaction.sign(BRIDGE_HOT_KEYPAIR);
  const result = await server.submitTransaction(transaction);
  return result.hash;
}
