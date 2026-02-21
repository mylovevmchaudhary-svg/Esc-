import React, { useState } from 'react';
import { Users, Copy, Share2, AlertTriangle, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../context';
import { Header, Button } from '../components';

export default function Refer() {
  const { user, referralsList } = useUser();
  const [copied, setCopied] = useState(false);
  
  const referralCode = `ESC-${user.username || 'USER'}`;
  const referralLink = `${window.location.origin}/ref/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join ESC Coin',
          text: 'Join me on ESC Coin and earn rewards!',
          url: referralLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  const milestones = [
    { target: 100, reward: 500 },
    { target: 250, reward: 1000 },
    { target: 500, reward: 2000 },
    { target: 750, reward: 3000 },
    { target: 1000, reward: 5000 },
    { target: 5000, reward: 10000 },
    { target: 10000, reward: 100000 },
  ];

  return (
    <div className="min-h-screen pb-24 pt-16 px-4 max-w-lg mx-auto">
      <Header title="Refer & Earn" />

      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-6 mb-6 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-10"></div>
        <Users className="mx-auto text-white mb-2 opacity-80" size={40} />
        <h2 className="text-2xl font-bold text-white mb-1">Invite Friends</h2>
        <p className="text-emerald-100 text-sm mb-4">Earn huge ESC rewards for every active user you invite.</p>
        
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg flex items-center justify-between border border-white/20">
          <span className="text-white font-mono text-sm tracking-widest">{referralCode}</span>
          <div className="flex space-x-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
              title="Copy Link"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-white" />}
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
              title="Share Link"
            >
              <Share2 size={16} className="text-white" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Rules */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 p-5 rounded-2xl mb-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <AlertTriangle size={64} className="text-yellow-500" />
        </div>
        
        <div className="flex items-start space-x-4 relative z-10">
          <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-yellow-500 mb-1">Important Rules</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
              Fake users and self-referrals on the same device are strictly prohibited. 
              Accounts found violating this will be banned immediately.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Next Milestone Progress */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Next Milestone</h3>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl relative overflow-hidden">
          {(() => {
            const nextMilestoneIndex = milestones.findIndex(m => user.referrals < m.target);
            const isMaxLevel = nextMilestoneIndex === -1;
            const nextMilestone = isMaxLevel ? milestones[milestones.length - 1] : milestones[nextMilestoneIndex];
            const prevMilestone = nextMilestoneIndex > 0 ? milestones[nextMilestoneIndex - 1] : { target: 0 };
            
            const range = nextMilestone.target - prevMilestone.target;
            const currentInLevel = user.referrals - prevMilestone.target;
            const percentage = isMaxLevel ? 100 : Math.min(Math.max((currentInLevel / range) * 100, 0), 100);
            
            return (
              <>
                <div className="flex justify-between items-end mb-2 relative z-10">
                  <div>
                    <span className="text-3xl font-bold text-white">{user.referrals}</span>
                    <span className="text-sm text-slate-500 ml-1">/ {nextMilestone.target} Referrals</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                      {isMaxLevel ? 'Max Level Reached' : `${nextMilestone.target - user.referrals} to go`}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden relative z-10 border border-slate-700">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
                
                <div className="mt-3 flex justify-between items-center text-xs text-slate-400 relative z-10">
                  <span>Level {nextMilestoneIndex > -1 ? nextMilestoneIndex : milestones.length}</span>
                  <span>Reward: <span className="text-emerald-400 font-bold">+{nextMilestone.reward.toLocaleString()} ESC</span></span>
                </div>

                {/* Background Decoration */}
                <div className="absolute -right-6 -bottom-6 text-emerald-500/5 rotate-12 pointer-events-none">
                  <Users size={120} />
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Milestones */}
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Referral Milestones</h3>
      <div className="space-y-3 mb-8">
        {milestones.map((ms, idx) => {
          const progress = Math.min((user.referrals / ms.target) * 100, 100);
          const isCompleted = user.referrals >= ms.target;
          
          return (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-xl border ${isCompleted ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-900 border-slate-800'} relative overflow-hidden group`}
            >
              <div className="flex justify-between items-center mb-3 relative z-10">
                <div className="flex items-center space-x-3">
                   <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      <Users size={20} />
                   </div>
                   <div>
                      <h4 className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                        {ms.target} Referrals
                      </h4>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <span className="text-xs text-slate-400">Reward:</span>
                        <span className="text-xs font-bold text-yellow-400">{ms.reward.toLocaleString()} ESC</span>
                      </div>
                   </div>
                </div>
                
                <div className="text-right">
                  {isCompleted ? (
                    <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                      <Check size={12} />
                      <span className="text-xs font-bold">Claimed</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-lg">
                      {Math.floor(progress)}%
                    </span>
                  )}
                </div>
              </div>
              
              <div className="relative pt-1">
                <div className="flex mb-1 items-center justify-between">
                  <div className="text-right w-full">
                    <span className="text-[10px] font-semibold inline-block text-slate-500">
                      {user.referrals} / {ms.target}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded-full bg-slate-800 border border-slate-700/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  >
                     {!isCompleted && (
                        <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite] skew-x-12"></div>
                      )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Referral List */}
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Your Referrals</h3>
      <div className="space-y-2">
        {referralsList && referralsList.length > 0 ? (
          referralsList.map((ref, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                  {ref.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{ref.username}</p>
                  <p className="text-[10px] text-slate-500">Joined: {ref.date}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${ref.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                {ref.status}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center p-6 bg-slate-900/30 rounded-xl border border-slate-800/50 border-dashed">
            <Users className="mx-auto text-slate-600 mb-2" size={24} />
            <p className="text-sm text-slate-500">No referrals yet.</p>
            <p className="text-xs text-slate-600 mt-1">Share your link to start earning!</p>
          </div>
        )}
      </div>
    </div>
  );
}