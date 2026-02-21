import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Activity, Flag, MessageSquare, AlertTriangle, CheckCircle, Calendar, Smartphone, HardDrive, User } from 'lucide-react';
import { useGames } from '../context/GameContext';
import SmartDownloadButton from '../components/ui/SmartDownloadButton';
import Button from '../components/ui/Button';
import ReportModal from '../components/ui/ReportModal';

const AppDetails = () => {
  const { id } = useParams();
  const { getAppById } = useGames();
  const [showReportModal, setShowReportModal] = useState(false);
  
  const app = getAppById(id || '') || getAppById('1');

  if (!app) return <div>App not found</div>;

  const isRemoved = app.status === 'removed' || app.status === 'soft_deleted';
  // Fix: Ensure iconSrc is never empty
  const iconSrc = (app.icon && app.icon.trim() !== '') ? app.icon : null;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-light-bg dark:bg-dark-bg">
      <div className="container">
        {/* Mod Warning */}
        {app.isMod && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-4 text-red-700 dark:text-red-400">
            <AlertTriangle className="flex-shrink-0" />
            <div>
              <h4 className="font-bold">Modified Version</h4>
              <p className="text-sm">This is a modified version of the original game. Use at your own risk.</p>
            </div>
          </div>
        )}

        {/* Removed Warning */}
        {isRemoved && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 mb-6 text-center">
            <AlertTriangle className="mx-auto text-orange-500 mb-2" size={32} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Game Currently Unavailable</h2>
            <p className="text-gray-500 mb-4">This game has been removed by the administration.</p>
            <div className="flex justify-center gap-4">
              <Link to="/support">
                <Button variant="outline" className="gap-2"><MessageSquare size={16}/> Request Re-upload</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Header Info */}
        <div className={`bg-white dark:bg-dark-card rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 ${isRemoved ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {iconSrc ? (
              <img 
                src={iconSrc} 
                alt={app.title} 
                className="w-32 h-32 rounded-3xl shadow-lg object-cover mx-auto md:mx-0"
              />
            ) : (
              <div className="w-32 h-32 rounded-3xl bg-gray-200 dark:bg-gray-700 mx-auto md:mx-0" />
            )}
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{app.title}</h1>
                  <div className="text-primary font-medium mb-4">{app.developer}</div>
                </div>
                
                {/* Badges */}
                <div className="flex flex-col gap-2 items-end w-full md:w-auto">
                  {app.virusScanStatus === 'clean' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                      <ShieldCheck size={14} /> Virus Scan Passed
                    </div>
                  )}
                  {app.techAnalysisStatus === 'passed' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold">
                      <Activity size={14} /> Technical Analysis OK
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mb-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 p-1 rounded">
                    <Star size={16} fill="currentColor" />
                  </span>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{app.rating}</div>
                    <div className="text-gray-500 text-xs">Rating</div>
                  </div>
                </div>
                <div className="w-px bg-gray-200 dark:bg-gray-700 h-8 self-center"></div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{app.downloads}</div>
                  <div className="text-gray-500 text-xs">Downloads</div>
                </div>
              </div>

              {!isRemoved && (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <SmartDownloadButton app={app} className="flex-1 md:flex-none md:w-64 w-full" />
                  
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm font-medium px-4 py-2"
                  >
                    <Flag size={18} /> Report Problem
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Layout: Description First, then App Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <section className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About Game</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{app.description}</p>
            </section>

            {/* Screenshots */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Screenshots</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {app.screenshots.map((shot, idx) => (
                  <img key={idx} src={shot} alt={`Screenshot ${idx + 1}`} className="h-48 md:h-64 rounded-xl shadow-sm object-cover flex-shrink-0" />
                ))}
              </div>
            </section>
          </div>

          {/* App Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">App Information</h3>
              
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> This game is available for your device
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 flex items-center gap-2"><Smartphone size={14}/> Category</span>
                  <span className="font-medium dark:text-white">{app.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 flex items-center gap-2"><User size={14}/> Developer</span>
                  <span className="font-medium dark:text-white">{app.developer}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 flex items-center gap-2"><Calendar size={14}/> Uploaded</span>
                  <span className="font-medium dark:text-white">{app.updatedDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500">Version</span>
                  <span className="font-medium dark:text-white">{app.platforms[0]?.version || '1.0.0'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 flex items-center gap-2"><HardDrive size={14}/> Size</span>
                  <span className="font-medium dark:text-white">{app.platforms[0]?.size || 'Unknown'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Requires</span>
                  <span className="font-medium dark:text-white">{app.platforms[0]?.minOs || 'Android 5.0+'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReportModal && <ReportModal app={app} onClose={() => setShowReportModal(false)} />}
    </div>
  );
};

export default AppDetails;
