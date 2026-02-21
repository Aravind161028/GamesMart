import { useState, useMemo } from 'react';
import { useGames } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { usePayment } from '../../context/PaymentContext';
import { Database, Upload, DollarSign, Search, Trash, Edit2, Calendar, Lock, AlertTriangle } from 'lucide-react';
import { AppData } from '../../types';

interface DatabaseDashboardProps {
  onEdit?: (app: AppData) => void;
}

const DatabaseDashboard = ({ onEdit }: DatabaseDashboardProps) => {
  const { apps, deleteApp } = useGames();
  const { allUsers, user } = useAuth();
  const { transactions } = usePayment();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Default to current month YYYY-MM
  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);
  const [activeTab, setActiveTab] = useState<'uploads' | 'purchases'>('uploads');

  const isCEO = user?.role === 'ceo' || user?.role === 'owner';

  // 1. Dynamic Month Generation
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    
    // Collect months from apps
    apps.forEach(app => {
      const date = app.uploadDate || app.updatedDate;
      if (date) months.add(date.slice(0, 7));
    });

    // Collect months from transactions
    transactions.forEach(tx => {
      const date = tx.reviewedAt || tx.date;
      if (date) months.add(date.slice(0, 7));
    });

    // Add current month if empty
    if (months.size === 0) months.add(currentMonthKey);

    return Array.from(months).sort().reverse(); // Newest first
  }, [apps, transactions, currentMonthKey]);

  // 2. Filter Data
  const filteredApps = apps.filter(app => {
    // Strict filtering by uploadDate
    const appDate = (app.uploadDate || '').slice(0, 7);
    const matchesMonth = appDate === selectedMonth;
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (app.uploadedBy && allUsers.find(u => u.id === app.uploadedBy)?.username.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMonth && matchesSearch;
  });

  const filteredTransactions = transactions.filter(tx => {
    // Strict filtering by review date or transaction date
    const txDate = (tx.reviewedAt || tx.date).slice(0, 7);
    const matchesMonth = txDate === selectedMonth;
    const matchesSearch = tx.gameName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tx.transactionId || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  const handleCEOAction = (action: string, id: string, data?: any) => {
    if (!isCEO) {
      alert("Access Denied: Only CEO can perform this action.");
      return;
    }
    if (action === 'Delete') {
      if (confirm('Are you sure you want to delete this record? This action is permanent and logged.')) {
        if (data === 'app') {
            deleteApp(id);
        }
        // Payment deletion logic would go here if available in context
      }
    } else if (action === 'Edit') {
      if (data && onEdit) {
        onEdit(data);
      } else {
        alert("Edit functionality not available for this item type.");
      }
    }
  };

  const formatMonth = (yyyyMm: string) => {
    const date = new Date(`${yyyyMm}-01`);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search game, employee, transaction ID, UTR..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      {/* Tab Selectors */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setActiveTab('uploads')}
          className={`pb-2 px-4 font-medium text-sm transition-colors ${activeTab === 'uploads' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          Game Upload Database
        </button>
        <button 
          onClick={() => setActiveTab('purchases')}
          className={`pb-2 px-4 font-medium text-sm transition-colors ${activeTab === 'purchases' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          Premium Purchase Database
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Monthly Archives */}
        <div className="lg:col-span-1 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-700 p-4 h-fit">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar size={18} /> Monthly Archives
          </h3>
          <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
            {availableMonths.map(month => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMonth === month 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {formatMonth(month)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          
          {activeTab === 'uploads' && (
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Upload size={20} className="text-blue-500" /> Uploads — {formatMonth(selectedMonth)}
                </h3>
                <span className="text-xs text-gray-400">{filteredApps.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 font-bold text-gray-500">Game</th>
                      <th className="px-6 py-3 font-bold text-gray-500">Category</th>
                      <th className="px-6 py-3 font-bold text-gray-500">Uploaded By</th>
                      <th className="px-6 py-3 font-bold text-gray-500">Date</th>
                      <th className="px-6 py-3 font-bold text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredApps.length > 0 ? filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2">
                                {app.icon && <img src={app.icon} className="w-6 h-6 rounded object-cover" />}
                                {app.title}
                            </div>
                        </td>
                        <td className="px-6 py-3 text-gray-500">{app.category}</td>
                        <td className="px-6 py-3 text-gray-500">
                          {allUsers.find(u => u.id === app.uploadedBy)?.username || 'System'}
                        </td>
                        <td className="px-6 py-3 text-gray-500">{app.uploadDate}</td>
                        <td className="px-6 py-3 text-right">
                          {isCEO ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleCEOAction('Edit', app.id, app)} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Edit"><Edit2 size={14}/></button>
                              <button onClick={() => handleCEOAction('Delete', app.id, 'app')} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Delete"><Trash size={14}/></button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 flex items-center justify-end gap-1"><Lock size={10}/> View Only</span>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center gap-2">
                                <Database size={32} className="text-gray-300" />
                                <p>No uploads found for {formatMonth(selectedMonth)}.</p>
                            </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <DollarSign size={20} className="text-green-500" /> Premium Purchases — {formatMonth(selectedMonth)}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 font-bold text-gray-500">Game</th>
                      <th className="px-6 py-3 font-bold text-gray-500">User</th>
                      <th className="px-6 py-3 font-bold text-gray-500">Txn ID</th>
                      <th className="px-6 py-3 font-bold text-gray-500">Status</th>
                      <th className="px-6 py-3 font-bold text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{tx.gameName}</td>
                        <td className="px-6 py-3 text-gray-500">{tx.userEmail}</td>
                        <td className="px-6 py-3 font-mono text-xs">{tx.transactionId || 'N/A'}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold ${
                            tx.status === 'verified' ? 'bg-green-100 text-green-700' : 
                            tx.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          {isCEO ? (
                            <div className="flex justify-end gap-2">
                              {/* Payment editing/deletion usually restricted even for CEO to preserve financial records, but added as per request */}
                              <button onClick={() => handleCEOAction('Delete', tx.id, 'tx')} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Delete"><Trash size={14}/></button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 flex items-center justify-end gap-1"><Lock size={10}/> View Only</span>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center gap-2">
                                <AlertTriangle size={32} className="text-gray-300" />
                                <p>No purchases found for {formatMonth(selectedMonth)}.</p>
                            </div>
                          </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseDashboard;
