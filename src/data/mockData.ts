import { AppData, User, CATEGORIES as ICategories } from '../types';

export const APPS: AppData[] = [
  {
    id: '1',
    title: 'Battle Royale Mobile',
    developer: 'Proxima Beta',
    icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200&h=200',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200&h=600',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800&h=450',
      'https://images.unsplash.com/photo-1593305841991-05c29736ce37?auto=format&fit=crop&q=80&w=800&h=450',
    ],
    rating: 4.5,
    downloads: '500M+',
    downloadCount: 500000000,
    weeklyDownloadCount: 12000,
    category: 'Action',
    description: 'The official Battle Royale designed exclusively for mobile. Play free anywhere, anytime.',
    updatedDate: '2025-05-15',
    platforms: [
      { 
        type: 'android', 
        version: '2.8.0', 
        size: '1.8 GB', 
        downloadUrl: 'https://example.com/files/battle-royale.apk', 
        minOs: 'Android 5.1.1+',
        obbUrl: 'https://example.com/files/battle-royale.obb',
        obbFolderName: 'com.proxima.battleroyale',
        supportedAbis: ['arm64-v8a']
      },
      { type: 'ios', version: '2.8.0', size: '2.1 GB', downloadUrl: '#', minOs: 'iOS 11.0+' }
    ],
    isFeatured: true,
    isPopular: true,
    isSafe: true,
    packageName: 'com.proxima.battleroyale'
  },
  {
    id: '2',
    title: 'Cyber City 2077',
    developer: 'CD Projekt Red',
    icon: 'https://images.unsplash.com/photo-1533236897111-3e94666b2edf?auto=format&fit=crop&q=80&w=200&h=200',
    banner: 'https://images.unsplash.com/photo-1533236897111-3e94666b2edf?auto=format&fit=crop&q=80&w=1200&h=600',
    screenshots: [
      'https://images.unsplash.com/photo-1533236897111-3e94666b2edf?auto=format&fit=crop&q=80&w=800&h=450',
    ],
    rating: 4.2,
    downloads: '10M+',
    downloadCount: 10000000,
    weeklyDownloadCount: 5000,
    category: 'RPG',
    description: 'An open-world, action-adventure story set in Night City.',
    updatedDate: '2025-04-20',
    platforms: [
      { type: 'windows', version: '1.6.0', size: '70 GB', downloadUrl: '#', minOs: 'Windows 10' },
    ],
    isFeatured: true,
    isPopular: true,
    isSafe: true
  },
  {
    id: '3',
    title: 'Block Builder 3D',
    developer: 'Mojang Studios',
    icon: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=200&h=200',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200&h=600',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800&h=450',
    ],
    rating: 4.8,
    downloads: '200M+',
    downloadCount: 200000000,
    weeklyDownloadCount: 8500,
    category: 'Arcade',
    description: 'Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.',
    updatedDate: '2025-03-10',
    platforms: [
      { type: 'android', version: '1.19.50', size: '450 MB', downloadUrl: '#', minOs: 'Android 5.0+' },
      { type: 'windows', version: '1.19.50', size: '1 GB', downloadUrl: '#', minOs: 'Windows 10' },
    ],
    isFeatured: false,
    isPopular: true,
    isSafe: true
  },
  {
    id: '4',
    title: 'Speed Racer: Drift',
    developer: 'Nitro Games',
    icon: 'https://images.unsplash.com/photo-1511882150382-421056ac8d27?auto=format&fit=crop&q=80&w=200&h=200',
    banner: 'https://images.unsplash.com/photo-1511882150382-421056ac8d27?auto=format&fit=crop&q=80&w=1200&h=600',
    screenshots: [],
    rating: 4.7,
    downloads: '100M+',
    downloadCount: 100000000,
    weeklyDownloadCount: 3000,
    category: 'Racing',
    description: 'Experience the thrill of high-speed street racing.',
    updatedDate: '2025-04-20',
    platforms: [
      { type: 'android', version: '4.1.2', size: '850 MB', downloadUrl: '#', minOs: 'Android 8.0+' },
    ],
    isFeatured: true,
    isPopular: true,
    isSafe: true
  }
];

export const CATEGORIES = [
  { name: 'Action', icon: 'Swords' },
  { name: 'Racing', icon: 'Car' },
  { name: 'Shooting', icon: 'Crosshair' },
  { name: 'Adventure', icon: 'Map' },
  { name: 'Arcade', icon: 'Gamepad2' },
  { name: 'Multiplayer', icon: 'Users' },
  { name: 'Tools', icon: 'Wrench' },
  { name: 'Strategy', icon: 'Brain' },
];

export const MOCK_USERS: User[] = [
  {
    id: 'owner-main',
    username: 'Aravind',
    email: 'aravind16102008@gmail.com',
    role: 'owner',
    favorites: [],
    history: [],
    createdAt: '2025-01-01'
  },
  {
    id: 'owner-1',
    username: 'Owner',
    email: 'owner@gamesmart.com',
    role: 'owner',
    favorites: [],
    history: [],
    createdAt: '2025-01-01'
  },
  {
    id: 'admin-1',
    username: 'AdminUser',
    email: 'admin@gamesmart.com',
    role: 'admin',
    favorites: [],
    history: [],
    createdAt: '2025-01-02'
  },
  {
    id: 'user-1',
    username: 'GamerOne',
    email: 'user@gamesmart.com',
    role: 'user',
    favorites: [],
    history: [],
    createdAt: '2025-01-05'
  }
];
