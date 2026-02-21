import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, Lock, Edit2, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

const TeamManagement = () => {
  const { teams, createTeam, updateTeam, deleteTeam, allUsers, assignToTeam, hasRole } = useAuth();
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [assignEmail, setAssignEmail] = useState('');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Permissions: Manager, MD, CEO can manage teams
  const canManageTeams = hasRole(['manager']); 
  const canDeleteTeam = hasRole(['manager']); // Manager, MD, CEO

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName) {
      createTeam(newTeamName);
      setNewTeamName('');
    }
  };

  const handleAssign = (role: 'manager' | 'tl' | 'staff') => {
    if (!selectedTeam || !assignEmail) return;
    const user = allUsers.find(u => u.email.toLowerCase() === assignEmail.toLowerCase());
    if (user) {
      assignToTeam(user.id, selectedTeam, role);
      setAssignEmail('');
    } else {
      alert('User not found');
    }
  };

  const startEdit = (team: any) => {
    setEditingTeamId(team.id);
    setEditName(team.name);
  };

  const saveEdit = (id: string) => {
    updateTeam(id, { name: editName });
    setEditingTeamId(null);
  };

  const handleDeleteTeam = (id: string) => {
    if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      deleteTeam(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Team - Restricted */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        {!canManageTeams && (
          <div className="absolute inset-0 bg-gray-100/50 dark:bg-black/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="bg-white dark:bg-dark-card px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-bold text-gray-500">
              <Lock size={16} /> Team Management Restricted to Managers
            </div>
          </div>
        )}
        
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Users size={20} /> Create Corporate Team
        </h3>
        <form onSubmit={handleCreateTeam} className="flex gap-4">
          <input 
            value={newTeamName}
            onChange={e => setNewTeamName(e.target.value)}
            placeholder="Team Name (e.g. Alpha Squad)"
            className="flex-1 p-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700"
            disabled={!canManageTeams}
          />
          <Button type="submit" className="gap-2" disabled={!canManageTeams}><Plus size={16} /> Create</Button>
        </form>
      </div>

      {/* Team List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map(team => {
          const manager = allUsers.find(u => u.id === team.managerId);
          const tl = allUsers.find(u => u.id === team.tlId);
          const staff = allUsers.filter(u => team.staffIds.includes(u.id));

          return (
            <div key={team.id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                {editingTeamId === team.id ? (
                  <div className="flex gap-2">
                    <input 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="p-1 rounded border dark:bg-dark-bg dark:border-gray-700"
                    />
                    <Button size="sm" onClick={() => saveEdit(team.id)}>Save</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg">{team.name}</h4>
                    {canManageTeams ? (
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(team)} className="text-gray-400 hover:text-primary p-1">
                          <Edit2 size={14} />
                        </button>
                        {canDeleteTeam && (
                          <button onClick={() => handleDeleteTeam(team.id)} className="text-gray-400 hover:text-red-500 p-1" title="Delete Team">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 ml-2">(Read Only)</span>
                    )}
                  </div>
                )}
                
                <div title={!canManageTeams ? "You don't have permission to manage teams" : "Manage Team"}>
                  <button 
                    onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)} 
                    className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!canManageTeams}
                  >
                    {selectedTeam === team.id ? 'Close' : 'Manage'}
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Hierarchy */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/10 rounded border border-purple-100 dark:border-purple-900/30">
                    <span className="text-xs font-bold text-purple-700 uppercase">Manager</span>
                    <span className="text-sm font-medium">{manager?.username || 'Unassigned'}</span>
                  </div>
                  <div className="ml-4 flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/10 rounded border border-blue-100 dark:border-blue-900/30">
                    <span className="text-xs font-bold text-blue-700 uppercase">Team Leader</span>
                    <span className="text-sm font-medium">{tl?.username || 'Unassigned'}</span>
                  </div>
                  <div className="ml-8 space-y-1">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">Staff ({staff.length})</div>
                    {staff.map(s => (
                      <div key={s.id} className="p-2 bg-green-50 dark:bg-green-900/10 rounded border border-green-100 dark:border-green-900/30 text-sm flex justify-between">
                        <span>{s.username}</span>
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    ))}
                    {staff.length === 0 && <div className="text-sm text-gray-400 italic">No staff assigned</div>}
                  </div>
                </div>

                {/* Management Controls */}
                {selectedTeam === team.id && canManageTeams && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
                    <h5 className="text-sm font-bold mb-2">Assign Member</h5>
                    <div className="flex gap-2 mb-2">
                      <input 
                        value={assignEmail}
                        onChange={e => setAssignEmail(e.target.value)}
                        placeholder="User Email"
                        className="flex-1 p-2 text-sm rounded border dark:bg-dark-bg dark:border-gray-700"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleAssign('manager')} className="text-xs">Set Manager</Button>
                      <Button size="sm" variant="secondary" onClick={() => handleAssign('tl')} className="text-xs">Set TL</Button>
                      <Button size="sm" variant="secondary" onClick={() => handleAssign('staff')} className="text-xs">Add Staff</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamManagement;
