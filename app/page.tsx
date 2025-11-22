// app/page.tsx
import { PiConnectButton } from "@/components/wallet/PiConnectButton";
import { BalanceCard } from "@/components/wallet/BalanceCard";
import { CrossChainTransfer } from "@/components/wallet/CrossChainTransfer";
import { useState } from "react";
import { PiAuthResult } from "@/lib/pi-sdk";

export default function Home() {
  const [auth, setAuth] = useState<PiAuthResult | null>(null);

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Pi Network Cross-Chain Wallet
        </h1>

        <div className="flex justify-center">
          <PiConnectButton onConnect={(a) => setAuth(a)} />
        </div>

        {auth && (
          <>
            <BalanceCard accessToken={auth.accessToken} />
            <CrossChainTransfer />
          </>
        )}
      </div>
    </main>
  );
}
