import { Link } from 'react-router-dom';
import { ChevronRight, Gamepad2, Flame, Sparkles } from 'lucide-react';
import AppCard from '../components/ui/AppCard';
import Button from '../components/ui/Button';
import { CATEGORIES } from '../data/mockData';
import { useGames } from '../context/GameContext';
import { useOS } from '../hooks/useOS';

const Home = () => {
  const { apps, trendingApps, getRecommendedApps } = useGames();
  const os = useOS();
  
  const featuredApps = apps.filter(app => app.isFeatured);
  const recommendedApps = getRecommendedApps(6);
  const freeApps = apps.filter(app => !app.isPremium).slice(0, 5);
  const premiumApps = apps.filter(app => app.isPremium).slice(0, 5);

  // Safe check for hero image
  const heroApp = featuredApps[0];
  const heroImage = heroApp ? (heroApp.banner || heroApp.screenshots?.[0] || '') : '';

  return (
    <div className="min-h-screen pt-20 bg-light-bg dark:bg-dark-bg">
      {/* Hero Slider */}
      <section className="container mb-12">
        {heroApp && heroImage && (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[21/10] md:aspect-[21/8]">
            <img 
              src={heroImage} 
              alt="Hero" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3">
              <span className="inline-block bg-primary px-3 py-1 rounded-full text-xs font-bold text-white mb-4 shadow-lg">
                FEATURED
              </span>
              <h1 className="text-2xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                {heroApp.title}
              </h1>
              <p className="text-gray-200 mb-6 line-clamp-2 text-sm md:text-lg drop-shadow-md">
                {heroApp.description}
              </p>
              <div className="flex gap-4">
                <Link to={`/app/${heroApp.id}`}>
                  <Button variant="primary" size="lg" className="font-bold shadow-lg shadow-primary/30">
                    Download Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="container mb-12 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
        <div className="flex md:grid md:grid-cols-8 gap-4 min-w-max md:min-w-0">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/store?cat=${cat.name}`}
              className="flex flex-col items-center gap-3 group w-20 md:w-auto"
            >
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm group-hover:shadow-lg group-hover:-translate-y-1">
                <Gamepad2 size={28} />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="container mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-yellow-500" fill="currentColor" /> Recommended for You
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on your interests</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {recommendedApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      {/* Trending Games */}
      <section className="container mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Flame className="text-orange-500" fill="currentColor" /> Trending This Week
          </h2>
          <Link to="/store?sort=trending" className="text-primary text-sm font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {trendingApps.map((app) => (
            <div key={app.id} className="relative">
              <span className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <Flame size={10} fill="currentColor" /> HOT
              </span>
              <AppCard app={app} />
            </div>
          ))}
        </div>
      </section>

      {/* Premium Games */}
      <section className="container mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Premium Games</h2>
          <Link to="/store?type=premium" className="text-primary text-sm font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {premiumApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
