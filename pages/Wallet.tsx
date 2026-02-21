import React, { useState } from 'react';
import { ArrowRightLeft, History, Lock, Wallet as WalletIcon, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context';
import { Header, Button } from '../components';

export default function Wallet() {
  const { user, transactions, convertCoins, withdrawCoins } = useUser();
  const [convertAmount, setConvertAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [withdrawMsg, setWithdrawMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleConvert = async () => {
    const amount = parseInt(convertAmount);
    if (isNaN(amount) || amount <= 0) {
      setMsg({ type: 'error', text: 'Enter valid amount' });
      return;
    }
    
    if (amount % 100 !== 0) {
      setMsg({ type: 'error', text: 'Amount must be multiple of 100' });
      return;
    }

    const success = await convertCoins(amount);
    if (success) {
      setMsg({ type: 'success', text: `Converted ${amount} Bonus to ${(amount / 100) * 5} ESC` });
      setConvertAmount('');
    } else {
      setMsg({ type: 'error', text: 'Insufficient balance' });
    }
  };

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawMsg({ type: 'error', text: 'Enter valid amount' });
      return;
    }

    // Ethereum address validation: starts with 0x and followed by 40 hex characters
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(withdrawAddress.trim())) {
      setWithdrawMsg({ type: 'error', text: 'Invalid Ethereum address format' });
      return;
    }

    const success = await withdrawCoins(amount, withdrawAddress);
    if (success) {
      setWithdrawMsg({ type: 'success', text: `Withdrawal of ${amount} ESC initiated` });
      setWithdrawAmount('');
      setWithdrawAddress('');
    } else {
      setWithdrawMsg({ type: 'error', text: 'Insufficient ESC balance' });
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-16 px-4 max-w-lg mx-auto">
      <Header title="Wallet" />

      {/* Bonus Wallet */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 rounded-xl mb-4 border-l-4 border-l-blue-500"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm text-slate-400">Bonus Balance</p>
            <h2 className="text-3xl font-bold text-white">{user.bonusCoins.toLocaleString()}</h2>
          </div>
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <WalletIcon className="text-blue-400" size={24} />
          </div>
        </div>
        <p className="text-xs text-slate-500">Can be converted to ESC</p>
      </motion.div>

      {/* ESC Wallet */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5 rounded-xl mb-6 border-l-4 border-l-green-500"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm text-slate-400">ESC Balance</p>
            <h2 className="text-3xl font-bold text-green-400">{user.escCoins.toLocaleString()}</h2>
          </div>
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Lock className="text-green-400" size={24} />
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] rounded font-bold uppercase">Locked</span>
          <p className="text-xs text-slate-500">Unlocks at Airdrop Launch</p>
        </div>
      </motion.div>

      {/* Conversion Tool */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
          <ArrowRightLeft size={16} className="mr-2" />
          Convert Bonus to ESC
        </h3>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 mb-4">
            <span>Rate: 100 Bonus = 5 ESC</span>
            <span>Max: {Math.floor(user.bonusCoins / 100) * 100}</span>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <input 
              type="number" 
              placeholder="Amount (e.g. 100)" 
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
            />
          </div>
          
          <Button onClick={handleConvert}>Convert Now</Button>
          
          <AnimatePresence>
            {msg && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`text-xs mt-2 text-center ${msg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
              >
                {msg.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Withdrawal Tool */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
          <Send size={16} className="mr-2" />
          Withdraw ESC
        </h3>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 mb-4">
            <span>Available: {user.escCoins} ESC</span>
          </div>
          
          <div className="space-y-3 mb-4">
            <input 
              type="number" 
              placeholder="Amount to withdraw" 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Recipient Address (0x...)" 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
            />
          </div>
          
          <Button onClick={handleWithdraw}>Withdraw Now</Button>
          
          <AnimatePresence>
            {withdrawMsg && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`text-xs mt-2 text-center ${withdrawMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
              >
                {withdrawMsg.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* History */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
          <History size={16} className="mr-2" />
          Transaction History
        </h3>
        <div className="space-y-2">
          {transactions.map((tx, idx) => (
            <motion.div 
              key={tx.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (idx * 0.05) }}
              className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center border border-slate-800/50"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'EARN' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                  {tx.type === 'EARN' ? '+' : '⇄'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">{tx.type}</p>
                  <p className="text-[10px] text-slate-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${tx.currency === 'ESC' ? 'text-green-400' : 'text-blue-400'}`}>
                  {tx.amount} {tx.currency}
                </p>
                <p className="text-[10px] text-slate-500">{tx.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}