import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import sdk from '@farcaster/frame-sdk';
import { WalletState, WalletConnectionMethod } from '../types';
import { fetchOasysAssets } from './explorerService';

interface WalletContextType extends WalletState {
  connectMetamask: () => Promise<void>;
  connectFarcaster: () => Promise<void>;
  connectManual: (address: string) => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    balance: '0',
    connectionMethod: null,
    tokens: [],
    nfts: [],
    isLoadingAssets: false,
  });

  const loadAssets = useCallback(async (address: string) => {
    setState(prev => ({ ...prev, isLoadingAssets: true }));
    
    const { nativeBalance, tokens, nfts } = await fetchOasysAssets(address);
    
    setState(prev => ({
      ...prev,
      balance: nativeBalance,
      tokens: tokens,
      nfts: nfts,
      isLoadingAssets: false,
    }));
  }, []);

  const connectMetamask = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum;
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        
        setState(prev => ({
          ...prev,
          address: address,
          isConnected: true,
          chainId: 248,
          connectionMethod: WalletConnectionMethod.METAMASK,
        }));

        await loadAssets(address);

      } else {
        alert("MetaMaskがインストールされていません。");
      }
    } catch (error) {
      console.error("MetaMask connection failed", error);
      throw error;
    }
  }, [loadAssets]);

  const connectFarcaster = useCallback(async () => {
    try {
      let fid = 12345;
      let username = 'oasys_fan';
      let displayName = 'Oasys Gamer';
      
      // Try to get real Farcaster context
      const context = await sdk.context;
      if (context && context.user) {
        fid = context.user.fid;
        username = context.user.username || username;
        displayName = context.user.displayName || displayName;
      } else {
        // Simulation delay if not in frame
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      const mockAddress = '0xcd3b766ccdd6ae721141f452c550ca635964ce71'; // Demo Address
      
      setState(prev => ({
        ...prev,
        address: mockAddress,
        isConnected: true,
        chainId: 248,
        connectionMethod: WalletConnectionMethod.FARCASTER,
        farcasterUser: {
          fid,
          username,
          displayName,
        }
      }));

      await loadAssets(mockAddress);
    } catch (error) {
      console.error("Farcaster connection failed", error);
    }
  }, [loadAssets]);

  const connectManual = useCallback(async (inputAddress: string) => {
    console.log(`Connecting manually to ${inputAddress}...`);

    setState(prev => ({
      ...prev,
      address: inputAddress,
      isConnected: true,
      chainId: 248,
      connectionMethod: WalletConnectionMethod.MANUAL,
    }));

    await loadAssets(inputAddress);
  }, [loadAssets]);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      chainId: null,
      balance: '0',
      connectionMethod: null,
      farcasterUser: undefined,
      tokens: [],
      nfts: [],
      isLoadingAssets: false,
    });
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connectMetamask, connectFarcaster, connectManual, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};
