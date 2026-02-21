import React, { useState } from 'react';
import { Play, CheckCircle, Gift, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context';
import { Header, Button } from '../components';

export default function Ads() {
  const { user, claimAd } = useUser();
  const [isWatching, setIsWatching] = useState(false);
  const [pendingReward, setPendingReward] = useState<number | null>(null);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const [particles, setParticles] = useState<{id: number, x: number, y: number, angle: number, velocity: number}[]>([]);

  const handleWatchAd = () => {
    if (isWatching || pendingReward !== null) return;
    setIsWatching(true);
    setRewardMessage(null);

    // Simulate Ad duration
    setTimeout(() => {
      const reward = Math.floor(Math.random() * (40 - 15 + 1)) + 15;
      setPendingReward(reward);
      setIsWatching(false);
    }, 2000);
  };

  const handleClaim = async (e: React.MouseEvent) => {
    if (pendingReward === null) return;
    
    // Trigger particles
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i,
      x: 0, 
      y: 0,
      angle: Math.random() * 360,
      velocity: Math.random() * 100 + 50
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);

    const result = await claimAd(pendingReward);
    if (result.success) {
      setRewardMessage(`+${pendingReward} Bonus Coins!`);
      setPendingReward(null);
    }
  };

  const progressPercent = Math.min((user.adsWatchedDaily / 500) * 100, 100);

  return (
    <div className="min-h-screen pb-24 pt-16 px-4 max-w-lg mx-auto overflow-hidden">
      <Header title="Watch Ads" />

      {/* Main Stats */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 rounded-2xl mb-6 text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-1">{user.adsWatchedDaily} <span className="text-lg text-slate-500 font-normal">/ 500</span></h2>
        <p className="text-sm text-slate-400">Ads Watched Today</p>
        
        <div className="w-full bg-slate-800 h-3 rounded-full mt-4 overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Ad Interaction */}
      <div className="mb-8">
        <div className="relative group">
          <div className={`absolute -inset-1 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200 ${pendingReward !== null ? 'bg-gradient-to-r from-green-400 to-emerald-600 animate-pulse' : 'bg-gradient-to-r from-cyan-500 to-blue-600'}`}></div>
          
          {pendingReward !== null ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleClaim}
              className="relative w-full border border-green-500/50 bg-green-500/10 hover:bg-green-500/20 rounded-xl p-8 flex flex-col items-center justify-center transition-all overflow-hidden"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Gift size={56} className="text-green-400 mb-3 drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-green-400 mb-1">Claim Reward</h3>
              <p className="text-sm text-green-200/70">You earned {pendingReward} coins!</p>

              {/* Particle Effects */}
              {particles.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                  animate={{ 
                    x: Math.cos(p.angle * Math.PI / 180) * p.velocity, 
                    y: Math.sin(p.angle * Math.PI / 180) * p.velocity, 
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute w-2 h-2 rounded-full bg-green-400 pointer-events-none"
                  style={{ top: '50%', left: '50%' }}
                />
              ))}
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleWatchAd}
              disabled={isWatching || user.adsWatchedDaily >= 500}
              className="relative w-full bg-slate-900 border border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center transition-all hover:border-slate-600"
            >
              {isWatching ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-3" />
              ) : (
                <Play size={48} className="text-cyan-400 mb-3" fill="currentColor" />
              )}
              
              <h3 className="text-xl font-bold text-white">
                {isWatching ? 'Watching Ad...' : 'Watch Video Ad'}
              </h3>
              
              <p className="text-sm text-slate-400 mt-2">
                Earn 15-40 Bonus Coins
              </p>
            </motion.button>
          )}
        </div>
        
        <AnimatePresence>
          {rewardMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center space-x-3 text-green-400 shadow-lg shadow-green-900/20"
            >
              <div className="bg-green-500/20 p-1 rounded-full">
                <CheckCircle size={20} />
              </div>
              <span className="font-bold text-lg">{rewardMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Daily Milestones</h3>
        
        <motion.div 
          whileHover={{ x: 5 }}
          className={`p-4 rounded-xl border ${user.adsWatchedDaily >= 500 ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-slate-900/50 border-slate-800'} flex items-center justify-between`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${user.adsWatchedDaily >= 500 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
              <Gift size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-200">Daily Completion</p>
              <p className="text-xs text-slate-500">Watch 500 Ads</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-400">+1000 ESC</p>
            <p className="text-[10px] text-slate-500">{user.adsWatchedDaily >= 500 ? 'Claimed' : 'Locked'}</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ x: 5 }}
          className={`p-4 rounded-xl border ${user.adsWatchedTotal >= 1000 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-slate-900/50 border-slate-800'} flex items-center justify-between`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${user.adsWatchedTotal >= 1000 ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'}`}>
              <TrophyIcon size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-200">Lifetime Achievement</p>
              <p className="text-xs text-slate-500">Watch 1000 Total Ads</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-400">+100 ESC</p>
            <p className="text-[10px] text-slate-500">One-time</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const TrophyIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);