import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DownloadTask, DownloadStatus, PlatformType } from '../types';
import { saveToPersistentStore, loadFromPersistentStore } from '../services/StorageService';
import { useGames } from './GameContext';

interface DownloadContextType {
  tasks: DownloadTask[];
  startDownload: (gameId: string, gameTitle: string, gameIcon: string, platform: PlatformType, url: string, sizeBytes: number) => void;
  pauseDownload: (taskId: string) => void;
  resumeDownload: (taskId: string) => void;
  cancelDownload: (taskId: string) => void;
  clearCompleted: () => void;
  getTask: (gameId: string) => DownloadTask | undefined;
  installGame: (taskId: string) => void;
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

export const DownloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<DownloadTask[]>(() => loadFromPersistentStore('games_mart_downloads_queue') || []);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTime = useRef<number>(0);
  const { incrementInstall } = useGames();

  // Fix: Throttle storage writes to prevent QuotaExceededError
  useEffect(() => {
    const now = Date.now();
    if (now - lastSaveTime.current > 2000) {
      try {
        saveToPersistentStore('games_mart_downloads_queue', tasks);
        lastSaveTime.current = now;
      } catch (error) {
        console.warn('Storage quota exceeded, skipping save to prevent crash');
      }
    }
  }, [tasks]);

  // Simulation Loop
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTasks(prevTasks => {
        let hasChanges = false;
        const newTasks = prevTasks.map(task => {
          if (task.status === 'downloading') {
            hasChanges = true;
            // Simulate variable speed (2MB/s to 10MB/s)
            const speed = Math.floor(Math.random() * (1024 * 1024 * 8)) + (1024 * 1024 * 2); 
            const increment = speed / 10; // 100ms interval
            
            let newDownloaded = task.downloadedBytes + increment;
            let newStatus = task.status;

            if (newDownloaded >= task.totalBytes) {
              newDownloaded = task.totalBytes;
              newStatus = 'completed';
            }

            return {
              ...task,
              downloadedBytes: newDownloaded,
              speed: speed,
              status: newStatus
            };
          }
          return task;
        });
        return hasChanges ? newTasks : prevTasks;
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startDownload = (gameId: string, gameTitle: string, gameIcon: string, platform: PlatformType, url: string, sizeBytes: number) => {
    const taskId = `${gameId}-${platform}`;
    
    setTasks(prev => {
      const existing = prev.find(t => t.id === taskId);
      if (existing) {
        if (existing.status === 'paused' || existing.status === 'error') {
          return prev.map(t => t.id === taskId ? { ...t, status: 'downloading', error: undefined } : t);
        }
        return prev;
      }

      const newTask: DownloadTask = {
        id: taskId,
        gameId, gameTitle, gameIcon, platform, url,
        totalBytes: sizeBytes || 1024 * 1024 * 500, // Default 500MB if unknown
        downloadedBytes: 0,
        status: 'downloading',
        speed: 0,
        startTime: Date.now()
      };
      return [...prev, newTask];
    });
  };

  const pauseDownload = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'paused', speed: 0 } : t));
  };

  const resumeDownload = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'downloading' } : t));
  };

  const cancelDownload = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => t.status !== 'completed' && t.status !== 'installed'));
  };

  const installGame = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'installed' } : t));
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      incrementInstall(task.gameId);
      if (task.url && task.url !== '#') {
        window.open(task.url, '_blank');
      }
    }
  };

  const getTask = (gameId: string) => tasks.find(t => t.gameId === gameId);

  return (
    <DownloadContext.Provider value={{
      tasks, startDownload, pauseDownload, resumeDownload, cancelDownload, clearCompleted, getTask, installGame
    }}>
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownloads = () => {
  const context = useContext(DownloadContext);
  if (context === undefined) throw new Error('useDownloads must be used within DownloadProvider');
  return context;
};
