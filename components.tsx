import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, Gift, Trophy, Calendar, User, Plane, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppRoute } from './types';

// --- Bottom Navigation ---
export const BottomNav = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dash', path: AppRoute.DASHBOARD },
    { icon: Users, label: 'Refer', path: AppRoute.REFER },
    { icon: Wallet, label: 'Wallet', path: AppRoute.WALLET },
    { icon: Plane, label: 'Airdrop', path: AppRoute.AIRDROP },
    { icon: Trophy, label: 'Leaders', path: AppRoute.LEADERBOARD },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-0.5 w-8 h-1 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

// --- Header ---
export const Header = ({ title, rightAction }: { title: string; rightAction?: React.ReactNode }) => (
  <header className="fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md z-40 border-b border-slate-800/50">
    <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
      <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        {title}
      </h1>
      {rightAction}
    </div>
  </header>
);

// --- Info Card ---
export const InfoCard = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass, 
  subLabel 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  colorClass: string;
  subLabel?: string;
}) => (
  <motion.div 
    whileHover={{ y: -2, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="glass-card p-4 rounded-xl flex flex-col justify-between h-full relative overflow-hidden group border border-white/5"
  >
    <div className={`absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
      <Icon size={80} />
    </div>
    <div className="flex items-center space-x-2 mb-2">
      <div className={`p-1.5 rounded-lg ${colorClass} bg-opacity-20`}>
        <Icon size={16} className={colorClass} />
      </div>
      <span className="text-xs text-slate-400 font-medium">{title}</span>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-slate-100 tracking-tight">{value}</h3>
      {subLabel && <p className="text-[10px] text-slate-500 mt-0.5">{subLabel}</p>}
    </div>
  </motion.div>
);

// --- Action Card ---
export const ActionCard = ({ 
  title, 
  subtitle, 
  buttonText, 
  onClick, 
  icon: Icon,
  gradient 
}: { 
  title: string; 
  subtitle: string; 
  buttonText: string; 
  onClick: () => void;
  icon: any;
  gradient: string;
}) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    className={`relative overflow-hidden rounded-2xl p-5 ${gradient} shadow-lg`}
  >
    <div className="relative z-10 flex items-center justify-between">
      <div className="flex-1 pr-4">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-xs text-white/80 mb-3 leading-relaxed">{subtitle}</p>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:bg-slate-100 transition-colors"
        >
          {buttonText}
        </motion.button>
      </div>
      <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
        <Icon size={32} className="text-white" />
      </div>
    </div>
  </motion.div>
);

// --- Button ---
export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  disabled = false
}: { 
  children?: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline'; 
  className?: string;
  disabled?: boolean;
}) => {
  const baseStyle = "w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20",
    secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700",
    outline: "border border-slate-700 text-slate-300 hover:bg-slate-800/50"
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};