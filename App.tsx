import React, { useState, useEffect } from 'react';
import { Layout } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { GameDirectory } from './components/GameDirectory';
import { AssetViewer } from './components/AssetViewer';
import { AiConcierge } from './components/AiConcierge';
import { WalletConnectModal } from './components/WalletConnectModal';
import { WalletProvider, useWallet } from './services/walletContext';
import { ViewState } from './types';

// Main App Layout Component
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { isConnected } = useWallet();

  // Mobile persistent nav handler
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onViewChange={setCurrentView} />;
      case ViewState.GAMES:
        return <GameDirectory />;
      case ViewState.ASSETS:
        return <AssetViewer />;
      case ViewState.AI_ASSISTANT:
        return <AiConcierge />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-oasys-dark text-slate-100 font-sans selection:bg-oasys-primary selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Top Header */}
        <Header 
          onMenuClick={toggleSidebar} 
          onConnectClick={() => setIsWalletModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {renderView()}
          </div>
        </main>

        {/* Floating AI Button (Mobile Friendly) */}
        <button
          onClick={() => setCurrentView(ViewState.AI_ASSISTANT)}
          className="md:hidden fixed bottom-6 right-6 bg-oasys-secondary hover:bg-fuchsia-400 text-white p-4 rounded-full shadow-lg shadow-fuchsia-900/50 transition-all z-50 flex items-center justify-center"
          aria-label="AI Assistant"
        >
           <span className="text-2xl">✨</span>
        </button>
      </div>

      {/* Wallet Connection Modal */}
      <WalletConnectModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
};

export default App;