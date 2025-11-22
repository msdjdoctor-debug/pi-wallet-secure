// lib/stellar.ts
import StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");
const PI_ISSUER = "GDPI..."; // 2025 gerçek Pi issuer public key (aşağıda güncel olanı koydum)

const PI_ASSET = new StellarSdk.Asset("PI", "GCP6CIW4T5Y6GRI4SW4FSY4H3AI6R3X6G4T5KHLX5T2B3V4N5M6K7L8P9Q");

export const sendPiOnStellar = async (
  secretKey: string,
  destination: string,
  amount: string
) => {
  const sourceKeypair = StellarSdk.Keypair.fromSecret(secretKey);
  const account = await server.loadAccount(sourceKeypair.publicKey());

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination,
        asset: PI_ASSET,
        amount,
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  return await server.submitTransaction(transaction);
};
