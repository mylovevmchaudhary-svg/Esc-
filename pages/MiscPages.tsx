import React, { useState } from 'react';
import { useUser } from '../context';
import { Header, Button, ActionCard } from '../components';
import { LogOut, User as UserIcon, Calendar, Gift } from 'lucide-react';

// --- Auth Page ---
export const Auth = () => {
  const { googleLogin, emailLogin, emailSignup } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await googleLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await emailLogin(email, password);
      } else {
        await emailSignup(email, password, username);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2 neon-text-blue">ESC</h1>
          <p className="text-slate-400">Join the future of rewards</p>
        </div>
        
        <div className="space-y-4">
          <Button onClick={handleGoogleLogin} variant="outline" className="bg-white text-slate-900 border-none hover:bg-slate-100">
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </span>
          </Button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink-0 mx-4 text-slate-600 text-xs">OR</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {!isLogin && (
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-cyan-500 outline-none transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-cyan-500 outline-none transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-cyan-500 outline-none transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <Button onClick={handleEmailAuth} disabled={loading || !email || !password || (!isLogin && !username)}>
            {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
          </Button>

          <p className="text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-400 font-bold hover:underline">
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
        
        <p className="text-center text-xs text-slate-600 mt-8">
          By joining, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

// --- Profile Page ---
export const Profile = () => {
  const { user, logout, requestNotificationPermission } = useUser();
  const [notificationStatus, setNotificationStatus] = useState(Notification.permission);

  const handleEnableNotifications = async () => {
    await requestNotificationPermission();
    setNotificationStatus(Notification.permission);
  };
  
  return (
    <div className="min-h-screen pb-24 pt-16 px-4 max-w-lg mx-auto">
      <Header title="My Profile" />
      
      <div className="flex flex-col items-center mb-8 pt-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 mb-4">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
             <UserIcon size={40} className="text-slate-300" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">{user.username}</h2>
        <p className="text-sm text-slate-500">Joined {user.joinedDate}</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-slate-900/50 p-4 rounded-xl flex justify-between items-center border border-slate-800">
          <span className="text-slate-400">Total Referrals</span>
          <span className="text-white font-bold">{user.referrals}</span>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-xl flex justify-between items-center border border-slate-800">
          <span className="text-slate-400">Total Ads Watched</span>
          <span className="text-white font-bold">{user.adsWatchedTotal}</span>
        </div>
        
        <div className="bg-slate-900/50 p-4 rounded-xl flex justify-between items-center border border-slate-800">
          <span className="text-slate-400">Notifications</span>
          {notificationStatus === 'granted' ? (
            <span className="text-green-400 font-bold text-sm">Enabled</span>
          ) : (
            <button 
              onClick={handleEnableNotifications}
              className="text-cyan-400 font-bold text-sm hover:underline"
            >
              Enable
            </button>
          )}
        </div>
      </div>

      <Button onClick={logout} variant="outline" className="text-red-400 border-red-900/30 hover:bg-red-900/10">
        <span className="flex items-center justify-center space-x-2">
          <LogOut size={16} /> <span>Sign Out</span>
        </span>
      </Button>
    </div>
  );
};

// --- Offers Page ---
export const Offers = () => (
  <div className="min-h-screen pb-24 pt-16 px-4 max-w-lg mx-auto">
    <Header title="Offers" />
    <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-50">
      <Gift size={48} className="mb-4 text-slate-600" />
      <h3 className="text-lg font-bold text-slate-300">No Offers Available</h3>
      <p className="text-sm text-slate-500">Check back later for new tasks.</p>
    </div>
  </div>
);

// --- Event Page ---
export const Event = () => (
  <div className="min-h-screen pb-24 pt-16 px-4 max-w-lg mx-auto">
    <Header title="Events" />
    
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl h-48 bg-gradient-to-r from-pink-600 to-purple-700 flex items-center p-6 shadow-lg shadow-purple-900/20">
        <div className="relative z-10">
          <span className="bg-white text-purple-700 text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">Live Now</span>
          <h2 className="text-2xl font-bold text-white mb-2">Double Rewards Week</h2>
          <p className="text-white/80 text-sm max-w-[70%]">Earn 2x coins on all ad views for the next 48 hours.</p>
        </div>
        <Calendar className="absolute right-[-20px] bottom-[-20px] text-white opacity-20" size={120} />
      </div>

       <div className="relative overflow-hidden rounded-2xl h-40 bg-slate-900 border border-slate-800 flex items-center p-6 grayscale">
        <div className="relative z-10">
          <span className="bg-slate-700 text-slate-400 text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">Ended</span>
          <h2 className="text-xl font-bold text-slate-400 mb-1">Launch Festival</h2>
          <p className="text-slate-600 text-sm">The event has concluded.</p>
        </div>
      </div>
    </div>
  </div>
);