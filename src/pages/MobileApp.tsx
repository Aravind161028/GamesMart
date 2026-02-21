import { Download, Shield, Smartphone, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const MobileApp = () => {
  const DOWNLOAD_URL = "https://appsgeyser.io/19438400/Games%20Mart";

  const handleDownload = () => {
    window.open(DOWNLOAD_URL, '_blank');
  };

  return (
    <div className="min-h-screen pt-20 bg-light-bg dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 dark:bg-primary/10 py-16 md:py-24">
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white dark:bg-white/10 px-4 py-2 rounded-full text-primary font-bold text-sm mb-6 shadow-sm"
              >
                <Smartphone size={16} />
                <span>Official Android App</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
              >
                Get <span className="text-primary">Games Mart</span> on your Mobile
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto md:mx-0"
              >
                The fastest way to download games. Enjoy exclusive features, auto-updates, and a smoother experience with our dedicated Android app.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start items-start"
              >
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="gap-3 shadow-xl shadow-primary/20 w-full sm:w-auto"
                    onClick={handleDownload}
                  >
                    <Download size={24} />
                    <div className="text-left leading-tight">
                      <div className="text-[10px] uppercase font-bold opacity-80">Download APK</div>
                      <div className="text-lg font-bold">Latest Version</div>
                    </div>
                  </Button>
                  <a 
                    href={DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-center text-gray-500 dark:text-gray-400 hover:text-primary underline cursor-pointer"
                  >
                    If download does not start, tap here
                  </a>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 px-4 py-3 bg-white/50 dark:bg-black/20 rounded-lg border border-gray-100 dark:border-gray-800 self-center sm:self-start">
                  <Shield size={16} className="text-green-500" />
                  Verified Safe
                </div>
              </motion.div>
            </div>
            
            <div className="flex-1 relative mt-8 md:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-3xl rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400&h=800" 
                alt="App Preview" 
                className="relative mx-auto w-64 md:w-80 rounded-[3rem] border-8 border-white dark:border-gray-800 shadow-2xl rotate-[-5deg] hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-gray-800">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Faster Downloads</h3>
              <p className="text-gray-500 dark:text-gray-400">Optimized download engine that maximizes your speed and supports background downloading.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">100% Secure</h3>
              <p className="text-gray-500 dark:text-gray-400">Every app is scanned for malware. We prioritize your security and privacy above all.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Auto Updates</h3>
              <p className="text-gray-500 dark:text-gray-400">Get notified instantly when your favorite games have new updates available.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="py-16 container max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">How to Install</h2>
        
        <div className="space-y-6">
          <div className="flex gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Download the APK</h3>
              <p className="text-gray-500 dark:text-gray-400">Click the download button above to save the Games Mart APK file to your device.</p>
            </div>
          </div>
          
          <div className="flex gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enable Unknown Sources</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-3">If prompted, allow installation from your browser.</p>
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-4 rounded-xl flex gap-3 text-sm text-yellow-800 dark:text-yellow-500">
                <AlertTriangle size={20} className="flex-shrink-0" />
                <p>Settings &gt; Security &gt; Allow installation from unknown sources</p>
              </div>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Install & Play</h3>
              <p className="text-gray-500 dark:text-gray-400">Open the downloaded file and click Install. Once done, open Games Mart and start downloading!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileApp;
