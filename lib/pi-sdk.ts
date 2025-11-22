// lib/pi-sdk.ts
import axios from "axios";

declare global {
  interface Window {
    Pi: any;
  }
}

export type PiUser = {
  uid: string;
  username: string;
};

export type PiAuthResult = {
  accessToken: string;
  user: PiUser;
};

let cachedAuth: PiAuthResult | null = null;

export const connectPiWallet = async (): Promise<PiAuthResult> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.Pi) {
      return reject(new Error("Pi Browser'da açılmalı"));
    }

    window.Pi.authenticate(
      ["username", "payments"],
      async (auth: PiAuthResult) => {
        cachedAuth = auth;
        resolve(auth);
      }
    ).catch((err: any) => reject(err));
  });
};

export const getPiBalance = async (accessToken: string): Promise<number> => {
  // 2025 itibariyle Pi Mainnet açık, bu endpoint çalışıyor
  const res = await axios.get("https://api.minepi.com/v2/me/balance", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data.balance;
};

// Server-side payment tamamlamak için (güvenlik için)
export const completePiPayment = async (paymentId: string, txid: string) => {
  await axios.post(
    `https://api.minepi.com/v2/payments/${paymentId}/complete`,
    { txid },
    { headers: { Authorization: `Key ${process.env.PI_API_KEY}` } }
  );
};
