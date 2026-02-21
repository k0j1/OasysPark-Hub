import React, { useMemo } from 'react';
import { TrendingUp, Gamepad2, Coins } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ViewState } from '../types';
import { MOCK_GAMES } from '../constants';
import { useWallet } from '../services/walletContext';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  onViewChange: (view: ViewState) => void;
}

// Mock Chart Data
const CHART_DATA = [
  { day: 'Mon', value: 1200 },
  { day: 'Tue', value: 1350 },
  { day: 'Wed', value: 1280 },
  { day: 'Thu', value: 1400 },
  { day: 'Fri', value: 1600 },
  { day: 'Sat', value: 1550 },
  { day: 'Sun', value: 1800 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const { isConnected, tokens } = useWallet();
  const topGames = MOCK_GAMES.filter(g => g.isHot).slice(0, 3);

  // Calculate Total Balance in USD dynamically
  const totalBalanceUsd = useMemo(() => {
    if (!isConnected || tokens.length === 0) return 0;
    return tokens.reduce((acc, token) => {
      const balanceValue = parseFloat(token.balance.replace(/,/g, ''));
      return acc + (balanceValue * token.priceUsd);
    }, 0);
  }, [isConnected, tokens]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-900 to-slate-900 border border-slate-800 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to OasysPark</h1>
          <p className="text-slate-400 max-w-xl mb-6">
            Oasysチェーンのゲームエコシステムへようこそ。
            {isConnected 
              ? 'ウォレット接続済み。資産状況と最新ゲームをチェックしましょう。' 
              : 'ウォレットを接続して、トークン残高やNFTコレクションを管理しましょう。'}
          </p>
          <div className="flex space-x-4">
             <Button onClick={() => onViewChange(ViewState.GAMES)} variant="primary">
               ゲームを探す
             </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Balance</p>
              <h3 className="text-2xl font-bold text-white">
                ${totalBalanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span className="text-green-400 text-xs flex items-center mt-2">
                <TrendingUp size={12} className="mr-1" /> +12.5% vs last week
              </span>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg text-cyan-400">
              <Coins size={20} />
            </div>
          </div>
          <div className="h-16 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHART_DATA}>
                <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
           <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Active Games</p>
              <h3 className="text-2xl font-bold text-white">5</h3>
              <span className="text-slate-500 text-xs mt-2 block">
                Last played: My Crypto Heroes
              </span>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg text-fuchsia-400">
              <Gamepad2 size={20} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {topGames.slice(0, 2).map(g => (
              <div key={g.id} className="flex items-center justify-between text-sm bg-slate-800/50 p-2 rounded">
                <span className="truncate">{g.title}</span>
                <span className="text-green-400 text-xs">Active</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trending Games Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Trending Games</h2>
          <button 
            onClick={() => onViewChange(ViewState.GAMES)}
            className="text-cyan-400 text-sm hover:underline"
          >
            See all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topGames.map(game => (
            <div 
              key={game.id} 
              className="group relative h-48 rounded-xl overflow-hidden cursor-pointer border border-slate-800 hover:border-cyan-500/50 transition-all"
              onClick={() => {
                if (game.link) {
                  window.open(game.link, '_blank');
                } else {
                  onViewChange(ViewState.GAMES);
                }
              }}
            >
              <img src={game.imageUrl} alt={game.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-4 flex flex-col justify-end">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-2 py-0.5 rounded bg-fuchsia-600 text-white text-xs font-bold mb-2">HOT</span>
                  <h3 className="text-lg font-bold text-white">{game.title}</h3>
                  <p className="text-slate-300 text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {game.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
