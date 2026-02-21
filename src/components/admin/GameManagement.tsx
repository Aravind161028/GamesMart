import { useState } from 'react';
import { useGames } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { Edit, Trash, Shield, Activity, EyeOff, AlertCircle, Gamepad2 } from 'lucide-react';
import Button from '../ui/Button';
import { AppData } from '../../types';

interface GameManagementProps {
  onEdit?: (app: AppData) => void;
}

const GameManagement = ({ onEdit }: GameManagementProps) => {
  const { apps, updateApp, deleteApp } = useGames();
  const { hasRole, user } = useAuth();
  
  // Permissions
  const canDelete = hasRole(['manager']); // Manager+
  const canEdit = hasRole(['staff']);     // Staff+
  const canApprove = hasRole(['tl']);     // TL+

  const handleStatusChange = (id: string, status: any) => {
    updateApp(id, { status });
  };

  const toggleVirusScan = (id: string, current: string) => {
    updateApp(id, { virusScanStatus: current === 'clean' ? 'pending' : 'clean' });
  };

  const toggleTechAnalysis = (id: string, current: string) => {
    updateApp(id, { techAnalysisStatus: current === 'passed' ? 'pending' : 'passed' });
  };

  const handleHardDelete = (id: string) => {
    if (confirm('Are you sure? This cannot be undone.')) {
      deleteApp(id);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-bold">Game Moderation & Management</h2>
        <div className="text-xs text-gray-500">
          Logged in as: <span className="font-bold uppercase">{user?.role}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Game</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Security</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {apps.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {app.icon && app.icon !== '' ? (
                      <img src={app.icon} className="w-10 h-10 rounded-lg object-cover" alt={app.title} />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Gamepad2 size={20} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{app.title}</div>
                      <div className="text-xs text-gray-500">{app.category} • Rating: {app.rating}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${app.status === 'published' ? 'bg-green-100 text-green-800' : 
                      app.status === 'removed' ? 'bg-red-100 text-red-800' : 
                      app.status === 'soft_deleted' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleVirusScan(app.id, app.virusScanStatus)}
                      className={`p-1 rounded ${app.virusScanStatus === 'clean' ? 'text-green-500 bg-green-50' : 'text-gray-400 bg-gray-100'}`}
                      title="Toggle Virus Scan"
                    >
                      <Shield size={16} />
                    </button>
                    <button 
                      onClick={() => toggleTechAnalysis(app.id, app.techAnalysisStatus)}
                      className={`p-1 rounded ${app.techAnalysisStatus === 'passed' ? 'text-blue-500 bg-blue-50' : 'text-gray-400 bg-gray-100'}`}
                      title="Toggle Tech Analysis"
                    >
                      <Activity size={16} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  {/* Edit Button - Available to all Staff+ */}
                  {canEdit && (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => onEdit?.(app)} 
                      className="text-xs"
                      title="Edit Game Details & Files"
                    >
                      <Edit size={14} />
                    </Button>
                  )}

                  {/* Approve Button - TL+ */}
                  {canApprove && app.status !== 'published' && (
                    <Button size="sm" variant="success" onClick={() => handleStatusChange(app.id, 'published')} className="text-xs">
                      Approve
                    </Button>
                  )}
                  
                  {/* Soft Delete - Manager+ */}
                  {app.status !== 'soft_deleted' && (
                    <div title={!canDelete ? "You don't have permission to hide games" : "Soft Delete"}>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => handleStatusChange(app.id, 'soft_deleted')} 
                        className="text-xs text-orange-500" 
                        disabled={!canDelete}
                      >
                        <EyeOff size={16}/>
                      </Button>
                    </div>
                  )}

                  {/* Hard Delete - Manager+ */}
                  <div title={!canDelete ? "You don't have permission to delete games" : "Permanent Delete"}>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => handleHardDelete(app.id)} 
                      className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                      disabled={!canDelete}
                    >
                      <Trash size={16}/>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameManagement;
