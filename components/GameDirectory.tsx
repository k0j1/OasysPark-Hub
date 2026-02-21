import React, { useState, useMemo } from 'react';
import { Search, Filter, ExternalLink } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { MOCK_GAMES } from '../constants';
import { ChainType } from '../types';

export const GameDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState<string>('All');

  // Derive unique chains for filter
  const chains = ['All', ...Array.from(new Set(MOCK_GAMES.map(g => g.chain)))];

  const filteredGames = useMemo(() => {
    return MOCK_GAMES.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            game.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesChain = selectedChain === 'All' || game.chain === selectedChain;
      return matchesSearch && matchesChain;
    });
  }, [searchTerm, selectedChain]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Oasys Games</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search games..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 w-full sm:w-64"
            />
          </div>

          {/* Chain Filter */}
          <div className="relative">
            <select 
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 w-full cursor-pointer"
            >
              {chains.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.length > 0 ? (
          filteredGames.map(game => (
            <Card key={game.id} hover className="flex flex-col h-full overflow-hidden p-0 border-0 bg-slate-900">
              <div className="relative h-40 w-full overflow-hidden">
                <img 
                  src={game.imageUrl} 
                  alt={game.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-mono text-cyan-400 border border-cyan-900/50">
                  {game.chain}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-fuchsia-400 bg-fuchsia-950/30 px-2 py-0.5 rounded">
                    {game.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{game.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                  {game.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {game.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:border-cyan-500 group-hover:text-cyan-400 transition-colors"
                  onClick={() => game.link && window.open(game.link, '_blank')}
                >
                  Play Now <ExternalLink size={14} className="ml-2" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
            <p className="text-lg">No games found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
