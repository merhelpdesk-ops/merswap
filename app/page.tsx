"use client";

import { useState, useEffect, useCallback } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ArrowDown, Settings2, RefreshCw, Loader2 } from "lucide-react";

const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

function SwapUI() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState("0.00");
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);

  // 1. 获取钱包 SOL 余额
  useEffect(() => {
    if (connected && publicKey) {
      const conn = new Connection(clusterApiUrl("mainnet-beta"));
      conn.getBalance(publicKey).then((res) => {
        setBalance((res / LAMPORTS_PER_SOL).toFixed(4));
      });
    }
  }, [connected, publicKey]);

  // 2. 调用 Jupiter API 获取真实报价
  const fetchQuote = useCallback(async (amount: string) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setReceiveAmount("0.00");
      return;
    }

    setIsLoading(true);
    try {
      const inputMint = "So11111111111111111111111111111111111111112"; // SOL
      const outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
      const lamports = Number(amount) * LAMPORTS_PER_SOL;

      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${Math.floor(lamports)}&slippageBps=50`
      );
      const quote = await response.json();

      if (quote && quote.outAmount) {
        const outAmountFull = Number(quote.outAmount) / 1_000_000;
        setReceiveAmount(outAmountFull.toFixed(2));
      }
    } catch (error) {
      console.error("报价获取失败:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (val: string) => {
    setPayAmount(val);
    const timeoutId = setTimeout(() => fetchQuote(val), 500);
    return () => clearTimeout(timeoutId);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-4 font-sans text-white">
      <div className="w-full max-w-md rounded-[24px] border border-zinc-800 bg-[#121212] p-4 shadow-2xl">
        
        <div className="flex items-center justify-between px-2 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-green-400">MER SWAP</h2>
          <div className="flex gap-3 text-zinc-400">
            <RefreshCw 
              size={18} 
              className={`cursor-pointer hover:text-white ${isLoading ? 'animate-spin' : ''}`}
              onClick={() => fetchQuote(payAmount)}
            />
            <Settings2 size={18} className="cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* 支付区块 */}
        <div className="rounded-2xl bg-[#1c1c1c] p-4 transition hover:ring-1 hover:ring-zinc-700">
          <div className="flex justify-between text-xs text-zinc-400 mb-2">
            <span>你支付</span>
            <span>余额: {balance} SOL</span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="number"
              placeholder="0.00"
              className="w-full bg-transparent text-3xl font-medium outline-none"
              value={payAmount}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <button className="flex items-center gap-2 rounded-full bg-[#2d2d2d] px-3 py-1 text-sm font-bold">
              SOL
            </button>
          </div>
        </div>

        <div className="relative -my-3 flex justify-center z-10">
          <div className="rounded-xl border-4 border-[#121212] bg-[#1c1c1c] p-2">
            {isLoading ? <Loader2 size={18} className="animate-spin text-green-400" /> : <ArrowDown size={18} />}
          </div>
        </div>

        {/* 接收区块 */}
        <div className="rounded-2xl bg-[#1c1c1c] p-4 transition hover:ring-1 hover:ring-zinc-700">
          <div className="flex justify-between text-xs text-zinc-400 mb-2">
            <span>你收到 (预计)</span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              readOnly
              placeholder="0.00"
              className="w-full bg-transparent text-3xl font-medium outline-none text-zinc-300"
              value={receiveAmount}
            />
            <button className="flex items-center gap-2 rounded-full bg-[#2d2d2d] px-3 py-1 text-sm font-bold">
              USDC
            </button>
          </div>
        </div>

        {/* 核心按钮 */}
        <div className="mt-4">
          {!connected ? (
            <div className="flex justify-center w-full bg-white rounded-2xl overflow-hidden">
                <WalletMultiButton className="!w-full !bg-white !text-black !rounded-2xl !h-14 !font-bold !border-none" />
            </div>
          ) : (
            <button 
              className="w-full rounded-2xl bg-green-500 py-4 text-lg font-bold text-black transition hover:bg-green-400 disabled:bg-zinc-800 disabled:text-zinc-500"
              disabled={!payAmount || isLoading}
              onClick={() => alert('价格已锁定！')}
            >
              {isLoading ? "正在获取价格..." : "立即交换"}
            </button>
          )}
        </div>
      </div>
      <p className="mt-6 text-[10px] text-zinc-600 text-center uppercase tracking-widest">Live Price via Jupiter API</p>
    </main>
  );
}

export default function Home() {
  const endpoint = clusterApiUrl("mainnet-beta");
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SwapUI />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
