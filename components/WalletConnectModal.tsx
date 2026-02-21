import React, { useState } from 'react';
import { X, Wallet, ArrowRight, Link as LinkIcon, ScanFace } from 'lucide-react';
import { Button } from './ui/Button';
import { useWallet } from '../services/walletContext';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose }) => {
  const { connectMetamask, connectFarcaster, connectManual } = useWallet();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [view, setView] = useState<'SELECTION' | 'MANUAL'>('SELECTION');

  if (!isOpen) return null;

  const handleMetamask = async () => {
    setIsLoading('metamask');
    try {
      await connectMetamask();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(null);
    }
  };

  const handleFarcaster = async () => {
    setIsLoading('farcaster');
    try {
      await connectFarcaster();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(null);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualAddress.length > 0) {
      connectManual(manualAddress);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-900/20 w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/50">
          <h3 className="text-xl font-bold text-white">
            {view === 'SELECTION' ? 'Connect Wallet' : 'Enter Address'}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {view === 'SELECTION' ? (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm mb-4">
                Oasysチェーンに接続する方法を選択してください。
              </p>

              {/* Farcaster Button */}
              <button
                onClick={handleFarcaster}
                disabled={!!isLoading}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-[#855DCD]/10 border border-[#855DCD]/30 hover:bg-[#855DCD]/20 hover:border-[#855DCD] transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-[#855DCD] flex items-center justify-center text-white">
                    <ScanFace size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">Farcaster</p>
                    <p className="text-xs text-[#855DCD] group-hover:text-white transition-colors">Warpcastアカウントで接続</p>
                  </div>
                </div>
                {isLoading === 'farcaster' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <ArrowRight size={20} className="text-[#855DCD] group-hover:translate-x-1 transition-transform" />
                )}
              </button>

              {/* MetaMask Button */}
              <button
                onClick={handleMetamask}
                disabled={!!isLoading}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                    <Wallet size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">MetaMask</p>
                    <p className="text-xs text-orange-400 group-hover:text-white transition-colors">ブラウザ拡張機能を使用</p>
                  </div>
                </div>
                {isLoading === 'metamask' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <ArrowRight size={20} className="text-orange-500 group-hover:translate-x-1 transition-transform" />
                )}
              </button>

              {/* Manual Entry Button */}
              <button
                onClick={() => setView('MANUAL')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300">
                    <LinkIcon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-200">Address Input</p>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">ウォレットアドレスを直接入力</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            // Manual Input View
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Wallet Address
                </label>
                <input 
                  type="text" 
                  placeholder="0x..." 
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-mono text-sm"
                  autoFocus
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setView('SELECTION')} className="flex-1">
                  Back
                </Button>
                <Button type="submit" disabled={!manualAddress} className="flex-1">
                  Confirm
                </Button>
              </div>
            </form>
          )}
        </div>
        
        <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500">
            By connecting, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};
