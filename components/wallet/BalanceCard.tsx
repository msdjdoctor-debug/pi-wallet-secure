// components/wallet/BalanceCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getPiBalance } from "@/lib/pi-sdk";

export function BalanceCard({ accessToken }: { accessToken: string }) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (accessToken) {
      getPiBalance(accessToken).then(setBalance).catch(console.error);
    }
  }, [accessToken]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pi Bakiyen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-primary">
          {balance !== null ? `${balance.toFixed(2)} Pi` : "Yükleniyor..."}
        </div>
      </CardContent>
    </Card>
  );
}
