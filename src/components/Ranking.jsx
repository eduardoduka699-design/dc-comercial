import React from 'react';
import { Trophy, Medal, TrendingUp, TrendingDown } from 'lucide-react';
import { rankingData } from '../data/mockData';

export default function Ranking({ role }) {
  const data = rankingData[role];
  const roleTitle = role.toUpperCase();

  const getMedalColor = (index) => {
    if (index === 0) return 'text-yellow-400'; // Gold
    if (index === 1) return 'text-gray-400'; // Silver
    if (index === 2) return 'text-[#b08d57]'; // Bronze
    return 'text-transparent';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="bg-bg-card p-8 rounded-2xl border border-border">
        <div className="flex items-center gap-3 mb-8 border-b border-border pb-6">
          <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg">
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-main">Ranking de {roleTitle}</h2>
            <p className="text-sm text-text-muted mt-1">Acompanhe a performance e o pódio dos melhores do mês.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {data.map((user, index) => (
            <div 
              key={user.id} 
              className={`flex items-center justify-between p-4 rounded-xl border ${index === 0 ? 'border-yellow-400/30 bg-yellow-400/5' : 'border-border bg-bg-main'}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 font-bold text-lg text-text-muted">
                  {index < 3 ? <Medal size={24} className={getMedalColor(index)} /> : `${index + 1}º`}
                </div>
                
                <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-sm">
                  {user.avatar}
                </div>
                
                <div>
                  <h3 className="font-bold text-text-main">{user.name}</h3>
                  <p className="text-xs text-text-muted">{user.metrics}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-blue">{user.points} pts</p>
                </div>
                <div className="w-6 flex justify-end">
                  {user.trend === 'up' ? (
                    <TrendingUp size={16} className="text-[#10b981]" />
                  ) : (
                    <TrendingDown size={16} className="text-[#ef4444]" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
