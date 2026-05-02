"use client";

import { useState, useEffect } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection, VersionedTransaction } from "@solana/web3.js";

const wallets = [new PhantomWalletAdapter()];

function SwapUI() {
  const { publicKey, connected, sendTransaction, signTransaction } = useWallet();
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("0.00");
  const [quoteResponse, setQuoteResponse] = useState<any>(null);
  const [status, setStatus] = useState("");

  const connection = new Connection(clusterApiUrl("mainnet-beta"));

  // 1. 获取报价逻辑
  const getQuote = async (val: string) => {
    setPayAmount(val);
    if (!val || isNaN(Number(val)) || Number(val) <= 0) {
      setReceiveAmount("0.00");
      return;
    }
    try {
      const amountInLamports = Math.floor(Number(val) * 10 ** 9);
      const res = await fetch(
        `https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=${amountInLamports}&slippageBps=50`
      );
      const data = await res.json();
      if (data.outAmount) {
        setQuoteResponse(data);
        setReceiveAmount((Number(data.outAmount) / 10 ** 6).toFixed(2));
      }
    } catch (e) {
      console.error("报价获取失败", e);
    }
  };

  // 2. 执行真正的兑换逻辑
  const handleSwap = async () => {
    if (!connected || !publicKey || !quoteResponse || !signTransaction) {
      alert("请先连接钱包并获取报价");
      return;
    }

    try {
      setStatus("正在准备交易数据...");
      
      // 请求 Jupiter 生成交易对象
      const swapRes = await fetch('https://api.jup.ag/swap/v1/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: publicKey.toString(),
          wrapAndUnwrapSol: true,
        })
      });

      const { swapTransaction } = await swapRes.json();
      setStatus("请在钱包中确认签名...");

      // 解析并签名交易
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      
      // 弹出钱包签名界面
      const signedTransaction = await signTransaction(transaction);
      
      // 发送交易到区块链
      setStatus("正在链上广播交易...");
      const txid = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: true,
        maxRetries: 2
      });

      setStatus(`交易已发出！正在确认...`);
      await connection.confirmTransaction(txid);
      
      setStatus("✅ 兑换成功！");
      alert("恭喜！兑换已在链上确认。");
    } catch (error: any) {
      console.error(error);
      setStatus("❌ 交易失败");
      alert("交易取消或失败: " + error.message);
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
            <button
              onClick={handleSwap}
              style={{ background: "#4ade80", color: "#000", border: "none", padding: "15px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
            >
              立即执行兑换
            </button>
          )}
          
          {status && <div style={{ fontSize: "12px", color: "#4ade80", textAlign: "center", marginTop: "10px" }}>{status}</div>}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ConnectionProvider endpoint={clusterApiUrl("mainnet-beta")}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SwapUI />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
