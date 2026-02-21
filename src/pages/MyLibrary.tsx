import { useAuth } from '../context/AuthContext';
import { useGames } from '../context/GameContext';
import { useDownloads } from '../context/DownloadContext';
import { Link } from 'react-router-dom';
import { Download, Play, FolderOpen, Gamepad2, Clock, HardDrive } from 'lucide-react';
import Button from '../components/ui/Button';
import { PlatformType } from '../types';
import { useOS } from '../hooks/useOS';

const MyLibrary = () => {
  const { user } = useAuth();
  const { apps } = useGames();
  const { getTask, startDownload, installGame } = useDownloads();
  const os = useOS();

  if (!user) return <div>Please login</div>;

  const purchasedGames = apps.filter(app => user.purchasedGameIds?.includes(app.id));

  const handleAction = (game: any) => {
    const task = getTask(game.id);
    const platform = os === 'unknown' ? 'windows' : os as PlatformType;
    const platformInfo = game.platforms.find((p: any) => p.type === platform) || game.platforms[0];

    if (!task) {
      // Start Download
      startDownload(game.id, game.title, game.icon, platform, platformInfo.downloadUrl, platformInfo.sizeBytes || 0);
    } else if (task.status === 'completed') {
      installGame(task.id);
    } else if (task.status === 'installed') {
      alert(`Launching ${game.title}...`);
    }
  };

  const getStatusButton = (gameId: string) => {
    const task = getTask(gameId);
    if (!task) return <Button size="sm" fullWidth className="gap-2"><Download size={14} /> Download</Button>;
    
    switch (task.status) {
      case 'downloading': return <Button size="sm" fullWidth variant="secondary" disabled className="gap-2"><Download size={14} className="animate-bounce" /> Downloading...</Button>;
      case 'paused': return <Button size="sm" fullWidth variant="secondary" className="gap-2">Paused</Button>;
      case 'completed': return <Button size="sm" fullWidth variant="success" className="gap-2"><FolderOpen size={14} /> Install</Button>;
      case 'installed': return <Button size="sm" fullWidth variant="primary" className="gap-2"><Play size={14} /> Play</Button>;
      default: return <Button size="sm" fullWidth><Download size={14} /> Download</Button>;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#1b2838] text-gray-200">
      <div className="container">
        <div className="flex justify-between items-end mb-8 border-b border-gray-700 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Gamepad2 className="text-blue-500" /> Library
            </h1>
            <p className="text-gray-400 text-sm">Manage your installed games and downloads</p>
          </div>
          <div className="flex gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2"><HardDrive size={16} /> 450 GB Free</div>
            <div className="flex items-center gap-2"><Clock size={16} /> 12h Played</div>
          </div>
        </div>

        {purchasedGames.length === 0 ? (
          <div className="text-center py-32 bg-[#171a21] rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold mb-2 text-white">Your library is empty</h3>
            <p className="text-gray-500 mb-6">Games you purchase or download will appear here.</p>
            <Link to="/store">
              <Button variant="primary">Visit Store</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {purchasedGames.map(game => (
              <div key={game.id} className="group bg-[#171a21] hover:bg-[#2a475e] transition-colors duration-300 rounded-lg overflow-hidden shadow-lg border border-transparent hover:border-blue-500/50 relative">
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img src={game.banner || game.icon} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171a21] to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="font-bold text-white mb-1 truncate">{game.title}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                       <span>{game.category}</span>
                       <span className="bg-gray-800 px-1.5 py-0.5 rounded text-[10px] uppercase">{os}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-[#171a21] group-hover:bg-[#2a475e] transition-colors border-t border-gray-800">
                  <div onClick={() => handleAction(game)}>
                    {getStatusButton(game.id)}
                  </div>
                  <div className="mt-2 text-[10px] text-center text-gray-500 group-hover:text-gray-300">
                    Last played: Never
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibrary;
