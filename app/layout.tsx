import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

export const metadata = {
  title: "MER SWAP",
  description: "Solana Swap Interface",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
