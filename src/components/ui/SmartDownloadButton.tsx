import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, ChevronDown, CreditCard, ExternalLink, ShieldCheck, AlertCircle, IndianRupee } from 'lucide-react';
import Button from './Button';
import { AppData, PlatformType } from '../../types';
import { useOS } from '../../hooks/useOS';
import { useAuth } from '../../context/AuthContext';
import { useGames } from '../../context/GameContext';
import { useDownloads } from '../../context/DownloadContext';
import { useNavigate } from 'react-router-dom';
import PlatformIcon from './PlatformIcon';
import PaymentModal from '../payment/PaymentModal';
import { formatPrice } from '../../lib/utils';

interface SmartDownloadButtonProps {
  app: AppData;
  className?: string;
}

const SmartDownloadButton = ({ app, className }: SmartDownloadButtonProps) => {
  const os = useOS();
  const { isAuthenticated, user } = useAuth();
  const { incrementDownload } = useGames();
  const { startDownload } = useDownloads();
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const recommendedPlatform = app.platforms.find(p => p.type === os);
  const isPurchased = !app.isPremium || (user?.purchasedGameIds?.includes(app.id));

  const handleMainClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (app.isPremium && !isPurchased) {
      setShowPaymentModal(true);
      return;
    }

    // If only one platform, download directly
    if (app.platforms.length === 1) {
      const p = app.platforms[0];
      initiateDownload(p.downloadUrl, p.type, p.sizeBytes || 0);
    } else {
      setShowModal(true);
    }
  };

  const initiateDownload = (url: string, platformType: PlatformType, sizeBytes: number) => {
    if (!url || url === '#') {
      alert("Download link not available yet.");
      return;
    }

    incrementDownload(app.id, platformType);
    startDownload(app.id, app.title, app.icon, platformType, url, sizeBytes);
    setShowModal(false);
  };

  return (
    <>
      <div className={className}>
        <Button 
          onClick={handleMainClick} 
          variant={app.isPremium && !isPurchased ? 'primary' : 'success'}
          size="lg" 
          fullWidth
          className="gap-2 shadow-lg shadow-green-500/20 relative overflow-hidden group"
        >
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              {app.isPremium && !isPurchased ? <IndianRupee size={20} /> : <Download size={20} className="group-hover:animate-bounce" />}
              <span className="font-bold">
                {app.isPremium && !isPurchased ? `Buy for ${formatPrice(app.price || 0)}` : 'Download'}
              </span>
            </div>
            {recommendedPlatform && (
              <span className="text-[10px] opacity-90 font-normal">
                {app.platforms.length > 1 ? 'Select Version' : `For ${os}`}
              </span>
            )}
          </div>
          {app.platforms.length > 1 && <ChevronDown className="ml-auto opacity-70" size={16} />}
        </Button>
        
        {/* Verification Badge & Disclaimer */}
        <div className="mt-2 space-y-1">
           <div className="flex items-center justify-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
            <ShieldCheck size={12} />
            Verified Safe & Hosted
          </div>
          <div className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
             <AlertCircle size={10} />
             Downloads are provided from official public sources.
          </div>
        </div>
      </div>

      {showPaymentModal && <PaymentModal app={app} onClose={() => setShowPaymentModal(false)} />}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-dark-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Platform</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>

              <div className="p-6 space-y-4">
                {app.platforms.map((p) => (
                  <div 
                    key={p.type} 
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-primary transition-colors cursor-pointer" 
                    onClick={() => initiateDownload(p.downloadUrl, p.type, p.sizeBytes || 0)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <PlatformIcon type={p.type} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white capitalize">{p.type}</div>
                          <div className="text-xs text-gray-500">{p.version} • {p.size}</div>
                        </div>
                      </div>
                      <Download size={20} className="text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartDownloadButton;
