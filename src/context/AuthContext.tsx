import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, SupportTicket, NotificationSettings, Team, AuditLog } from '../types';
import bcrypt from 'bcryptjs';
import { saveToPersistentStore, loadFromPersistentStore } from '../services/StorageService';
import { sendEmail } from '../services/EmailService';

interface StoredUser extends User {
  passwordHash: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
  allUsers: User[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
  promoteUserByEmail: (email: string, role: UserRole) => Promise<void>;
  tickets: SupportTicket[];
  submitTicket: (ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>) => void;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;
  deleteTicket: (id: string) => void;
  sendSystemNotification: (title: string, message: string) => void;
  teams: Team[];
  createTeam: (name: string, managerId?: string) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  assignToTeam: (userId: string, teamId: string, role: 'manager' | 'tl' | 'staff') => void;
  unlockGame: (userId: string, gameId: string) => void;
  flagUser: (userId: string) => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  updateNotificationSettings: (settings: NotificationSettings) => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUsers, setDbUsers] = useState<StoredUser[]>([]);
  const [teams, setTeams] = useState<Team[]>(() => loadFromPersistentStore('games_mart_teams') || []);
  const [tickets, setTickets] = useState<SupportTicket[]>(() => loadFromPersistentStore('games_mart_tickets_db') || []);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadFromPersistentStore('games_mart_audit_logs') || []);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Data
  useEffect(() => {
    const initData = async () => {
      // 1. Owner Setup (Fixed Credentials)
      const ownerEmail = 'aravind16102008@gmail.com';
      const ownerPassword = 'aravind16';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(ownerPassword, salt);

      const ownerUser: StoredUser = {
        id: 'owner-main', 
        username: 'Aravind', 
        email: ownerEmail, 
        passwordHash: hash,
        role: 'ceo', // Explicitly set to CEO
        favorites: [], 
        history: [], 
        isVerified: true,
        createdAt: new Date().toISOString()
      };

      // 2. Pre-seed Teams if empty
      let currentTeams = loadFromPersistentStore('games_mart_teams') || [];
      if (currentTeams.length === 0) {
        currentTeams = [
          { id: 'team_kumar', name: 'Kumar Team', staffIds: [], createdAt: new Date().toISOString() },
          { id: 'team_gokul', name: 'Gokul Team', staffIds: [], createdAt: new Date().toISOString() }
        ];
        setTeams(currentTeams);
      }

      // Load existing users but FORCE update the owner account
      let currentUsers: StoredUser[] = loadFromPersistentStore('games_mart_users_db') || [];
      const otherUsers = currentUsers.filter(u => u.email.toLowerCase() !== ownerEmail.toLowerCase());
      const finalUsers = [ownerUser, ...otherUsers];

      setDbUsers(finalUsers);
      saveToPersistentStore('games_mart_users_db', finalUsers);
      setIsInitialized(true);
    };

    initData();
  }, []);

  useEffect(() => {
    if (isInitialized) saveToPersistentStore('games_mart_users_db', dbUsers);
  }, [dbUsers, isInitialized]);

  useEffect(() => saveToPersistentStore('games_mart_tickets_db', tickets), [tickets]);
  useEffect(() => saveToPersistentStore('games_mart_teams', teams), [teams]);
  useEffect(() => saveToPersistentStore('games_mart_audit_logs', auditLogs), [auditLogs]);

  const addAuditLog = (action: string, details: string) => {
    if (!user) return;
    const log: AuditLog = {
      id: Date.now().toString(),
      action,
      userId: user.id,
      userEmail: user.email,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const login = async (email: string, password: string) => {
    return new Promise<void>(async (resolve, reject) => {
      await new Promise(r => setTimeout(r, 500));
      const foundUser = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!foundUser) { reject(new Error('Account not registered.')); return; }
      const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
      if (!isMatch) { reject(new Error('Invalid password.')); return; }
      const { passwordHash, ...safeUser } = foundUser;
      setUser(safeUser);
      resolve();
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    return new Promise<void>(async (resolve, reject) => {
      await new Promise(r => setTimeout(r, 500));
      if (dbUsers.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
        reject(new Error('Email already registered.'));
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser: StoredUser = {
        id: Date.now().toString(), username: name, email: email.trim(), passwordHash: hashedPassword,
        role: 'user', favorites: [], history: [], isVerified: true, createdAt: new Date().toISOString()
      };
      setDbUsers(prev => [...prev, newUser]);
      resolve();
    });
  };

  const logout = () => setUser(null);

  const hasRole = (allowedRoles: UserRole[]) => {
    if (!user) return false;
    // Strict Hierarchy: CEO > MD > Manager > TL > Staff > User
    const hierarchy = ['user', 'staff', 'tl', 'manager', 'md', 'ceo', 'owner'];
    const userLevel = hierarchy.indexOf(user.role);
    
    // Check if user has any of the allowed roles OR is higher in hierarchy
    return allowedRoles.some(role => {
      const requiredLevel = hierarchy.indexOf(role);
      return userLevel >= requiredLevel;
    });
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    const targetUser = dbUsers.find(u => u.id === userId);
    if (targetUser?.email === 'aravind16102008@gmail.com') {
      console.warn("Cannot change role of the CEO");
      return;
    }
    // Backend Validation Simulation
    if (!hasRole(['md'])) {
       console.error("Access Denied: Only MD/CEO can change roles");
       return;
    }

    setDbUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (user && user.id === userId) setUser({ ...user, role: newRole });
    addAuditLog('ROLE_UPDATE', `Changed role of user ${userId} to ${newRole}`);
  };

  const promoteUserByEmail = async (email: string, role: UserRole) => {
    return new Promise<void>((resolve, reject) => {
      const targetUser = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!targetUser) { reject(new Error('User not found')); return; }
      updateUserRole(targetUser.id, role);
      resolve();
    });
  };

  const createTeam = (name: string, managerId?: string) => {
    if (!hasRole(['manager'])) {
      alert("Access Denied: Only Manager/MD/CEO can create teams");
      return;
    }
    const newTeam: Team = { id: `team_${Date.now()}`, name, managerId, staffIds: [], createdAt: new Date().toISOString() };
    setTeams(prev => [...prev, newTeam]);
    addAuditLog('TEAM_CREATE', `Created team: ${name}`);
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    if (!hasRole(['manager'])) {
      alert("Access Denied: Only Manager/MD/CEO can update teams");
      return;
    }
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    addAuditLog('TEAM_UPDATE', `Updated team ${id}`);
  };

  const deleteTeam = (id: string) => {
    if (!hasRole(['manager'])) {
      alert("Access Denied: Only Manager/MD/CEO can delete teams");
      return;
    }
    setTeams(prev => prev.filter(t => t.id !== id));
    addAuditLog('TEAM_DELETE', `Deleted team ${id}`);
  };

  const assignToTeam = (userId: string, teamId: string, role: 'manager' | 'tl' | 'staff') => {
    const userRoleMap: Record<string, UserRole> = { 'manager': 'manager', 'tl': 'tl', 'staff': 'staff' };
    setDbUsers(prev => prev.map(u => u.id === userId ? { ...u, role: userRoleMap[role], teamId } : u));
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        if (role === 'manager') return { ...t, managerId: userId };
        if (role === 'tl') return { ...t, tlId: userId };
        if (role === 'staff') return { ...t, staffIds: [...t.staffIds.filter(id => id !== userId), userId] };
      }
      return t;
    }));
    addAuditLog('TEAM_ASSIGN', `Assigned user ${userId} to team ${teamId} as ${role}`);
  };

  const submitTicket = (ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>) => {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `ticket_${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicketStatus = (id: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const unlockGame = (userId: string, gameId: string) => {
    setDbUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const currentPurchases = u.purchasedGameIds || [];
        if (!currentPurchases.includes(gameId)) return { ...u, purchasedGameIds: [...currentPurchases, gameId] };
      }
      return u;
    }));
    if (user && user.id === userId) {
      const currentPurchases = user.purchasedGameIds || [];
      if (!currentPurchases.includes(gameId)) setUser({ ...user, purchasedGameIds: [...currentPurchases, gameId] });
    }
  };

  const flagUser = (userId: string) => {
    setDbUsers(prev => prev.map(u => u.id === userId ? { ...u, isFlagged: true } : u));
  };

  const forgotPassword = async (email: string) => {
    const targetUser = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!targetUser) throw new Error("Email not found");
    
    const token = Math.random().toString(36).substring(7);
    const link = `${window.location.origin}/reset-password?token=${token}`;
    
    await sendEmail({
      to: email,
      subject: 'Reset Password - Games Mart',
      body: 'Click the link below to reset your password.',
      actionLink: link
    });
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await new Promise(r => setTimeout(r, 1000));
  };

  const verifyEmail = async (token: string) => {
    await new Promise(r => setTimeout(r, 1000));
  };

  const updateNotificationSettings = () => {};
  const sendSystemNotification = () => {};

  const allUsers = dbUsers.map(({ passwordHash, ...u }) => u);

  return (
    <AuthContext.Provider value={{ 
      user, login, signup, logout, isAuthenticated: !!user, hasRole, allUsers, updateUserRole, promoteUserByEmail,
      tickets, submitTicket, updateTicketStatus, deleteTicket, sendSystemNotification, teams, createTeam, updateTeam, deleteTeam, assignToTeam, unlockGame, flagUser,
      forgotPassword, resetPassword, verifyEmail, updateNotificationSettings, auditLogs, addAuditLog
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
