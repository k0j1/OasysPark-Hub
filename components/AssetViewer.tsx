import React, { useState } from 'react';
import { Card } from './ui/Card';
import { useWallet } from '../services/walletContext';
import { Coins, Image as ImageIcon, Wallet, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

export const AssetViewer: React.FC = () => {
  const { isConnected, tokens, nfts, isLoadingAssets } = useWallet();
  const [activeTab, setActiveTab] = useState<'tokens' | 'nfts'>('tokens');

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
          <Wallet size={32} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-slate-400 max-w-md mb-6">
          トークンやNFTを表示するには、ウォレットを接続してください。Oasysチェーン上の資産を一覧で確認できます。
        </p>
        <p className="text-xs text-slate-500">画面右上の「Wallet Connect」ボタンから接続してください。</p>
      </div>
    );
  }

  if (isLoadingAssets) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Loading Oasys Assets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg w-fit border border-slate-800">
        <button
          onClick={() => setActiveTab('tokens')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'tokens' 
              ? 'bg-slate-800 text-white shadow-sm' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Coins size={16} />
            <span>Tokens</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('nfts')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'nfts' 
              ? 'bg-slate-800 text-white shadow-sm' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <ImageIcon size={16} />
            <span>NFT Collections</span>
          </div>
        </button>
      </div>

      {activeTab === 'tokens' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.length > 0 ? tokens.map((token, idx) => (
            <Card key={`${token.symbol}-${idx}`} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-white border border-slate-600 overflow-hidden">
                    {token.icon ? (
                      <img src={token.icon} alt={token.symbol} className="w-full h-full object-cover" />
                    ) : (
                      token.symbol[0]
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{token.name}</h3>
                    <p className="text-xs text-slate-400">{token.chain}</p>
                  </div>
                </div>
                {token.priceUsd > 0 && (
                   <div className={`text-xs px-2 py-1 rounded bg-green-500/20 text-green-400`}>
                      ${token.priceUsd}
                   </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-mono text-white truncate" title={token.balance}>{token.balance} {token.symbol}</p>
                {token.priceUsd > 0 && (
                  <p className="text-sm text-slate-500">
                    ≈ ${(parseFloat(token.balance) * token.priceUsd).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </p>
                )}
              </div>
            </Card>
          )) : (
            <div className="col-span-full py-8 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
              トークンが見つかりませんでした。
            </div>
          )}
        </div>
      )}

      {activeTab === 'nfts' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {nfts.length > 0 ? nfts.map((nft) => (
            <Card key={nft.id} className="p-0 overflow-hidden group hover:border-fuchsia-500/50 transition-all">
              <div className="aspect-square relative overflow-hidden bg-slate-800">
                <img 
                  src={nft.imageUrl} 
                  alt={nft.collectionName} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-mono text-white border border-white/20">
                  x{nft.balance}
                </div>
              </div>
              <div className="p-3 bg-slate-900 border-t border-slate-800">
                <p className="text-xs text-fuchsia-400 mb-1 truncate">{nft.collectionName}</p>
                <div className="flex justify-between items-center">
                   <p className="text-[10px] text-slate-500 truncate w-24" title={nft.contractAddress}>{nft.contractAddress}</p>
                   <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
                     {nft.type}
                   </span>
                </div>
              </div>
            </Card>
          )) : (
             <div className="col-span-full py-8 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
              NFTが見つかりませんでした。
            </div>
          )}
        </div>
      )}
    </div>
  );
};
