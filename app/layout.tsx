import "@solana/wallet-adapter-react-ui/styles.css";

export const metadata = {
  title: "MER SWAP",
  description: "Solana Swap Interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body style={{ margin: 0, padding: 0, background: '#000' }}>{children}</body>
    </html>
  );
}
 
