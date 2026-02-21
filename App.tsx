import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { UserProvider, useUser } from './context';
import { BottomNav } from './components';
import { AppRoute } from './types';

// Pages
import Dashboard from './pages/Dashboard';
import Ads from './pages/Ads';
import Refer from './pages/Refer';
import Wallet from './pages/Wallet';
import Airdrop from './pages/Airdrop';
import Leaderboard from './pages/Leaderboard';
import { Auth, Profile, Offers, Event } from './pages/MiscPages';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useUser();
  if (!user.isLoggedIn) {
    return <Navigate to={AppRoute.LOGIN} replace />;
  }
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
};

const AppContent = () => {
  const { user } = useUser();
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        <Routes location={location}>
          <Route path={AppRoute.LOGIN} element={!user.isLoggedIn ? <Auth /> : <Navigate to={AppRoute.DASHBOARD} />} />
          
          <Route path={AppRoute.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path={AppRoute.ADS} element={<ProtectedRoute><Ads /></ProtectedRoute>} />
          <Route path={AppRoute.REFER} element={<ProtectedRoute><Refer /></ProtectedRoute>} />
          <Route path={AppRoute.WALLET} element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path={AppRoute.AIRDROP} element={<ProtectedRoute><Airdrop /></ProtectedRoute>} />
          <Route path={AppRoute.LEADERBOARD} element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path={AppRoute.OFFERS} element={<ProtectedRoute><Offers /></ProtectedRoute>} />
          <Route path={AppRoute.EVENT} element={<ProtectedRoute><Event /></ProtectedRoute>} />
          <Route path={AppRoute.PROFILE} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to={AppRoute.DASHBOARD} />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HashRouter>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </HashRouter>
  );
}