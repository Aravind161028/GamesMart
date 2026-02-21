import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Monitor, Smartphone, Command, Terminal, Flame, ArrowDownAZ, Calendar, Download } from 'lucide-react';
import AppCard from '../components/ui/AppCard';
import { CATEGORIES } from '../data/mockData';
import { useGames } from '../context/GameContext';
import { PlatformType } from '../types';

const Store = () => {
  const { apps } = useGames();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePlatform, setActivePlatform] = useState<PlatformType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCategory(cat);
    
    const search = searchParams.get('search');
    if (search) setSearchQuery(search);

    const sort = searchParams.get('sort');
    if (sort) setSortBy(sort);
  }, [searchParams]);

  let filteredApps = apps.filter(app => {
    const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
    const matchesPlatform = activePlatform === 'all' || app.platforms.some(p => p.type === activePlatform);
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPlatform && matchesSearch;
  });

  // Sorting Logic
  filteredApps.sort((a, b) => {
    switch (sortBy) {
      case 'new':
        return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
      case 'trending':
        return (b.weeklyDownloadCount || 0) - (a.weeklyDownloadCount || 0);
      case 'az':
        return a.title.localeCompare(b.title);
      case 'popular':
      default:
        return (b.downloadCount || 0) - (a.downloadCount || 0);
    }
  });

  const platforms: { id: PlatformType | 'all', label: string, icon: any }[] = [
    { id: 'all', label: 'All Platforms', icon: null },
    { id: 'android', label: 'Android', icon: Smartphone },
    { id: 'ios', label: 'iOS', icon: Smartphone },
    { id: 'windows', label: 'Windows', icon: Monitor },
    { id: 'mac', label: 'macOS', icon: Command },
    { id: 'linux', label: 'Linux', icon: Terminal },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-light-bg dark:bg-dark-bg">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">App Store</h1>
          <p className="text-gray-500 dark:text-gray-400">Explore thousands of free games and apps for all devices</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Platform</h3>
              <div className="space-y-1">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePlatform(p.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activePlatform === p.id
                        ? 'bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {p.icon && <p.icon size={16} />}
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                    activeCategory === 'All'
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  All Apps
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                      activeCategory === cat.name
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Search in results..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none text-sm w-full sm:w-64"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">{filteredApps.length} results</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 dark:bg-dark-bg border-none text-sm rounded-lg p-2 text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-primary"
                >
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending Now</option>
                  <option value="new">Newest First</option>
                  <option value="az">A-Z</option>
                </select>
              </div>
            </div>

            {filteredApps.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-block p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No apps found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
