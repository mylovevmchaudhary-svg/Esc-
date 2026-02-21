import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Users, DollarSign, PlayCircle, Gift, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../context';
import { Header, InfoCard, ActionCard } from '../components';
import { AppRoute } from '../types';

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pb-24 pt-16 px-4 max-w-lg mx-auto">
      <Header 
        title="Dashboard" 
        rightAction={<div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
          {user.username.charAt(0).toUpperCase()}
        </div>}
      />

      {/* Summary Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <motion.div variants={item}>
          <InfoCard 
            title="Total Bonus" 
            value={user.bonusCoins.toLocaleString()} 
            icon={Coins} 
            colorClass="text-blue-400" 
            subLabel="Bonus Coins"
          />
        </motion.div>
        <motion.div variants={item}>
          <InfoCard 
            title="Total ESC" 
            value={user.escCoins.toLocaleString()} 
            icon={DollarSign} 
            colorClass="text-green-400" 
            subLabel="ESC Tokens"
          />
        </motion.div>
        <motion.div variants={item}>
          <InfoCard 
            title="Today Earned" 
            value={`+${user.todayEarned}`} 
            icon={Calendar} 
            colorClass="text-yellow-400" 
          />
        </motion.div>
        <motion.div variants={item}>
          <InfoCard 
            title="Referrals" 
            value={user.referrals} 
            icon={Users} 
            colorClass="text-purple-400" 
          />
        </motion.div>
      </motion.div>

      {/* Action Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <motion.h2 variants={item} className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Quick Actions</motion.h2>
        
        <motion.div variants={item}>
          <ActionCard
            title="Watch Ads"
            subtitle={`${user.adsWatchedDaily} / 500 Daily Ads Watched`}
            buttonText="Watch Now"
            onClick={() => navigate(AppRoute.ADS)}
            icon={PlayCircle}
            gradient="bg-gradient-to-br from-indigo-600 to-purple-700"
          />
        </motion.div>

        <motion.div variants={item}>
          <ActionCard
            title="Refer & Earn"
            subtitle="Invite friends and earn massive ESC rewards"
            buttonText="Invite Friends"
            onClick={() => navigate(AppRoute.REFER)}
            icon={Users}
            gradient="bg-gradient-to-br from-emerald-600 to-teal-700"
          />
        </motion.div>

        <motion.div variants={item}>
          <ActionCard
            title="Live Events"
            subtitle="Participate in limited time events for 2x rewards"
            buttonText="View Event"
            onClick={() => navigate(AppRoute.EVENT)}
            icon={Gift}
            gradient="bg-gradient-to-br from-orange-600 to-red-700"
          />
        </motion.div>
      </motion.div>

      {/* ESC Earnings Summary */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-8 mb-6"
      >
        <motion.h2 variants={item} className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1 mb-3">ESC Earnings Summary</motion.h2>
        <div className="grid grid-cols-2 gap-3">
          <motion.div variants={item}>
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2 text-emerald-400">
                <Calendar size={20} />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Today Earned</span>
              <span className="text-xl font-bold text-white mt-1">
                {user.todayEscEarned ? user.todayEscEarned.toLocaleString() : '0'} <span className="text-xs text-emerald-400">ESC</span>
              </span>
            </div>
          </motion.div>
          <motion.div variants={item}>
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-2 text-purple-400">
                <DollarSign size={20} />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Earned</span>
              <span className="text-xl font-bold text-white mt-1">
                {user.totalEscEarned ? user.totalEscEarned.toLocaleString() : '0'} <span className="text-xs text-purple-400">ESC</span>
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}