import { Download, Facebook, Twitter, Instagram, Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-800 pt-12 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <Download size={20} strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                GAMES MART
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Download Games & Apps Safely. The most trusted source for Android APKs. Fast, secure, and always free.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-4">Discover</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/store?sort=popular" className="hover:text-primary">Popular Games</Link></li>
              <li><Link to="/store?sort=new" className="hover:text-primary">New Releases</Link></li>
              <li><Link to="/store?cat=editors-choice" className="hover:text-primary">Editor's Choice</Link></li>
              <li><Link to="/store?cat=pre-register" className="hover:text-primary">Pre-register</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary">Submit APK</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary">DMCA Disclaimer</a></li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>

          {/* Safe Badge */}
          <div className="bg-gray-50 dark:bg-dark-bg p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
            <Shield className="w-10 h-10 text-success mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 dark:text-white mb-1">100% Safe</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Every APK is verified for security before being published. No viruses, no malware.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2025 Games Mart. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Cookies</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
