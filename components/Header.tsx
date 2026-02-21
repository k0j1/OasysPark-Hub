import React from 'react';
import { Menu, Wallet, ScanFace } from 'lucide-react';
import { Button } from './ui/Button';
import { useWallet } from '../services/walletContext';
import { WalletConnectionMethod } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  onConnectClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onConnectClick }) => {
  const { isConnected, address, disconnect, balance, connectionMethod, farcasterUser } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const getWalletIcon = () => {
    if (connectionMethod === WalletConnectionMethod.FARCASTER) return <ScanFace size={16} className="text-[#855DCD]" />;
    return <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>;
  };

  const getDisplayName = () => {
    if (connectionMethod === WalletConnectionMethod.FARCASTER && farcasterUser) {
      return farcasterUser.displayName;
    }
    return address ? formatAddress(address) : '';
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center md:hidden">
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {/* Breadcrumb-like title or empty space */}
        <span className="text-slate-500 text-sm">Hub / Overview</span>
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        {isConnected && address ? (
          <div className="flex items-center space-x-3 bg-slate-800 rounded-lg p-1 pr-4 border border-slate-700">
            <div className="bg-slate-950 px-3 py-1 rounded-md">
              <span className="text-cyan-400 font-mono text-sm">{balance} OAS</span>
            </div>
            <div className="flex items-center space-x-2">
              {getWalletIcon()}
              <span className="text-sm font-medium text-slate-200">{getDisplayName()}</span>
            </div>
            <button 
              onClick={disconnect}
              className="text-xs text-red-400 hover:text-red-300 ml-2 border-l border-slate-600 pl-2"
            >
              Exit
            </button>
          </div>
        ) : (
          <Button onClick={onConnectClick} variant="primary" size="sm" className="shadow-cyan-500/20">
            <Wallet className="w-4 h-4 mr-2" />
            Wallet Connect
          </Button>
        )}
      </div>
    </header>
  );
};
