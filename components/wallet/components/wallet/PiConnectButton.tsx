// components/wallet/PiConnectButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { connectPiWallet, PiUser } from "@/lib/pi-sdk";
import { Wallet } from "lucide-react";

export function PiConnectButton() {
  const [user, setUser] = useState<PiUser | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      {
      const auth = await connectPiWallet();
      setUser(auth.user);
    } catch (err) {
      alert("Pi ile bağlanılamadı. Pi Browser kullanıyor musun?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={loading}
      size="lg"
      className="gap-3"
      variant={user ? "success" : "primary"}
    >
      <Wallet className="w-5 h-5" />
      {loading ? "Bağlanıyor..." : user ? `Merhaba ${user.username} (Connected)` : "Pi ile Bağlan"}
    </Button>
  );
}
