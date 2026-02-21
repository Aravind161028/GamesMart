import { useState } from 'react';
import { usePayment } from '../../context/PaymentContext';
import { Settings, Save, AlertTriangle, ToggleLeft, ToggleRight, Database, Download, Lock } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const SystemSettings = () => {
  const { settings, updateSettings } = usePayment();
  const { hasRole, user } = useAuth();
  const [localUpi, setLocalUpi] = useState(settings.upiId);
  const [saved, setSaved] = useState(false);

  // Access Check: Only Owner and MD can view this page
  if (!hasRole(['owner', 'ceo', 'md'])) {
    return <div className="p-8 text-center text-gray-500">Access Restricted</div>;
  }

  const isCEO = user?.role === 'owner' || user?.role === 'ceo';

  const handleSave = () => {
    if (!isCEO) return;
    updateSettings({ upiId: localUpi });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleBackup = () => {
    if (!isCEO) return;
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `games_mart_backup_${new Date().toISOString()}.json`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Global UPI - CEO ONLY */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        {!isCEO && (
          <div className="absolute inset-0 bg-gray-100/50 dark:bg-black/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="bg-white dark:bg-dark-card px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-bold text-gray-500">
              <Lock size={16} /> Restricted to CEO
            </div>
          </div>
        )}
        
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Settings size={20} /> Global Payment Settings
        </h3>
        <div className="max-w-md">
          <label className="block text-sm font-bold mb-2">Primary UPI ID (Single)</label>
          <div className="flex gap-2">
            <input 
              value={localUpi}
              onChange={e => setLocalUpi(e.target.value)}
              disabled={!isCEO}
              className="flex-1 p-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 disabled:opacity-50"
              placeholder="merchant@upi"
            />
            <Button onClick={handleSave} className="gap-2" disabled={!isCEO}>
              {saved ? 'Saved!' : <><Save size={16} /> Save</>}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This UPI ID will be used to auto-generate QR codes for all payments.
          </p>
        </div>
      </div>

      {/* System Toggles - MD and CEO */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-orange-500" /> System Controls
        </h3>
        
        <div className="space-y-4 max-w-md">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div>
              <div className="font-bold text-sm">Game Uploads</div>
              <div className="text-xs text-gray-500">Allow staff to upload new games</div>
            </div>
            <button onClick={() => updateSettings({ enableUploads: !settings.enableUploads })} className="text-primary">
              {settings.enableUploads ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-400" />}
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div>
              <div className="font-bold text-sm">Payments</div>
              <div className="text-xs text-gray-500">Enable/Disable all purchase transactions</div>
            </div>
            <button onClick={() => updateSettings({ enablePayments: !settings.enablePayments })} className="text-primary">
              {settings.enablePayments ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-400" />}
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div>
              <div className="font-bold text-sm">User Registration</div>
              <div className="text-xs text-gray-500">Allow new users to sign up</div>
            </div>
            <button onClick={() => updateSettings({ enableRegistrations: !settings.enableRegistrations })} className="text-primary">
              {settings.enableRegistrations ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Database - CEO ONLY */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        {!isCEO && (
          <div className="absolute inset-0 bg-gray-100/50 dark:bg-black/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="bg-white dark:bg-dark-card px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-bold text-gray-500">
              <Lock size={16} /> Restricted to CEO
            </div>
          </div>
        )}
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Database size={20} /> Database Management
        </h3>
        <Button onClick={handleBackup} variant="outline" className="gap-2" disabled={!isCEO}>
          <Download size={16} /> Backup Database (JSON)
        </Button>
      </div>
    </div>
  );
};

export default SystemSettings;
