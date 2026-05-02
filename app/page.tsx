"use client";

import { useState, useEffect } from "react";
import { 
  ConnectionProvider, 
  WalletProvider, 
  useWallet 
} from "@solana/wallet-adapter-react";
import { 
  WalletModalProvider, 
  WalletMultiButton 
} from "@solana/wallet-adapter-react-ui";
import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter 
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ArrowUpDown } from "lucide-react";

const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

function SwapContent() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState("0.0000");

  useEffect(() => {
    if (connected && publicKey) {
      const conn = new Connection(clusterApiUrl("mainnet-beta"));
      conn.getBalance(publicKey).then((res) => {
        setBalance((res / LAMPORTS_PER_SOL).toFixed(4));
      });
    }
  }, [connected, publicKey]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl text-center">
        <h1 className="text-2xl font-bold text-green-400 mb-2">MER SWAP</h1>
        <p className="text-zinc-500 text-sm mb-6">索拉纳代币交换中心</p>
        
        <div className="flex justify-center mb-6">
          <WalletMultiButton className="!bg-white !text-black !rounded-lg !font-medium hover:!bg-zinc-200 transition" />
        </div>

        <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-800 text-left">
          <span className="text-zinc-400 text-xs font-medium">SOL 余额</span>
          <div className="text-3xl font-bold text-white mt-1">{balance}</div>
        </div>
        
        <div className="flex justify-center my-4 text-zinc-500">
          <ArrowUpDown size={20} />
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  const endpoint = clusterApiUrl("mainnet-beta");
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SwapContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
