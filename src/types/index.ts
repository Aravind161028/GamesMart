export type PlatformType = 'android' | 'ios' | 'windows' | 'mac' | 'linux';
// Strict Hierarchy: owner/ceo > md > manager > tl > staff > user
export type UserRole = 'owner' | 'ceo' | 'md' | 'manager' | 'tl' | 'staff' | 'user';
export type TicketStatus = 'new' | 'read' | 'replied' | 'resolved';
export type TransactionStatus = 'pending' | 'pending_verification' | 'verified' | 'rejected';
export type GameStatus = 'pending_review' | 'pending_approval' | 'published' | 'soft_deleted' | 'removed';
export type VirusScanStatus = 'pending' | 'scanning' | 'clean' | 'infected' | 'warning';
export type TechAnalysisStatus = 'pending' | 'passed' | 'failed';
export type DownloadStatus = 'idle' | 'queued' | 'downloading' | 'paused' | 'completed' | 'error' | 'installed';
export type SourceStore = 'steam' | 'apkpure' | 'uptodown' | 'taptap' | 'official' | 'none';

export interface PlatformInfo {
  type: PlatformType;
  version: string;
  size: string;
  sizeBytes: number;
  downloadUrl: string;
  originalFileName?: string;
  minOs: string;
  requirements?: string;
  obbUrl?: string;
  obbFolderName?: string;
  supportedAbis?: string[];
  checksum?: string;
  uploadedAt: string;
  isHosted?: boolean;
}

export interface AppData {
  id: string;
  title: string;
  developer: string;
  publisher?: string;
  icon: string;
  banner: string;
  screenshots: string[];
  rating: number;
  downloads: string;
  downloadCount: number;
  installCount?: number; // Added for analytics
  weeklyDownloadCount: number;
  lastDownloadedAt?: string;
  category: string;
  description: string;
  whatsNew?: string;
  updatedDate: string;
  uploadDate?: string; // Added for strict month filtering
  platforms: PlatformInfo[];
  versionHistory?: PlatformInfo[];
  isFeatured?: boolean;
  isPopular?: boolean;
  isSafe?: boolean;
  trailerUrl?: string;
  tags?: string[];
  packageName?: string;
  isPremium?: boolean;
  price?: number;
  isMod?: boolean;
  revenue?: number;
  status: GameStatus;
  uploadedBy?: string; 
  teamId?: string; 
  virusScanStatus: VirusScanStatus;
  techAnalysisStatus: TechAnalysisStatus;
}

export interface GlobalSettings {
  upiId: string;
  enableUploads: boolean;
  enablePayments: boolean;
  enableRegistrations: boolean;
}

export interface NotificationSettings {
  newGames: boolean;
  updates: boolean;
  offers: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  teamId?: string;
  favorites: string[];
  history: string[];
  searchHistory?: string[];
  viewHistory?: string[];
  purchasedGameIds?: string[];
  notifications?: NotificationSettings;
  createdAt: string;
  isVerified: boolean;
  verificationToken?: string;
  resetToken?: string;
  tokenExpiry?: number;
  isFlagged?: boolean;
}

export interface Team {
  id: string;
  name: string;
  managerId?: string;
  tlId?: string;
  staffIds: string[];
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  name: string;
  email: string;
  type: 'request' | 'bug' | 'fake_app' | 'virus' | 'payment_issue' | 'other';
  gameName?: string;
  gameId?: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  transactionId?: string;
  utrNumber?: string;
  screenshot?: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  enabled: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  gameId: string;
  gameName: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  transactionId?: string;
  utrNumber?: string;
  screenshot?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface DownloadRecord {
  id: string;
  gameId: string;
  gameName: string;
  platform: PlatformType;
  userId: string;
  date: string;
}

export interface DownloadTask {
  id: string;
  gameId: string;
  gameTitle: string;
  gameIcon: string;
  platform: PlatformType;
  url: string;
  totalBytes: number;
  downloadedBytes: number;
  status: DownloadStatus;
  speed: number;
  startTime: number;
  error?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userEmail: string;
  details: string;
  timestamp: string;
}
