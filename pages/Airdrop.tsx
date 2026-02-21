import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Check, X, Clock, AlertCircle, Timer } from 'lucide-react';
import { useUser } from '../context';
import { Header } from '../components';

const data = [
  { name: 'Airdrop', value: 45, color: '#3b82f6' }, // Blue
  { name: 'Liquidity', value: 20, color: '#10b981' }, // Emerald
  { name: 'Partnership', value: 20, color: '#8b5cf6' }, // Violet
  { name: 'Team', value: 10, color: '#f59e0b' }, // Amber
  { name: 'Giveaway', value: 5, color: '#ec4899' }, // Pink
];

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft as { days: number, hours: number, minutes: number, seconds: number };
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timeComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft] && timeLeft[interval as keyof typeof timeLeft] !== 0) {
      return null;
    }

    return (
      <div key={interval} className="flex flex-col items-center mx-2">
        <span className="text-2xl font-bold text-white font-mono bg-slate-800/80 rounded-lg p-3 min-w-[60px] border border-slate-700 shadow-lg shadow-cyan-500/10">
          {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase text-slate-500 mt-1 font-bold tracking-wider">
          {interval}
        </span>
      </div>
    );
  });

  return (
    <div className="flex justify-center items-center py-6">
      {Object.keys(timeLeft).length ? timeComponents : <span className="text-xl font-bold text-white">Event Started!</span>}
    </div>
  );
};

export default function Airdrop() {
  const { user } = useUser();
  // Set target date to 30 days from now for demo purposes
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  const conditions = [
    { label: 'Minimum 10 Referrals', met: user.referrals >= 10, current: user.referrals, target: 10 },
    { label: 'Minimum 100 ESC Coin', met: user.escCoins >= 100, current: user.escCoins, target: 100 },
    { label: 'Active Last 30 Days', met: true, current: 'Active', target: 'Active' }, // Mock
    { label: '1M Global Users', met: false, current: '425K', target: '1M' },
  ];

  const allMet = conditions.every(c => c.met);

  return (
    <div className="min-h-screen pb-24 pt-16 px-4 max-w-lg mx-auto">
      <Header title="Airdrop Status" />

      {/* Hero Stats */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 neon-text-blue">
          1,000,000,000
        </h2>
        <p className="text-sm text-slate-400 font-medium tracking-widest uppercase mt-1">Total Supply (ESC)</p>
      </div>

      {/* Countdown Section */}
      <div className="glass-card p-6 rounded-2xl mb-8 border border-cyan-500/20 bg-gradient-to-b from-slate-900/80 to-slate-950/80">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Timer className="text-cyan-400 animate-pulse" size={18} />
          <h3 className="text-center text-sm font-bold text-cyan-400 uppercase tracking-widest">Airdrop Launch In</h3>
        </div>
        <CountdownTimer targetDate={targetDate} />
        <p className="text-center text-xs text-slate-500 mt-2">
          Phase 1 Snapshot is approaching. Complete tasks to qualify.
        </p>
      </div>

      {/* Tokenomics Chart */}
      <div className="glass-card p-4 rounded-2xl mb-8">
        <h3 className="text-center text-sm font-bold text-slate-300 mb-4">Token Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Eligibility Section */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Eligibility Criteria</h3>
        <div className="space-y-3">
          {conditions.map((item, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-1.5 rounded-full ${item.met ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.met ? <Check size={14} /> : <X size={14} />}
                </div>
                <span className="text-sm text-slate-200">{item.label}</span>
              </div>
              <span className={`text-xs font-mono ${item.met ? 'text-green-500' : 'text-slate-500'}`}>
                {item.current} / {item.target}
              </span>
            </div>
          ))}
        </div>

        <div className={`mt-4 p-4 rounded-xl text-center border ${allMet ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
          {allMet ? (
            <div>
              <p className="font-bold text-green-400 text-lg">You are Eligible! ✅</p>
              <p className="text-xs text-slate-400 mt-1">Distribution starts when global target is met.</p>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-slate-400">
              <Clock size={16} />
              <span className="text-sm">Complete all tasks to unlock</span>
            </div>
          )}
        </div>
      </div>

      {/* Value Estimate */}
      <div className="glass-card p-5 rounded-xl mb-8">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Estimated Value</h3>
        <div className="flex justify-between items-end border-b border-slate-700 pb-2 mb-2">
          <span className="text-xs text-slate-500">Min Price</span>
          <span className="text-base font-mono text-slate-200">$0.000002</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-xs text-slate-500">Max Price</span>
          <span className="text-base font-mono text-green-400">$0.10</span>
        </div>
        <div className="mt-3 flex items-start space-x-2">
          <AlertCircle size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-slate-500 leading-tight">
            Final token value depends on market liquidity, user activity, and total participants. Not a financial guarantee.
          </p>
        </div>
      </div>

      {/* Next Airdrop Teaser */}
      <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-6 text-center opacity-70 grayscale hover:grayscale-0 transition-all">
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-800 text-[10px] rounded text-slate-400 font-bold uppercase border border-slate-700">
          Coming Soon
        </div>
        <h3 className="text-xl font-bold text-slate-200 mb-1">ESC Airdrop #2</h3>
        <p className="text-xs text-slate-500">Supply: 400,000,000 ESC</p>
      </div>
    </div>
  );
}