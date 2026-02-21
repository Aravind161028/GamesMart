import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Download, User, Moon, Sun, LogOut, Shield, LayoutDashboard, Smartphone, Library, MessageSquare } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800' 
          : 'bg-white dark:bg-dark-bg border-b border-transparent dark:border-gray-800'
      }`}
    >
      <div className="container h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-primary text-white p-1.5 rounded-lg">
            <Download size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              GAMES MART
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider">
              SAFE APK STORE
            </span>
          </div>
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search apps, games, packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2.5 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </form>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link to="/store" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium text-sm">
            Store
          </Link>

          {isAuthenticated && (
            <Link to="/library" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium text-sm flex items-center gap-1">
              <Library size={16} /> My Games
            </Link>
          )}

          <Link to="/support" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium text-sm flex items-center gap-1">
            <MessageSquare size={16} /> Support
          </Link>

          <Link to="/mobile-app" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium text-sm flex items-center gap-1">
            <Smartphone size={16} /> Get App
          </Link>

          {hasRole(['owner', 'ceo']) && (
            <Link to="/owner-dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium text-sm flex items-center gap-1">
              <LayoutDashboard size={16} /> CEO Panel
            </Link>
          )}

          {hasRole(['owner', 'ceo', 'md', 'manager', 'tl', 'staff']) && (
            <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium text-sm flex items-center gap-1">
              <Shield size={16} /> Control Panel
            </Link>
          )}
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user?.username[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                  {user?.role === 'ceo' ? `${user.username} (CEO)` : user?.username}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.email}</p>
                  </div>
                  <Link to="/library" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">My Library</Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm" className="rounded-full px-5">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="p-2 text-gray-900 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-gray-800 absolute w-full px-4 py-4 shadow-lg">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </form>
          
          <div className="flex flex-col gap-2">
            <Link to="/" className="py-3 px-2 text-gray-900 dark:text-white font-medium border-b border-gray-100 dark:border-gray-800">Home</Link>
            <Link to="/store" className="py-3 px-2 text-gray-900 dark:text-white font-medium border-b border-gray-100 dark:border-gray-800">Store</Link>
            {isAuthenticated && (
              <Link to="/library" className="py-3 px-2 text-gray-900 dark:text-white font-medium border-b border-gray-100 dark:border-gray-800">My Library</Link>
            )}
            <Link to="/support" className="py-3 px-2 text-gray-900 dark:text-white font-medium border-b border-gray-100 dark:border-gray-800">Support</Link>
            <Link to="/mobile-app" className="py-3 px-2 text-gray-900 dark:text-white font-medium border-b border-gray-100 dark:border-gray-800">Get App</Link>
            
            {hasRole(['owner', 'ceo', 'md', 'manager', 'tl', 'staff']) && (
              <Link to="/admin" className="py-3 px-2 text-gray-900 dark:text-white font-medium border-b border-gray-100 dark:border-gray-800">Control Panel</Link>
            )}

            {isAuthenticated ? (
              <button onClick={handleLogout} className="mt-4 w-full text-left py-3 px-2 text-red-500 font-medium">
                Sign Out
              </button>
            ) : (
              <Link to="/login" className="mt-4">
                <Button fullWidth>Sign In / Sign Up</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
