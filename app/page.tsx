'use client'
import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function MerSwap() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then(bal => setBalance(bal / LAMPORTS_PER_SOL));
    }
  }, [publicKey, connection]);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#111', padding: '30px', borderRadius: '24px', border: '1px solid #333', width: '320px', textAlign: 'center' }}>
        <h2 style={{ color: '#4ade80', letterSpacing: '2px' }}>MER SWAP</h2>
        <div style={{ margin: '20px 0' }}><WalletMultiButton /></div>
        <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '15px' }}>
          <p style={{ fontSize: '12px', color: '#888', margin: '0' }}>SOL 余额</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>{balance.toFixed(4)}</p>
        </div>
        <p style={{ fontSize: '10px', color: '#444', marginTop: '15px', wordBreak: 'break-all' }}>
          {publicKey ? `地址: ${publicKey.toBase58()}` : '请连接钱包'}
        </p>
      </div>
    </div>
  );
}
