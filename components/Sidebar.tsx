import React from 'react';
import { LayoutDashboard, Gamepad2, Coins, X, Zap } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onClose }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'ダッシュボード', icon: LayoutDashboard },
    { id: ViewState.GAMES, label: 'ゲーム一覧', icon: Gamepad2 },
    { id: ViewState.ASSETS, label: '資産管理 (Tokens/NFT)', icon: Coins },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              OasysPark
            </span>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  if (window.innerWidth < 768) onClose();
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-900/10' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-4 text-xs text-slate-400">
            <div className="flex justify-between items-center mb-1">
              <p className="font-mono">NETWORK STATUS</p>
              <span className="font-mono text-[10px] text-slate-500">v0.0.4</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-400">Oasys Mainnet</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
