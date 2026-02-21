import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Smartphone, Monitor, Command, Terminal, Download } from 'lucide-react';
import { AppData, PlatformType } from '../../types';
import { cn } from '../../lib/utils';
import Button from './Button';

interface AppCardProps {
  app: AppData;
  className?: string;
  compact?: boolean;
}

const PlatformIcon = ({ type }: { type: PlatformType }) => {
  switch (type) {
    case 'android': return <Smartphone size={14} className="text-green-500" />;
    case 'ios': return <Smartphone size={14} className="text-gray-400" />;
    case 'windows': return <Monitor size={14} className="text-blue-400" />;
    case 'mac': return <Command size={14} className="text-gray-300" />;
    case 'linux': return <Terminal size={14} className="text-yellow-500" />;
    default: return null;
  }
};

const AppCard = ({ app, className, compact = false }: AppCardProps) => {
  const uniquePlatforms = Array.from(new Set(app.platforms.map(p => p.type)));
  // Fix: Ensure iconSrc is never empty string
  const iconSrc = (app.icon && app.icon.trim() !== '') ? app.icon : null;

  if (compact) {
    return (
      <Link to={`/app/${app.id}`} className="block group">
        <div className={cn("flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors", className)}>
          {iconSrc ? (
            <img src={iconSrc} alt={app.title} className="w-14 h-14 rounded-xl shadow-sm object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">{app.title}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className="flex items-center text-yellow-500"><Star size={12} fill="currentColor" className="mr-0.5"/> {app.rating}</span>
              <span>•</span>
              <div className="flex gap-1">
                {uniquePlatforms.map(p => <PlatformIcon key={p} type={p} />)}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full text-primary">
            <Download size={18} />
          </Button>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white dark:bg-dark-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 dark:border-gray-700 group',
        className
      )}
    >
      <Link to={`/app/${app.id}`} className="flex flex-col h-full">
        <div className="relative mb-4 self-center">
          {iconSrc ? (
            <img
              src={iconSrc}
              alt={app.title}
              className="w-24 h-24 rounded-2xl shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gray-200 dark:bg-gray-700" />
          )}
          {app.isFeatured && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              FEATURED
            </span>
          )}
        </div>

        <div className="text-center mb-2">
          <h3 className="text-gray-900 dark:text-white font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors" title={app.title}>
            {app.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{app.category}</p>
        </div>
        
        <div className="flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center text-yellow-500 font-medium">
            <Star size={12} fill="currentColor" className="mr-1" /> {app.rating}
          </span>
          <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
          <div className="flex gap-1.5">
            {uniquePlatforms.map(p => <PlatformIcon key={p} type={p} />)}
          </div>
        </div>

        <div className="mt-auto">
          <Button variant="secondary" size="sm" fullWidth className="text-primary hover:text-white hover:bg-primary transition-colors">
            Download
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};

export default AppCard;
