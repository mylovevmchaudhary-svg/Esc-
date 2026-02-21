import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserState, Transaction, Referral } from './types';
import { db, auth, messaging, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getToken, onMessage } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface UserContextType {
  user: UserState;
  transactions: Transaction[];
  referralsList: Referral[];
  login: (username: string) => void; // Deprecated, kept for compatibility
  googleLogin: () => Promise<void>;
  emailLogin: (email: string, pass: string) => Promise<void>;
  emailSignup: (email: string, pass: string, username: string) => Promise<void>;
  logout: () => void;
  addBonusCoins: (amount: number, source: string) => Promise<void>;
  convertCoins: (bonusAmount: number) => Promise<boolean>;
  withdrawCoins: (amount: number, address: string) => Promise<boolean>;
  claimAd: (reward: number) => Promise<{ success: boolean }>;
  requestNotificationPermission: () => Promise<void>;
}

const defaultUser: UserState = {
  isLoggedIn: false,
  username: '',
  joinedDate: '',
  bonusCoins: 0,
  escCoins: 0,
  todayEarned: 0,
  todayEscEarned: 0,
  totalEscEarned: 0,
  referrals: 5, // Mock initial referrals
  adsWatchedDaily: 0,
  adsWatchedTotal: 0,
  lastDailyReset: new Date().toISOString().split('T')[0],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState>(defaultUser);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'EARN', amount: 50, currency: 'BONUS', date: '2023-10-24', status: 'COMPLETED' },
    { id: '2', type: 'REFERRAL', amount: 500, currency: 'ESC', date: '2023-10-25', status: 'LOCKED' },
  ]);
  const [referralsList, setReferralsList] = useState<Referral[]>([
    { username: 'CryptoFan123', date: '2023-11-01', status: 'Active' },
    { username: 'BlockchainDev', date: '2023-11-05', status: 'Active' },
    { username: 'NewbieTrader', date: '2023-11-10', status: 'Inactive' },
    { username: 'HODL_Life', date: '2023-11-15', status: 'Active' },
    { username: 'MoonSoon', date: '2023-11-20', status: 'Active' },
  ]);

  // Listen to Auth State
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user data from Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data() as UserState;
          const today = new Date().toISOString().split('T')[0];
          
          // Check for daily reset
          if (userData.lastDailyReset !== today) {
            const updatedData = {
              ...userData,
              adsWatchedDaily: 0,
              todayEarned: 0,
              todayEscEarned: 0,
              lastDailyReset: today
            };
            await updateDoc(userRef, {
              adsWatchedDaily: 0,
              todayEarned: 0,
              todayEscEarned: 0,
              lastDailyReset: today
            });
            setUser({ ...updatedData, isLoggedIn: true });
          } else {
            setUser({ ...userData, isLoggedIn: true });
          }
        } else {
          // New user via Google Login or similar
          const newUser: UserState = {
            ...defaultUser,
            isLoggedIn: true,
            username: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            joinedDate: new Date().toLocaleDateString(),
            bonusCoins: 1200,
            escCoins: 50,
            totalEscEarned: 50,
            lastDailyReset: new Date().toISOString().split('T')[0],
          };
          await setDoc(userRef, newUser);
          setUser(newUser);
        }
      } else {
        setUser(defaultUser);
        setTransactions([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle Foreground Messages
  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        // You can add a toast notification here if you want
      });
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!messaging) return;
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY_HERE" }); // Replace with your VAPID key if you have one, or remove options if not needed yet
        console.log("FCM Token:", token);
        // Optionally save this token to the user's document in Firestore
        if (user.username && db) {
           // Logic to save token
        }
      }
    } catch (error) {
      console.error("Unable to get permission to notify.", error);
    }
  };

  const sendLocalNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body
      });
    }
  };

  const googleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };


  const emailLogin = async (email: string, pass: string) => {
    if (!auth) return;
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const emailSignup = async (email: string, pass: string, username: string) => {
    if (!auth) return;
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Create user doc
    const userRef = doc(db, 'users', cred.user.uid);
    const newUser: UserState = {
      ...defaultUser,
      isLoggedIn: true,
      username,
      joinedDate: new Date().toLocaleDateString(),
      bonusCoins: 1200,
      escCoins: 50,
    };
    await setDoc(userRef, newUser);
    setUser(newUser);
  };

  const login = async (username: string) => {
    // Legacy support or local fallback
    if (db && !auth) {
       // ... existing logic
    } else {
       // ... existing logic
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(defaultUser);
    if (!db) setTransactions([]);
  };

  const addBonusCoins = async (amount: number, source: string) => {
    if (db && user.username) {
      // Firebase Update
      const userRef = doc(db, 'users', user.username);
      await updateDoc(userRef, {
        bonusCoins: user.bonusCoins + amount,
        todayEarned: user.todayEarned + amount
      });

      await addDoc(collection(db, 'transactions'), {
        username: user.username,
        type: 'EARN',
        amount,
        currency: 'BONUS',
        date: new Date().toISOString(),
        status: 'COMPLETED',
        source
      });
    } else {
      // Local Update
      setUser(prev => ({
        ...prev,
        bonusCoins: prev.bonusCoins + amount,
        todayEarned: prev.todayEarned + amount,
      }));
      setTransactions(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'EARN',
        amount,
        currency: 'BONUS',
        date: new Date().toLocaleDateString(),
        status: 'COMPLETED'
      }, ...prev]);
    }
    
    // Notify user
    sendLocalNotification("Bonus Earned!", `You received ${amount} Bonus Coins from ${source}.`);
  };

  const convertCoins = async (bonusAmount: number): Promise<boolean> => {
    if (user.bonusCoins < bonusAmount) return false;
    const escAmount = (bonusAmount / 100) * 5;

    if (db && user.username) {
      // Firebase Update
      const userRef = doc(db, 'users', user.username);
      await updateDoc(userRef, {
        bonusCoins: user.bonusCoins - bonusAmount,
        escCoins: user.escCoins + escAmount,
        todayEscEarned: (user.todayEscEarned || 0) + escAmount,
        totalEscEarned: (user.totalEscEarned || 0) + escAmount
      });

      await addDoc(collection(db, 'transactions'), {
        username: user.username,
        type: 'CONVERT',
        amount: escAmount,
        currency: 'ESC',
        date: new Date().toISOString(),
        status: 'COMPLETED'
      });
    } else {
      // Local Update
      setUser(prev => ({
        ...prev,
        bonusCoins: prev.bonusCoins - bonusAmount,
        escCoins: prev.escCoins + escAmount,
        todayEscEarned: (prev.todayEscEarned || 0) + escAmount,
        totalEscEarned: (prev.totalEscEarned || 0) + escAmount
      }));

      setTransactions(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'CONVERT',
        amount: escAmount,
        currency: 'ESC',
        date: new Date().toLocaleDateString(),
        status: 'COMPLETED'
      }, ...prev]);
    }

    return true;
  };

  const withdrawCoins = async (amount: number, address: string): Promise<boolean> => {
    if (user.escCoins < amount) return false;

    if (db && user.username) {
      // Firebase Update
      const userRef = doc(db, 'users', user.username);
      await updateDoc(userRef, {
        escCoins: user.escCoins - amount
      });

      await addDoc(collection(db, 'transactions'), {
        username: user.username,
        type: 'WITHDRAW',
        amount: amount,
        currency: 'ESC',
        date: new Date().toISOString(),
        status: 'PENDING',
        address
      });
    } else {
      // Local Update
      setUser(prev => ({
        ...prev,
        escCoins: prev.escCoins - amount,
      }));

      setTransactions(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'WITHDRAW',
        amount: amount,
        currency: 'ESC',
        date: new Date().toLocaleDateString(),
        status: 'PENDING'
      }, ...prev]);
    }

    return true;
  };

  const claimAd = async (reward: number) => {
    if (user.adsWatchedDaily >= 500) return { success: false };

    const newDaily = user.adsWatchedDaily + 1;
    const newTotal = user.adsWatchedTotal + 1;
    let extraEsc = 0;

    if (newDaily === 500) extraEsc += 1000;
    if (newTotal === 1000) extraEsc += 100;

    if (db && user.username) {
      // Firebase Update
      const userRef = doc(db, 'users', user.username);
      await updateDoc(userRef, {
        adsWatchedDaily: newDaily,
        adsWatchedTotal: newTotal,
        bonusCoins: user.bonusCoins + reward,
        escCoins: user.escCoins + extraEsc,
        todayEarned: user.todayEarned + reward,
        todayEscEarned: (user.todayEscEarned || 0) + extraEsc,
        totalEscEarned: (user.totalEscEarned || 0) + extraEsc
      });
    } else {
      // Local Update
      setUser(prev => ({
        ...prev,
        adsWatchedDaily: newDaily,
        adsWatchedTotal: newTotal,
        bonusCoins: prev.bonusCoins + reward,
        escCoins: prev.escCoins + extraEsc,
        todayEarned: prev.todayEarned + reward,
        todayEscEarned: (prev.todayEscEarned || 0) + extraEsc,
        totalEscEarned: (prev.totalEscEarned || 0) + extraEsc
      }));
    }

    // Notify user
    sendLocalNotification("Ad Reward Claimed!", `You earned ${reward} Bonus Coins.`);
    if (extraEsc > 0) {
      sendLocalNotification("Milestone Reached!", `You earned an extra ${extraEsc} ESC Coins!`);
    }

    return { success: true };
  };

  return (
    <UserContext.Provider value={{ user, transactions, referralsList, login, googleLogin, emailLogin, emailSignup, logout, addBonusCoins, convertCoins, withdrawCoins, claimAd, requestNotificationPermission }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};