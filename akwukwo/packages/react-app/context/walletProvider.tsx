/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// WalletProvider.js
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

declare var window: any;

interface WalletState {
  metaMask: string;
  chainId: string;
}

interface WalletContextType {
  wallet: WalletState;
  hasProvider: boolean | null;
  connectMetamask: () => Promise<void | any>;
  showWalletError: boolean;
  setShowWalletError: React.Dispatch<React.SetStateAction<boolean>>;
  walletErrorMsg: string;
  setWalletErrorMsg: React.Dispatch<React.SetStateAction<string>>;
}

const disconnectedState: WalletState = {
  metaMask: "",
  chainId: "atlantic-2",
};

const WalletContext = createContext<WalletContextType | null>(null);

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallet, setWallet] = useState(disconnectedState);
  const [showWalletError, setShowWalletError] = useState(false);
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [walletErrorMsg, setWalletErrorMsg] = useState("");

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length) {
          console.log(`You're connected to: ${accounts[0]}`);
        } else {
          console.log("Metamask is not connected");
        }
      } catch (error) {
        console.error("Error initializing wallet:", error);
        // add a logic to close the modal
      }
    };

    initializeWallet();
  }, []);

  const connectMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const chainId = 1001;
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: "Klaytn Testnet Baobab",
              nativeCurrency: {
                name: "KLAY",
                symbol: "KLAY",
                decimals: 18,
              },
              rpcUrls: ["https://public-en-baobab.klaytn.net"],
              blockExplorerUrls: ["https://baobab.klaytnscope.com"],
            },
          ],
        });
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // @ts-ignore

        if (account) {
          setWallet({
            metaMask: account[0],
            chainId: "atlantic-2",
          });
          return {
            address: account[0],
          };
        }
        return {
          address: "",
        };
      } catch (error) {
        console.error("Error connecting Metamask:", error);
        // add a logic to close the modal
      }
    } else {
      console.log("Metamask not installed", "https://metamask.io/download/");
      setWalletErrorMsg(
        `Metamask not installed, <a class="underline" target="_blank" href="https://metamask.io/download">download here</a>`
      );
      setShowWalletError(true);
      throw new Error("Metamask not installed");
    }
  };

  const value = useMemo(() => {
    return {
      wallet,
      hasProvider,
      connectMetamask,
      showWalletError,
      setShowWalletError,
      walletErrorMsg,
      setWalletErrorMsg,
    };
  }, [wallet, hasProvider, showWalletError, walletErrorMsg]);
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export default WalletProvider;
