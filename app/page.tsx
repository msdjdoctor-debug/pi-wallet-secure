"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WalletNav } from "@/components/wallet-nav"
import { PiBalanceCard } from "@/components/pi-balance-card"
import { UnifiedBalanceCard } from "@/components/unified-balance-card"
import { QuickActionButtons } from "@/components/quick-action-buttons"
import { TokenList } from "@/components/token-list"
import { RecentTransactions } from "@/components/recent-transactions"
import { BankIntegration } from "@/components/bank-integration"
import { SwapInterface } from "@/components/swap-interface"
import { MultiChainTransfer } from "@/components/multi-chain-transfer"
import { usePiWallet } from "@/lib/hooks/use-pi-wallet"
import { Settings, Bell, Power, LinkIcon } from "lucide-react"

export default function WalletPage() {
  const {
    piBalance,
    tokenBalances,
    transactions,
    isConnected,
    totalBalance,
    totalDTLBalance,
    dtlByChain,
    disconnectPiWallet,
    connectPiWallet,
  } = usePiWallet()
  const [activeTab, setActiveTab] = useState("wallet")

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "swap":
        setActiveTab("swap")
        break
      case "bridge":
        setActiveTab("transfer")
        break
      default:
        console.log(`[v0] Quick action: ${action}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold">π</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Piyra Wallet
                </h1>
                <p className="text-xs text-muted-foreground">Dijital TL + Pi Network</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isConnected && (
                <Button variant="default" size="sm" onClick={connectPiWallet} className="gap-2">
                  <LinkIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Bağlan</span>
                </Button>
              )}
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              {isConnected && (
                <Button variant="outline" size="icon" onClick={disconnectPiWallet}>
                  <Power className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-4">
            <WalletNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {activeTab === "wallet" && (
          <div className="space-y-6">
            {/* Unified Balance Card - Shows total balance and DTL across all chains */}
            <UnifiedBalanceCard totalDTL={totalDTLBalance} dtlByChain={dtlByChain} totalBalance={totalBalance} />

            {/* Quick Actions */}
            <QuickActionButtons onAction={handleQuickAction} />

            {/* Pi Balance Card - Shows Pi dual-value system */}
            <PiBalanceCard balance={piBalance} />

            {/* Token List - All tokens across all chains */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Varlıklar / Assets</h3>
              <TokenList tokens={tokenBalances} />
            </div>

            {/* Recent Transactions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Son İşlemler / Recent Activity</h3>
              <RecentTransactions transactions={transactions} />
            </div>
          </div>
        )}

        {activeTab === "swap" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Token Takası / Swap Tokens</h2>
              <p className="text-muted-foreground">Pi Dex üzerinden token değiştirin</p>
              <p className="text-sm text-muted-foreground">Exchange tokens on Pi Dex</p>
            </div>
            <SwapInterface />
          </div>
        )}

        {activeTab === "bank" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Banka Entegrasyonu / Bank Integration</h2>
              <p className="text-muted-foreground">Türk bankalarını bağlayın ve DTL çekin</p>
              <p className="text-sm text-muted-foreground">Connect Turkish banks and withdraw DTL</p>
            </div>
            <BankIntegration />
          </div>
        )}

        {activeTab === "transfer" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Çapraz Zincir Transfer / Cross-Chain Transfer</h2>
              <p className="text-muted-foreground">Varlıkları tüm blokzincirlere transfer edin</p>
              <p className="text-sm text-muted-foreground">Transfer assets across all blockchains</p>
            </div>
            <MultiChainTransfer />
          </div>
        )}
      </main>
    </div>
  )
}
