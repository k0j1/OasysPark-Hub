import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';
import { Layout } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { GameDirectory } from './components/GameDirectory';
import { AssetViewer } from './components/AssetViewer';
import { WalletConnectModal } from './components/WalletConnectModal';
import { WalletProvider, useWallet } from './services/walletContext';
import { ViewState } from './types';

// Main App Layout Component
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { isConnected, connectFarcaster } = useWallet();

  // Initialize Farcaster Frame SDK
  useEffect(() => {
    const initFrame = async () => {
      try {
        sdk.actions.ready();
        
        // Auto-connect if running inside a Farcaster frame
        const context = await sdk.context;
        if (context && context.user && !isConnected) {
          await connectFarcaster();
        }
      } catch (error) {
        console.error("Failed to initialize Farcaster Frame:", error);
      }
    };
    
    initFrame();
  }, [isConnected, connectFarcaster]);

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