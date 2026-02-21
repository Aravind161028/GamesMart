import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, AppData, GlobalSettings } from '../types';
import { useAuth } from './AuthContext';
import { useGames } from './GameContext';
import { saveToPersistentStore, loadFromPersistentStore } from '../services/StorageService';

interface PaymentContextType {
  settings: GlobalSettings;
  updateSettings: (settings: Partial<GlobalSettings>) => void;
  transactions: Transaction[];
  initiatePurchase: (game: AppData) => Promise<string>;
  submitPaymentProof: (transactionId: string, userTxnId: string, screenshot?: string) => Promise<void>;
  verifyTransaction: (transactionId: string, reviewerId: string) => void;
  rejectTransaction: (transactionId: string, reviewerId: string, reason: string) => void;
  userPurchases: Transaction[];
  pendingTransactions: Transaction[];
  checkForFraud: (userTxnId: string) => boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const INITIAL_SETTINGS: GlobalSettings = {
  upiId: 'admin@upi',
  enableUploads: true,
  enablePayments: true,
  enableRegistrations: true
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, unlockGame, sendSystemNotification, flagUser } = useAuth();
  const { addRevenue } = useGames();
  
  const [settings, setSettings] = useState<GlobalSettings>(() => loadFromPersistentStore('games_mart_settings') || INITIAL_SETTINGS);
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadFromPersistentStore('games_mart_transactions') || []);

  useEffect(() => saveToPersistentStore('games_mart_settings', settings), [settings]);
  useEffect(() => saveToPersistentStore('games_mart_transactions', transactions), [transactions]);

  const updateSettings = (newSettings: Partial<GlobalSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const initiatePurchase = async (game: AppData) => {
    if (!user) throw new Error("User not logged in");
    if (!settings.enablePayments) throw new Error("Payments are currently disabled");
    
    const txId = `tx_${Date.now()}`;
    
    const newTx: Transaction = {
      id: txId,
      userId: user.id,
      userEmail: user.email,
      gameId: game.id,
      gameName: game.title,
      amount: game.price || 0,
      status: 'pending',
      date: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);
    return txId;
  };

  const checkForFraud = (userTxnId: string) => {
    // Check if this Transaction ID has been used before by ANY user
    return transactions.some(t => t.transactionId === userTxnId && t.status === 'verified');
  };

  const submitPaymentProof = async (transactionId: string, userTxnId: string, screenshot?: string) => {
    if (checkForFraud(userTxnId)) {
      if (user) flagUser(user.id);
      throw new Error("Duplicate Transaction ID detected. This ID has already been used.");
    }

    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          status: 'pending_verification',
          transactionId: userTxnId,
          screenshot: screenshot
        };
      }
      return t;
    }));
  };

  const verifyTransaction = (transactionId: string, reviewerId: string) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (tx) {
      setTransactions(prev => prev.map(t => t.id === transactionId ? { 
        ...t, 
        status: 'verified',
        reviewedBy: reviewerId,
        reviewedAt: new Date().toISOString()
      } : t));
      
      unlockGame(tx.userId, tx.gameId);
      addRevenue(tx.amount, tx.gameId);
      sendSystemNotification('Payment Approved', `Your purchase of ${tx.gameName} has been verified!`);
    }
  };

  const rejectTransaction = (transactionId: string, reviewerId: string, reason: string) => {
    setTransactions(prev => prev.map(t => t.id === transactionId ? { 
      ...t, 
      status: 'rejected',
      reviewedBy: reviewerId,
      reviewedAt: new Date().toISOString(),
      rejectionReason: reason
    } : t));
  };

  const userPurchases = transactions.filter(t => t.userId === user?.id);
  const pendingTransactions = transactions.filter(t => t.status === 'pending_verification');

  return (
    <PaymentContext.Provider value={{
      settings, updateSettings, transactions,
      initiatePurchase, submitPaymentProof, verifyTransaction, rejectTransaction,
      userPurchases, pendingTransactions, checkForFraud
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) throw new Error('usePayment must be used within PaymentProvider');
  return context;
};
