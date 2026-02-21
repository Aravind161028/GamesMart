import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData, Partner, DownloadRecord, PlatformType } from '../types';
import { APPS as INITIAL_APPS } from '../data/mockData';
import { useAuth } from './AuthContext';
import { saveToPersistentStore, loadFromPersistentStore } from '../services/StorageService';

interface GameContextType {
  apps: AppData[];
  partners: Partner[];
  downloadHistory: DownloadRecord[];
  addApp: (app: AppData) => void;
  deleteApp: (id: string) => void;
  updateApp: (id: string, updates: Partial<AppData>) => void;
  getAppById: (id: string) => AppData | undefined;
  incrementDownload: (id: string, platform: PlatformType) => void;
  incrementInstall: (id: string) => void;
  trackView: (id: string) => void;
  trendingApps: AppData[];
  getRecommendedApps: (limit?: number) => AppData[];
  getSimilarApps: (currentAppId: string, limit?: number) => AppData[];
  addPartner: (partner: Partner) => void;
  togglePartner: (id: string) => void;
  totalRevenue: number;
  addRevenue: (amount: number, gameId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_PARTNERS: Partner[] = [
  { id: '1', name: 'Tencent Games', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Tencent_Games_Logo.svg/1200px-Tencent_Games_Logo.svg.png', enabled: true },
  { id: '2', name: 'Ubisoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Ubisoft_logo.svg/2560px-Ubisoft_logo.svg.png', enabled: true },
  { id: '3', name: 'Gameloft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Gameloft_Logo_Flat.png/800px-Gameloft_Logo_Flat.png', enabled: true },
  { id: '4', name: 'Supercell', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Supercell_logo.svg/1200px-Supercell_logo.svg.png', enabled: true },
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, addAuditLog } = useAuth();
  
  const [apps, setApps] = useState<AppData[]>(() => loadFromPersistentStore('games_mart_data') || INITIAL_APPS);
  const [partners, setPartners] = useState<Partner[]>(() => loadFromPersistentStore('games_mart_partners') || INITIAL_PARTNERS);
  const [downloadHistory, setDownloadHistory] = useState<DownloadRecord[]>(() => loadFromPersistentStore('games_mart_downloads') || []);

  useEffect(() => saveToPersistentStore('games_mart_data', apps), [apps]);
  useEffect(() => saveToPersistentStore('games_mart_partners', partners), [partners]);
  useEffect(() => saveToPersistentStore('games_mart_downloads', downloadHistory), [downloadHistory]);

  const addApp = (app: AppData) => {
    // Ensure uploadDate is set
    const appWithDate = {
      ...app,
      uploadDate: app.uploadDate || new Date().toISOString().split('T')[0],
      installCount: 0
    };
    setApps(prev => [appWithDate, ...prev]);
    addAuditLog('GAME_UPLOAD', `Uploaded new game: ${app.title}`);
  };

  const deleteApp = (id: string) => {
    const app = getAppById(id);
    setApps(prev => prev.filter(a => a.id !== id));
    addAuditLog('GAME_DELETE', `Deleted game: ${app?.title || id}`);
  };

  const updateApp = (id: string, updates: Partial<AppData>) => {
    setApps(prev => prev.map(a => {
      if (a.id === id) {
        // Version Archiving Logic
        let newVersionHistory = a.versionHistory || [];
        
        // If platforms are being updated (new file upload)
        if (updates.platforms && JSON.stringify(updates.platforms) !== JSON.stringify(a.platforms)) {
          // Archive current platforms to history
          newVersionHistory = [...newVersionHistory, ...a.platforms];
        }

        return { 
          ...a, 
          ...updates, 
          versionHistory: newVersionHistory,
          updatedDate: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    }));
    addAuditLog('GAME_UPDATE', `Updated game: ${id}`);
  };

  const getAppById = (id: string) => apps.find(a => a.id === id);

  const incrementDownload = (id: string, platform: PlatformType) => {
    setApps(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          downloadCount: (app.downloadCount || 0) + 1,
          weeklyDownloadCount: (app.weeklyDownloadCount || 0) + 1,
          lastDownloadedAt: new Date().toISOString()
        };
      }
      return app;
    }));

    if (user) {
      const record: DownloadRecord = {
        id: Date.now().toString(),
        gameId: id,
        gameName: getAppById(id)?.title || 'Unknown',
        platform,
        userId: user.id,
        date: new Date().toISOString()
      };
      setDownloadHistory(prev => [record, ...prev]);
    }
  };

  const incrementInstall = (id: string) => {
    setApps(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          installCount: (app.installCount || 0) + 1
        };
      }
      return app;
    }));
  };
  
  const trackView = (id: string) => {
    console.log(`[Analytics] User viewed app ${id}`);
  };

  const addRevenue = (amount: number, gameId: string) => {
    setApps(prev => prev.map(a => a.id === gameId ? { ...a, revenue: (a.revenue || 0) + amount } : a));
  };

  const totalRevenue = apps.reduce((acc, app) => acc + (app.revenue || 0), 0);

  const getRecommendedApps = (limit = 6) => {
    if (!user) return apps.filter(a => a.isFeatured || a.isPopular).slice(0, limit);
    const historyIds = [...(user.history || []), ...(user.viewHistory || [])];
    const candidates = apps.filter(a => !historyIds.includes(a.id));
    return candidates.sort((a, b) => b.rating - a.rating).slice(0, limit);
  };

  const getSimilarApps = (currentAppId: string, limit = 4) => {
    const currentApp = getAppById(currentAppId);
    if (!currentApp) return [];
    return apps.filter(a => a.id !== currentAppId && a.category === currentApp.category).slice(0, limit);
  };

  const addPartner = (partner: Partner) => setPartners(prev => [...prev, partner]);
  const togglePartner = (id: string) => setPartners(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  
  const trendingApps = [...apps].sort((a, b) => (b.weeklyDownloadCount || 0) - (a.weeklyDownloadCount || 0)).slice(0, 5);

  return (
    <GameContext.Provider value={{ 
      apps, partners, downloadHistory, addApp, deleteApp, updateApp, getAppById, incrementDownload, incrementInstall, trackView,
      trendingApps, getRecommendedApps, getSimilarApps, addPartner, togglePartner, totalRevenue, addRevenue
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGames = () => {
  const context = useContext(GameContext);
  if (context === undefined) throw new Error('useGames must be used within a GameProvider');
  return context;
};
