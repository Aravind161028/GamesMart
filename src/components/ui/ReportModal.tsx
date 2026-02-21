import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Bug, ShieldAlert, CreditCard, Upload, CheckCircle } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { AppData } from '../../types';
import { uploadToCloud } from '../../services/StorageService';

interface ReportModalProps {
  app?: AppData;
  onClose: () => void;
}

const ReportModal = ({ app, onClose }: ReportModalProps) => {
  const { submitTicket, user } = useAuth();
  const [type, setType] = useState<'bug' | 'fake_app' | 'virus' | 'payment_issue' | 'other'>('bug');
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const url = await uploadToCloud(e.target.files[0]);
        setScreenshot(url);
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'payment_issue' && !screenshot) {
      alert("Please upload a screenshot for payment issues.");
      return;
    }

    submitTicket({
      userId: user?.id,
      name: user?.username || 'Guest',
      email: user?.email || 'guest@example.com',
      type,
      gameName: app?.title || 'General Report',
      gameId: app?.id,
      message,
      transactionId,
      utrNumber,
      screenshot
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report Submitted</h3>
          <p className="text-gray-500 mb-6">Thank you. We will investigate immediately.</p>
          <Button onClick={onClose} fullWidth>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-dark-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} /> Report a Problem
          </h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {app && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-2">
              <img src={app.icon || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <div className="font-bold text-sm text-gray-900 dark:text-white">{app.title}</div>
                <div className="text-xs text-gray-500">Reporting this app</div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">What's the issue?</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'bug', label: 'App Bug / Crash', icon: Bug },
                { id: 'fake_app', label: 'Fake App', icon: AlertTriangle },
                { id: 'virus', label: 'Virus / Malware', icon: ShieldAlert },
                { id: 'payment_issue', label: 'Payment Issue', icon: CreditCard },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setType(opt.id as any)}
                  className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-colors ${
                    type === opt.id 
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <opt.icon size={20} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Details</label>
            <textarea 
              required
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe the problem..."
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          {type === 'payment_issue' && (
            <div className="space-y-3 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl">
              <h4 className="font-bold text-sm">Payment Details</h4>
              <div>
                <label className="block text-xs font-medium mb-1">Transaction ID (Optional)</label>
                <input 
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  className="w-full p-2 rounded border dark:bg-dark-bg dark:border-gray-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">UTR Number (Optional)</label>
                <input 
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  className="w-full p-2 rounded border dark:bg-dark-bg dark:border-gray-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Proof Screenshot (Required)</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer border border-dashed border-gray-300 dark:border-gray-600 rounded p-2 text-center hover:bg-white dark:hover:bg-gray-800">
                    <span className="text-xs text-gray-500">{isUploading ? 'Uploading...' : 'Choose File'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleScreenshotUpload} />
                  </label>
                  {screenshot && <CheckCircle size={20} className="text-green-500" />}
                </div>
                {screenshot && <img src={screenshot} className="mt-2 h-20 rounded object-cover" />}
              </div>
            </div>
          )}

          <Button type="submit" variant="primary" fullWidth size="lg">Submit Report</Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReportModal;
