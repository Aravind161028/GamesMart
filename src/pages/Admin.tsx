import { useState } from 'react';
import { Upload, Plus, X, Image as ImageIcon, LayoutGrid, ShieldAlert, Users, Settings, FileText, Database, Globe, Star, IndianRupee, Bell, BarChart3 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useGames } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { AppData, PlatformInfo, PlatformType } from '../types';
import PlatformIcon from '../components/ui/PlatformIcon';
import Inbox from '../components/admin/Inbox';
import UserManagement from '../components/admin/UserManagement';
import TeamManagement from '../components/admin/TeamManagement';
import SystemSettings from '../components/admin/SystemSettings';
import PendingPayments from '../components/admin/PendingPayments';
import GameManagement from '../components/admin/GameManagement';
import DatabaseDashboard from '../components/admin/DatabaseDashboard';
import Notifications from '../components/admin/Notifications';
import Analytics from '../components/admin/Analytics';
import ChunkedUploader from '../components/admin/ChunkedUploader';
import { uploadToCloud } from '../services/StorageService';

const Admin = () => {
  const { addApp, updateApp } = useGames();
  const { user, sendSystemNotification, hasRole } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const initialFormState: Partial<AppData> = {
    title: '', developer: '', category: 'Action', description: '', icon: '', banner: '',
    platforms: [], screenshots: [], isPremium: false, price: 0, isMod: false, 
    status: 'pending_review', virusScanStatus: 'pending', techAnalysisStatus: 'pending',
    rating: 4.5
  };

  const [formData, setFormData] = useState<Partial<AppData>>(initialFormState);

  const [platformInput, setPlatformInput] = useState<PlatformInfo>({
    type: 'android', version: '1.0.0', size: '0 MB', downloadUrl: '', minOs: 'Android 8.0', isHosted: true
  });
  
  const [iconPreview, setIconPreview] = useState<string>('');

  const handleEditGame = (app: AppData) => {
    setFormData(app);
    setIconPreview(app.icon || '');
    setEditingId(app.id);
    setIsFormOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadToCloud(e.target.files[0]);
      setIconPreview(url);
      setFormData({ ...formData, icon: url });
    }
  };

  // Callback for ChunkedUploader
  const handleFileComplete = (url: string, sizeBytes: number, fileName: string) => {
    setPlatformInput({
      ...platformInput,
      downloadUrl: url,
      size: `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`,
      sizeBytes: sizeBytes,
      originalFileName: fileName,
      isHosted: true
    });
  };

  const addPlatform = () => {
    if (!platformInput.downloadUrl) {
      alert("Please upload a file first.");
      return;
    }
    const currentPlatforms = formData.platforms || [];
    const filtered = currentPlatforms.filter(p => p.type !== platformInput.type);
    
    setFormData({ ...formData, platforms: [...filtered, platformInput] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.isPremium && (!formData.price || formData.price <= 0)) {
      alert("Please enter a valid price in INR for Premium games.");
      return;
    }

    if (editingId) {
      updateApp(editingId, {
        ...formData,
        updatedDate: new Date().toISOString().split('T')[0] // Auto update date
      });
      sendSystemNotification('Game Updated', `${formData.title} has been updated successfully.`);
    } else {
      // Auto-publish for Manager+
      const initialStatus = hasRole(['manager']) ? 'published' : 'pending_review';
      const newApp: AppData = {
        ...formData as AppData,
        id: Date.now().toString(),
        downloads: '0', downloadCount: 0, weeklyDownloadCount: 0,
        updatedDate: new Date().toISOString().split('T')[0],
        status: initialStatus,
        uploadedBy: user?.id
      };
      addApp(newApp);
      sendSystemNotification('New Game Uploaded', `${newApp.title} is ${initialStatus === 'published' ? 'live' : 'pending approval'}.`);
    }

    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
    setIconPreview('');
  };

  const openNewUpload = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIconPreview('');
    setIsFormOpen(true);
  };

  // Role-based Views
  const isStaff = user?.role === 'staff';
  const isTL = user?.role === 'tl';
  const isManager = user?.role === 'manager';
  const isMD = ['md', 'owner', 'ceo'].includes(user?.role || '');
  const isCEO = ['owner', 'ceo'].includes(user?.role || '');

  return (
    <div className="min-h-screen pt-24 pb-12 bg-light-bg dark:bg-dark-bg">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Control Panel
            </h1>
            <p className="text-sm text-gray-500">
              {user?.username} {isCEO ? '(CEO)' : `| ${user?.role.toUpperCase()}`}
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={openNewUpload} variant="primary" className="gap-2">
              <Plus size={18} /> Upload Game
            </Button>
          </div>
        </div>

        {/* Upload/Edit Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-dark-card w-full max-w-4xl rounded-2xl shadow-2xl my-8">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit Game Details' : 'Upload New Game'}
                </h2>
                <button onClick={() => setIsFormOpen(false)}><X size={24} className="text-gray-400" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">Basic Info</h3>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                      {iconPreview && iconPreview !== '' ? <img src={iconPreview} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Game Icon</label>
                      <input type="file" accept="image/*" onChange={handleIconUpload} className="text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Game Title</label>
                    <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full p-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Developer</label>
                    <input name="developer" value={formData.developer} onChange={handleInputChange} required className="w-full p-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <input 
                        list="categories" 
                        name="category" 
                        value={formData.category} 
                        onChange={handleInputChange} 
                        className="w-full p-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700"
                        placeholder="Select or type..."
                      />
                      <datalist id="categories">
                        <option value="Action" />
                        <option value="Adventure" />
                        <option value="Racing" />
                        <option value="Sports" />
                        <option value="Arcade" />
                        <option value="Strategy" />
                        <option value="RPG" />
                        <option value="Premium" />
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Rating</label>
                      <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleInputChange} className="w-full p-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700" />
                    </div>
                  </div>

                  {/* Premium Section */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                    <div className="flex items-center gap-2 mb-3">
                      <input 
                        type="checkbox" 
                        id="isPremium" 
                        name="isPremium" 
                        checked={formData.isPremium} 
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary rounded" 
                      />
                      <label htmlFor="isPremium" className="font-bold text-gray-900 dark:text-white">Premium Game (Paid)</label>
                    </div>
                    
                    {formData.isPremium && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Price (INR)</label>
                        <div className="relative">
                          <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input 
                            type="number" 
                            name="price" 
                            value={formData.price} 
                            onChange={handleInputChange}
                            placeholder="e.g. 499"
                            className="w-full pl-9 p-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full p-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700" />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-bold text-gray-900 dark:text-white">File & Version Management</h3>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <select value={platformInput.type} onChange={e => setPlatformInput({...platformInput, type: e.target.value as PlatformType})} className="p-2 rounded border dark:bg-dark-card dark:border-gray-700">
                        <option value="android">Android</option>
                        <option value="ios">iOS</option>
                        <option value="windows">Windows</option>
                        <option value="mac">macOS</option>
                        <option value="linux">Linux</option>
                      </select>
                      <input placeholder="Version (e.g. 1.0.2)" value={platformInput.version} onChange={e => setPlatformInput({...platformInput, version: e.target.value})} className="p-2 rounded border dark:bg-dark-card dark:border-gray-700" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500">Upload Game File (No Size Limit)</label>
                      <ChunkedUploader onUploadComplete={handleFileComplete} />
                      
                      {platformInput.downloadUrl && (
                        <div className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded flex items-center gap-2">
                          <Database size={12} />
                          File Ready: {platformInput.originalFileName} ({platformInput.size})
                        </div>
                      )}
                    </div>

                    <Button type="button" onClick={addPlatform} size="sm" fullWidth variant="secondary" disabled={!platformInput.downloadUrl}>
                      {editingId ? 'Add/Update Version' : 'Add Platform'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.platforms?.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <PlatformIcon type={p.type} />
                          <div>
                            <span className="text-sm font-medium dark:text-white capitalize block">{p.type}</span>
                            <span className="text-xs text-gray-500">{p.version} • {p.size}</span>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, platforms: formData.platforms?.filter((_, i) => i !== idx)})}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-4">
                  <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" disabled={!formData.platforms?.length}>
                    {editingId ? 'Save Changes' : 'Submit for Approval'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-4 py-3 font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === 'dashboard' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary' : 'border-transparent'}`}
                >
                  <LayoutGrid size={18} /> Dashboard
                </button>

                {(isManager || isMD || isCEO) && (
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full text-left px-4 py-3 font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === 'analytics' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary' : 'border-transparent'}`}
                  >
                    <BarChart3 size={18} /> Analytics
                  </button>
                )}

                {isStaff && (
                   <button 
                    onClick={() => setActiveTab('my_uploads')}
                    className={`w-full text-left px-4 py-3 font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === 'my_uploads' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary' : 'border-transparent'}`}
                  >
                    <Database size={18} /> My Uploads
                  </button>
                )}

                {(isTL || isManager || isMD) && (
                   <button 
                    onClick={() => setActiveTab('games')}
                    className={`w-full text-left px-4 py-3 font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === 'games' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary' : 'border-transparent'}`}
                  >
                    <Database size={18} /> Game Management
                  </button>
                )}

                {(isManager || isMD) && (
                  <button 
                    onClick={() => setActiveTab('payments')}
                    className={`w-full text-left px-4 py-3 font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === 'payments' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary' : 'border-transparent'}`}
                  >
                    <ShieldAlert size={18} /> Payment Verification
                  </button>
                )}

                {(isManager || isMD) && (
                  <button 
                    onClick={() => setActiveTab('teams')}
                    className={`w-full text-left px-4 py-3 font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === 'teams' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary' : 'border-transparent'}`}
                  >
                    <Users size={18} /> Teams & Staff
                  </button>
                )}

                {isMD && (
                  <button 
                    onClick={() => setActiveTab('users')}
                    className={`w-full text-left px-4 py-3 font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === 'users' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary' : 'border-transparent'}`}
                  >
                    <Users size={18} /> User Management
                  </button>
                )}
                
                {(isManager || isMD) && (
                  <button 
                    onClick={() => setActiveTab('database')}
                    className={`w-full text-left px-4 py-3 font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === 'database' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary' : 'border-transparent'}`}
                  >
                    <Database size={18} /> Database Dashboard
                  </button>
                )}

                {(isManager || isMD) && (
                  <button 
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full text-left px-4 py-3 font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === 'notifications' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary' : 'border-transparent'}`}
                  >
                    <Bell size={18} /> Notifications
                  </button>
                )}

                {(isTL || isManager || isMD) && (
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className={`w-full text-left px-4 py-3 font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === 'reports' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary' : 'border-transparent'}`}
                  >
                    <FileText size={18} /> Inbox & Reports
                  </button>
                )}

                {isMD && (
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-3 font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === 'settings' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary' : 'border-transparent'}`}
                  >
                    <Settings size={18} /> System Settings
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
               <div className="text-center py-20 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-700">
                 <h2 className="text-2xl font-bold mb-2">Welcome, {user?.username}</h2>
                 <p className="text-gray-500">Role: {user?.role.toUpperCase()}</p>
                 <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                   <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                     <div className="text-2xl font-bold">12</div>
                     <div className="text-xs text-gray-500">Pending Tasks</div>
                   </div>
                   <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                     <div className="text-2xl font-bold">5</div>
                     <div className="text-xs text-gray-500">New Reports</div>
                   </div>
                 </div>
               </div>
            )}
            
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'games' && <GameManagement onEdit={handleEditGame} />}
            {activeTab === 'my_uploads' && <div className="p-8 text-center text-gray-500">Your upload history will appear here.</div>}
            {activeTab === 'payments' && <PendingPayments />}
            {activeTab === 'teams' && <TeamManagement />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'settings' && <SystemSettings />}
            {activeTab === 'reports' && <Inbox />}
            {activeTab === 'database' && <DatabaseDashboard onEdit={handleEditGame} />}
            {activeTab === 'notifications' && <Notifications />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
