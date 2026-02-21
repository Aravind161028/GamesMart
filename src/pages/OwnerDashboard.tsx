import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGames } from '../context/GameContext';
import { Users, Download, TrendingUp, Shield, BarChart3 } from 'lucide-react';
import { UserRole } from '../types';

const OwnerDashboard = () => {
  const { allUsers, updateUserRole } = useAuth();
  const { apps } = useGames();
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');

  const totalDownloads = apps.reduce((acc, app) => acc + (app.downloadCount || 0), 0);
  const totalRevenue = totalDownloads * 0.05; // Fake revenue logic

  return (
    <div className="min-h-screen pt-24 pb-12 bg-light-bg dark:bg-dark-bg">
      <div className="container">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Executive Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                <Users size={24} />
              </div>
              <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{allUsers.length}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                <Download size={24} />
              </div>
              <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+24%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{(totalDownloads / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-500">Total Downloads</div>
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                <TrendingUp size={24} />
              </div>
              <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+8%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{apps.length}</div>
            <div className="text-sm text-gray-500">Active Games</div>
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                <BarChart3 size={24} />
              </div>
              <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+15%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toFixed(0)}</div>
            <div className="text-sm text-gray-500">Est. Revenue</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            System Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            User Management
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {u.username[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${u.role === 'owner' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                          u.role === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                        className="bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-sm rounded-lg p-1.5 focus:ring-primary focus:border-primary"
                        disabled={u.role === 'owner'}
                      >
                        <option value="user">User</option>
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="text-center py-12 text-gray-500">
            <Shield size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Healthy</h3>
            <p>All services are running normally.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
