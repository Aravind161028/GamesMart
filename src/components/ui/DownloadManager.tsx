import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Pause, Play, X, ChevronUp, ChevronDown, CheckCircle, FolderOpen } from 'lucide-react';
import { useDownloads } from '../../context/DownloadContext';
import Button from './Button';

const DownloadManager = () => {
  const { tasks, pauseDownload, resumeDownload, cancelDownload, installGame } = useDownloads();
  const [isExpanded, setIsExpanded] = useState(true);

  if (tasks.length === 0) return null;

  const activeTasks = tasks.filter(t => t.status !== 'installed');
  if (activeTasks.length === 0) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSec: number) => {
    return `${formatBytes(bytesPerSec)}/s`;
  };

  return (
    <div className="fixed bottom-0 right-4 z-50 w-full max-w-md">
      <div className="bg-white dark:bg-dark-card shadow-2xl rounded-t-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div 
          className="bg-gray-900 text-white p-3 flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Download size={18} className="text-primary" />
            <span className="font-bold text-sm">Downloads ({activeTasks.length})</span>
          </div>
          <button className="text-gray-400 hover:text-white">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>

        {/* List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="max-h-80 overflow-y-auto"
            >
              {activeTasks.map(task => {
                const progress = (task.downloadedBytes / task.totalBytes) * 100;
                const isCompleted = task.status === 'completed';
                const isPaused = task.status === 'paused';

                return (
                  <div key={task.id} className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex gap-3">
                      {task.gameIcon && task.gameIcon !== '' ? (
                        <img src={task.gameIcon} className="w-12 h-12 rounded-lg object-cover bg-gray-800" alt={task.gameTitle} />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
                          <Download size={20} className="text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate" title={task.gameTitle}>
                            {task.gameTitle}
                          </h4>
                          <span className="text-xs text-gray-500 uppercase">{task.platform}</span>
                        </div>
                        
                        {isCompleted ? (
                          <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                            <CheckCircle size={12} /> Ready to Install
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full ${isPaused ? 'bg-yellow-500' : 'bg-primary'}`}
                                style={{ width: `${progress}%` }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear" }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500">
                              <span>{formatBytes(task.downloadedBytes)} / {formatBytes(task.totalBytes)}</span>
                              {!isPaused && <span>{formatSpeed(task.speed)}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                      {isCompleted ? (
                        <Button size="sm" variant="success" onClick={() => installGame(task.id)} className="h-7 text-xs gap-1">
                          <FolderOpen size={12} /> {task.platform === 'android' ? 'Install' : 'Open Folder'}
                        </Button>
                      ) : (
                        <>
                          {isPaused ? (
                            <button onClick={() => resumeDownload(task.id)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                              <Play size={14} />
                            </button>
                          ) : (
                            <button onClick={() => pauseDownload(task.id)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                              <Pause size={14} />
                            </button>
                          )}
                          <button onClick={() => cancelDownload(task.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500">
                            <X size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DownloadManager;
