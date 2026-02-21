import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Shield, UserCheck, AlertCircle, Briefcase, Lock } from 'lucide-react';
import { UserRole } from '../../types';
import Button from '../ui/Button';

const UserManagement = () => {
  const { allUsers, updateUserRole, promoteUserByEmail, user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promoteRole, setPromoteRole] = useState<UserRole>('staff');
  const [feedback, setFeedback] = useState<{type: 'success'|'error', msg: string} | null>(null);

  const filteredUsers = allUsers.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await promoteUserByEmail(promoteEmail, promoteRole);
      setFeedback({ type: 'success', msg: `User ${promoteEmail} promoted to ${promoteRole}` });
      setPromoteEmail('');
    } catch (err) {
      setFeedback({ type: 'error', msg: 'User not found' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch(role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ceo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'md': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'manager': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'tl': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'staff': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canEditUser = (targetRole: UserRole) => {
    if (targetRole === 'owner' || targetRole === 'ceo') return false; // No one edits Owner/CEO
    if (currentUser?.role === 'owner' || currentUser?.role === 'ceo') return true; // Owner/CEO edits everyone else
    if (currentUser?.role === 'md' && targetRole !== 'md') return true; // MD edits everyone below MD
    return false;
  };

  return (
    <div className="space-y-8">
      {/* Promote Section */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Briefcase size={20} className="text-primary" /> Quick Promote
        </h3>
        <form onSubmit={handlePromote} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-1">User Email</label>
            <input 
              type="email" 
              required
              value={promoteEmail}
              onChange={e => setPromoteEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full p-2.5 rounded-lg border dark:bg-dark-bg dark:border-gray-700"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium mb-1">Assign Role</label>
            <select 
              value={promoteRole}
              onChange={e => setPromoteRole(e.target.value as UserRole)}
              className="w-full p-2.5 rounded-lg border dark:bg-dark-bg dark:border-gray-700"
            >
              <option value="staff">Staff</option>
              <option value="tl">Team Leader</option>
              <option value="manager">Manager</option>
              {(currentUser?.role === 'owner' || currentUser?.role === 'ceo') && <option value="md">Managing Director</option>}
            </select>
          </div>
          <Button type="submit" className="w-full md:w-auto">Promote User</Button>
        </form>
        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
            feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {feedback.type === 'success' ? <UserCheck size={16} /> : <AlertCircle size={16} />}
            {feedback.msg}
          </div>
        )}
      </div>

      {/* User List */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield size={20} /> User Directory
            <span className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded-full">{allUsers.length}</span>
          </h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-dark-bg border-none text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Current Role</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)} capitalize`}>
                      {user.role === 'tl' ? 'Team Leader' : user.role === 'md' ? 'Managing Director' : user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {canEditUser(user.role) ? (
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                        className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer text-primary font-medium hover:underline text-right"
                      >
                        <option value="user">User</option>
                        <option value="staff">Staff</option>
                        <option value="tl">Team Leader</option>
                        <option value="manager">Manager</option>
                        {(currentUser?.role === 'owner' || currentUser?.role === 'ceo') && <option value="md">Managing Director</option>}
                      </select>
                    ) : (
                      <span className="text-gray-400 text-xs flex items-center justify-end gap-1">
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
