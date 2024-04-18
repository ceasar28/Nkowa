import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import WalletProvider from "@/context/walletProvider";

// const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string; // get one at https://cloud.walletconnect.com/app

const projectId = "996a2179909eda46f089c6ef01a981a4" as string;

function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WalletProvider>
  );
}

export default App;
