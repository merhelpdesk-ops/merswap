"use client";

import { useState, useEffect } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { Buffer } from 'buffer';

const MY_RPC = "https://devnet.helius-rpc.com/?api-key=36328869-15b9-4537-a162-550617733a76";

const wallets = [new PhantomWalletAdapter()];

function SwapUI() {
  const { publicKey, connected, signTransaction } = useWallet();
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("0.00");
  const [quoteResponse, setQuoteResponse] = useState<any>(null);
  const [status, setStatus] = useState("");

  const connection = new Connection(MY_RPC);

  const getQuote = async (val: string) => {
    setPayAmount(val);
    if (!val || isNaN(Number(val)) || Number(val) <= 0) {
      setReceiveAmount("0.00");
      return;
    }
    try {
      const amountInLamports = Math.floor(Number(val) * 10 ** 9);
      const res = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=${amountInLamports}&slippageBps=50`
      );
      const data = await res.json();
      if (data.outAmount) {
        setQuoteResponse(data);
        setReceiveAmount((Number(data.outAmount) / 10 ** 6).toFixed(2));
      }
    } catch (e) {
      console.error("报价失败", e);
    }
  };

  const handleSwap = async () => {
    if (!connected || !publicKey || !quoteResponse || !signTransaction) {
      alert("请连接钱包并输入金额");
      return;
    }

    try {
      setStatus("正在构建交易...");
      const swapRes = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: publicKey.toString(),
          wrapAndUnwrapSol: true,
        })
      });

      const { swapTransaction } = await swapRes.json();
      setStatus("等待钱包签名...");

      window.Buffer = Buffer; 
      const transaction = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));
      const signedTransaction = await signTransaction(transaction);
      
      setStatus("正在链上广播...");
      const txid = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: true,
        maxRetries: 2
      });

      setStatus(`交易提交成功！`);
      await connection.confirmTransaction(txid);
      setStatus("✅ 兑换成功！");
      alert("交易成功！");
    } catch (error: any) {
      console.error(error);
      setStatus("❌ 交易失败");
      alert("错误: " + error.message);
    }
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ background: "#111", padding: "30px", borderRadius: "24px", width: "350px", border: "1px solid #333" }}>
        <h2 style={{ color: "#4ade80", textAlign: "center" }}>MER SWAP PRO</h2>
        
        <div style={{ background: "#222", padding: "15px", borderRadius: "15px", marginBottom: "10px" }}>
          <div style={{ fontSize: "12px", color: "#888" }}>支付 SOL</div>
          <input
            type="number"
            value={payAmount}
            onChange={(e) => getQuote(e.target.value)}
            placeholder="0.00"
            style={{ background: "transparent", border: "none", color: "#fff", fontSize: "24px", outline: "none", width: "100%", marginTop: "5px" }}
          />
        </div>

        <div style={{ background: "#222", padding: "15px", borderRadius: "15px" }}>
          <div style={{ fontSize: "12px", color: "#888" }}>收到 USDC (预计)</div>
          <div style={{ fontSize: "24px", marginTop: "10px" }}>{receiveAmount}</div>
        </div>

        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ textAlign: "center" }}><WalletMultiButton /></div>
          {connected && (
            <button onClick={handleSwap} style={{ background: "#4ade80", color: "#000", border: "none", padding: "15px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
              立即兑换
            </button>
          )}
          {status && <div style={{ fontSize: "12px", color: "#4ade80", textAlign: "center" }}>{status}</div>}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ConnectionProvider endpoint={MY_RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SwapUI />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
