// components/wallet/CrossChainTransfer.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { sendPiOnStellar } from "@/lib/stellar";

export function CrossChainTransfer() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("stellar");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!to || !amount) return alert("Tüm alanları doldur");

    setLoading(true);
    try {
      if (network === "stellar") {
        // Kullanıcıdan secret key alınmalı (MetaMask benzeri popup ile)
        const secret = prompt("Stellar secret key'inizi girin (sadece test için!):");
        if (!secret) return;

        await sendPiOnStellar(secret, to, amount);
        alert("Pi Stellar ağına gönderildi!");
      }
      // BSC / ETH için ethers + PiBridge eklenebilir
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-card rounded-xl border">
      <h3 className="text-xl font-semibold">Cross-Chain Transfer</h3>
      <Input placeholder="Hedef adres (Stellar G...)" value={to} onChange={(e) => setTo(e.target.value)} />
      <Input placeholder="Miktar" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Select value={network} onValueChange={setNetwork}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="stellar">Stellar Network (Native)</SelectItem>
          <SelectItem value="bsc">BSC (PiBridge)</SelectItem>
          <SelectItem value="eth">Ethereum (Wormhole)</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSend} disabled={loading} className="w-full" variant="accent">
        {loading ? "Gönderiliyor..." : "Cross-Chain Gönder"}
      </Button>
    </div>
  );
}
