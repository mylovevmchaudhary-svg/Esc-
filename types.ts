export interface Referral {
  username: string;
  date: string;
  status: 'Active' | 'Inactive';
}

export interface UserState {
  isLoggedIn: boolean;
  username: string;
  joinedDate: string;
  bonusCoins: number;
  escCoins: number;
  todayEarned: number;
  todayEscEarned: number;
  totalEscEarned: number;
  referrals: number;
  adsWatchedDaily: number;
  adsWatchedTotal: number;
  lastDailyReset: string;
}

export interface Transaction {
  id: string;
  type: 'EARN' | 'CONVERT' | 'WITHDRAW' | 'REFERRAL' | 'BONUS';
  amount: number;
  currency: 'BONUS' | 'ESC';
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'LOCKED';
}

export enum AppRoute {
  DASHBOARD = '/',
  REFER = '/refer',
  WALLET = '/wallet',
  OFFERS = '/offers',
  AIRDROP = '/airdrop',
  LEADERBOARD = '/leaderboard',
  EVENT = '/event',
  PROFILE = '/profile',
  ADS = '/ads',
  LOGIN = '/login'
}

export const CONSTANTS = {
  DAILY_AD_LIMIT: 500,
  AD_REWARD_MIN: 15,
  AD_REWARD_MAX: 40,
  CONVERSION_RATE: 20, // 100 Bonus = 5 ESC => 20 Bonus = 1 ESC
  AIRDROP_TOTAL_SUPPLY: 1000000000,
};