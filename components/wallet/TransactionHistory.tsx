// components/wallet/TransactionHistory.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "send" | "receive" | "bridge_out" | "bridge_in";
  amount: number;
  symbol: string;
  to?: string;
  from?: string;
  chain?: string;
  status: "completed" | "pending" | "failed";
  timestamp: number;
  txHash?: string;
}

interface TransactionHistoryProps {
  accessToken: string;
  limit?: number;
}

export function TransactionHistory({ accessToken, limit = 10 }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Pi Payments API v2 + Pi Blockchain Explorer entegrasyonu
        const response = await fetch("/api/pi/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken,
            limit,
          }),
        });

        if (!response.ok) throw new Error("İşlem geçmişi alınamadı");

        const data = await response.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error("Transaction fetch error:", err);
        setError("İşlem geçmişi yüklenemedi");
        
        // Demo veri (Mainnet öncesi test için)
        setTransactions([
          {
            id: "tx_1",
            type: "bridge_out",
            amount: 1250,
            symbol: "PI",
            chain: "Ethereum",
            status: "completed",
            timestamp: Date.now() - 5 * 60 * 1000,
            txHash: "0xabc123...xyz789",
          },
          {
            id: "tx_2",
            type: "receive",
            amount: 500,
            symbol: "PI",
            from: "@ahmet_pioneer",
            status: "completed",
            timestamp: Date.now() - 2 * 60 * 60 * 1000,
          },
          {
            id: "tx_3",
            type: "send",
            amount: 300,
            symbol: "PI",
            to: "@elif_tr",
            status: "completed",
            timestamp: Date.now() - 24 * 60 * 60 * 1000,
          },
          {
            id: "tx_4",
            type: "bridge_in",
            amount: 800,
            symbol: "PI",
            chain: "BSC",
            status: "pending",
            timestamp: Date.now() - 10 * 60 * 1000,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchTransactions();
    }
  }, [accessToken, limit]);

  const getTypeInfo = (tx: Transaction) => {
    switch (tx.type) {
      case "send":
        return { icon: ArrowUpRight, color: "text-red-400", label: "Gönderildi" };
      case "receive":
        return { icon: ArrowDownLeft, color: "text-green-400", label: "Alındı" };
      case "bridge_out":
        return { icon: ArrowUpRight, color: "text-orange-400", label: `→ ${tx.chain}` };
      case "bridge_in":
        return { icon: ArrowDownLeft, color: "text-purple-400", label: `${tx.chain} → Pi` };
      default:
        return { icon: Clock, color: "text-gray-400", label: "Bilinmiyor" };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-1 text-green-400 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Tamamlandı</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium">
            <Clock className="w-4 h-4" />
            <span>Bekliyor</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-1 text-red-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>Başarısız</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <Clock className="w-12 h-12" />
        </div>
        <p className="text-lg font-medium">Henüz işlem yok</p>
        <p className="text-sm mt-2">İlk transferini yaparak başla!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => {
        const { icon: Icon, color, label } = getTypeInfo(tx);

        return (
          <div
            key={tx.id}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-xl bg-white/10 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white truncate">{label}</p>
                    {tx.to && <span className="text-gray-500 text-sm truncate">→ @{tx.to}</span>}
                    {tx.from && <span className="text-gray-500 text-sm truncate">← @{tx.from}</span>}
                  </div>

                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-2xl font-bold text-white">
                      {tx.type === "send" || tx.type === "bridge_out" ? "-" : "+"}
                      {tx.amount.toLocaleString("tr-TR")}
                      <span className="text-lg text-yellow-400 ml-1">π</span>
                    </p>
                    {getStatusBadge(tx.status)}
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {format(tx.timestamp, "d MMMM yyyy, HH:mm", { locale: tr })}
                  </p>
                </div>
              </div>

              {tx.txHash && (
                <a
                  href={`https://pi-blockchain.com/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-3"
                >
                  <ExternalLink className="w-5 h-5 text-gray-500 hover:text-yellow-400" />
                </a>
              )}
            </div>
          </div>
        );
      })}

      {transactions.length >= limit && (
        <div className="text-center pt-4">
          <button className="text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors">
            Daha fazla göster →
          </button>
        </div>
      )}
    </div>
  );
}
