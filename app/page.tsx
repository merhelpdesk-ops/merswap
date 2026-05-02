"use client";

import { useState, useEffect } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const wallets = [new PhantomWalletAdapter()];

function SwapUI() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState("0.00");
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("0.00");

  useEffect(() => {
    if (connected && publicKey) {
      const conn = new Connection(clusterApiUrl("mainnet-beta"));
      conn.getBalance(publicKey).then((res) => {
        setBalance((res / LAMPORTS_PER_SOL).toFixed(4));
      });
    }
  }, [connected, publicKey]);

  const handleInputChange = async (val: string) => {
    setPayAmount(val);
    if (!val || isNaN(Number(val)) || Number(val) <= 0) {
      setReceiveAmount("0.00");
      return;
    }
    try {
      const lamports = Number(val) * 1000000000;
      
      // 使用最新可用的 API 接口获取报价
      const res = await fetch(
        `https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=${Math.floor(
          lamports
        )}&slippageBps=50`
      );
      
      const data = await res.json();
      if (data.outAmount) {
        setReceiveAmount((Number(data.outAmount) / 1000000).toFixed(2));
      } else {
        setReceiveAmount("0.00");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: "#111",
          padding: "30px",
          borderRadius: "24px",
          width: "350px",
          border: "1px solid #333",
        }}
      >
        <h2 style={{ color: "#4ade80", textAlign: "center" }}>MER SWAP</h2>
        <div
          style={{
            background: "#222",
            padding: "15px",
            borderRadius: "15px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#888",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>支付 SOL</span>
            <span>余额: {balance}</span>
          </div>
          <input
            type="number"
            value={payAmount}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="0.00"
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "24px",
              outline: "none",
              width: "100%",
            }}
          />
        </div>
        <div style={{ background: "#222", padding: "15px", borderRadius: "15px" }}>
          <div style={{ fontSize: "12px", color: "#888" }}>收到 USDC (预计)</div>
          <div style={{ fontSize: "24px", marginTop: "10px" }}>
            {receiveAmount}
          </div>
        </div>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <WalletMultiButton />
        </div>
      </div>
    </div>
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
