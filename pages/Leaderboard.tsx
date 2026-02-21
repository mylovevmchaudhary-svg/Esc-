import React, { useState } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { Header } from '../components';

const REFERRAL_LEADERS = [
  { rank: 1, name: 'CryptoKing', score: 1250, avatar: 'bg-yellow-500' },
  { rank: 2, name: 'BitMaster', score: 980, avatar: 'bg-slate-400' },
  { rank: 3, name: 'TokenHunter', score: 845, avatar: 'bg-orange-500' },
  { rank: 4, name: 'Alex_99', score: 720, avatar: 'bg-cyan-600' },
  { rank: 5, name: 'SarahJ', score: 615, avatar: 'bg-purple-600' },
  { rank: 6, name: 'MoonWalker', score: 530, avatar: 'bg-blue-600' },
  { rank: 7, name: 'HODLer', score: 490, avatar: 'bg-indigo-600' },
  { rank: 8, name: 'WhaleWatcher', score: 410, avatar: 'bg-teal-600' },
];

const HOLDER_LEADERS = [
  { rank: 1, name: 'WhaleWatcher', score: 5000000, avatar: 'bg-teal-600' },
  { rank: 2, name: 'HODLer', score: 3200000, avatar: 'bg-indigo-600' },
  { rank: 3, name: 'CryptoKing', score: 2800000, avatar: 'bg-yellow-500' },
  { rank: 4, name: 'SarahJ', score: 1500000, avatar: 'bg-purple-600' },
  { rank: 5, name: 'BitMaster', score: 1200000, avatar: 'bg-slate-400' },
  { rank: 6, name: 'Alex_99', score: 900000, avatar: 'bg-cyan-600' },
  { rank: 7, name: 'MoonWalker', score: 750000, avatar: 'bg-blue-600' },
  { rank: 8, name: 'TokenHunter', score: 500000, avatar: 'bg-orange-500' },
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'referrals' | 'holders'>('referrals');
  
  const currentLeaders = activeTab === 'referrals' ? REFERRAL_LEADERS : HOLDER_LEADERS;

  return (
    <div className="min-h-screen pb-24 pt-16 px-4 max-w-lg mx-auto">
      <Header title="Leaderboard" />

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl mb-6 border border-slate-800">
        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'referrals' 
              ? 'bg-slate-800 text-white shadow-lg shadow-black/20 ring-1 ring-white/10' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Top Referrals
        </button>
        <button
          onClick={() => setActiveTab('holders')}
          className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'holders' 
              ? 'bg-slate-800 text-white shadow-lg shadow-black/20 ring-1 ring-white/10' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Top Holders
        </button>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end space-x-4 mb-8 pt-4">
        {/* Rank 2 */}
        <div className="flex flex-col items-center relative top-4">
          <div className="w-14 h-14 rounded-full border-2 border-slate-600 overflow-hidden mb-2 relative shadow-lg shadow-slate-900/50">
             <div className={`w-full h-full flex items-center justify-center text-lg font-bold text-white ${currentLeaders[1].avatar}`}>
               {currentLeaders[1].name.charAt(0)}
             </div>
             <div className="absolute -bottom-1 -right-1 bg-slate-700 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-slate-800 font-bold">2</div>
          </div>
          <div className="w-20 bg-gradient-to-b from-slate-800 to-slate-900/0 rounded-t-lg flex flex-col items-center justify-start pt-2 pb-4 border-t border-slate-700/50">
             <span className="text-slate-300 font-bold text-xs truncate max-w-[90%]">{currentLeaders[1].name}</span>
             <span className="text-slate-500 text-[10px] font-mono">{currentLeaders[1].score.toLocaleString()}</span>
             <div className="h-16 w-full"></div>
          </div>
        </div>

        {/* Rank 1 */}
        <div className="flex flex-col items-center z-10 relative -top-2">
          <div className="mb-2 text-yellow-400 animate-bounce drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"><Crown size={28} fill="currentColor" /></div>
          <div className="w-20 h-20 rounded-full border-4 border-yellow-500 overflow-hidden mb-2 relative shadow-[0_0_25px_rgba(234,179,8,0.4)]">
             <div className={`w-full h-full flex items-center justify-center text-3xl font-bold text-white ${currentLeaders[0].avatar}`}>
               {currentLeaders[0].name.charAt(0)}
             </div>
             <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-slate-900 font-bold">1</div>
          </div>
          <div className="w-24 bg-gradient-to-b from-yellow-500/20 to-yellow-500/0 rounded-t-xl flex flex-col items-center justify-start pt-3 pb-4 border-t border-yellow-500/50 backdrop-blur-sm">
             <span className="text-yellow-200 font-bold text-sm truncate max-w-[90%]">{currentLeaders[0].name}</span>
             <span className="text-yellow-500/80 text-xs font-mono font-bold">{currentLeaders[0].score.toLocaleString()}</span>
             <div className="h-24 w-full"></div>
          </div>
        </div>

        {/* Rank 3 */}
        <div className="flex flex-col items-center relative top-8">
           <div className="w-14 h-14 rounded-full border-2 border-orange-700 overflow-hidden mb-2 relative shadow-lg shadow-orange-900/50">
             <div className={`w-full h-full flex items-center justify-center text-lg font-bold text-white ${currentLeaders[2].avatar}`}>
               {currentLeaders[2].name.charAt(0)}
             </div>
             <div className="absolute -bottom-1 -right-1 bg-orange-700 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-slate-800 font-bold">3</div>
          </div>
          <div className="w-20 bg-gradient-to-b from-slate-800 to-slate-900/0 rounded-t-lg flex flex-col items-center justify-start pt-2 pb-4 border-t border-slate-700/50">
             <span className="text-slate-300 font-bold text-xs truncate max-w-[90%]">{currentLeaders[2].name}</span>
             <span className="text-slate-500 text-[10px] font-mono">{currentLeaders[2].score.toLocaleString()}</span>
             <div className="h-12 w-full"></div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {currentLeaders.slice(3).map((user, idx) => (
          <div key={idx} className="bg-slate-900/40 p-3 rounded-xl flex items-center justify-between border border-slate-800/50 hover:bg-slate-800/60 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-slate-500 font-mono w-6 text-center text-sm font-bold">#{user.rank}</span>
              <div className={`w-9 h-9 rounded-full ${user.avatar} flex items-center justify-center text-sm font-bold text-white shadow-inner`}>
                {user.name.charAt(0)}
              </div>
              <span className="text-slate-200 text-sm font-medium">{user.name}</span>
            </div>
            <span className="text-cyan-400 font-mono text-sm font-bold">{user.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}