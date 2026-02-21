import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Upload, AlertTriangle, Loader2, ScanLine } from 'lucide-react';
import Button from '../ui/Button';
import { usePayment } from '../../context/PaymentContext';
import { AppData } from '../../types';
import { uploadToCloud } from '../../services/StorageService';
import { formatPrice } from '../../lib/utils';

interface PaymentModalProps {
  app: AppData;
  onClose: () => void;
}

const PaymentModal = ({ app, onClose }: PaymentModalProps) => {
  const { settings, initiatePurchase, submitPaymentProof } = usePayment();
  const [step, setStep] = useState<'pay' | 'verify' | 'success'>('pay');
  const [currentTxId, setCurrentTxId] = useState<string>('');
  
  // Verification Form
  const [userTxnId, setUserTxnId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Generate QR Code URL based on UPI ID
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${settings.upiId}&pn=GamesMart&am=${app.price}&cu=INR`;

  const handleStartPayment = async () => {
    try {
      const txId = await initiatePurchase(app);
      setCurrentTxId(txId);
      setStep('verify');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const url = await uploadToCloud(e.target.files[0]);
        setScreenshot(url);
      } catch (err) {
        setError("Failed to upload screenshot");
      }
    }
  };

  const handleSubmitProof = async () => {
    if (!userTxnId) {
      setError("Paytm Transaction ID is required");
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await submitPaymentProof(currentTxId, userTxnId, screenshot);
      setStep('success');
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-dark-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-bold text-gray-900 dark:text-white">
            Purchase {app.title}
          </h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-6">
          {step === 'pay' && (
            <div className="text-center space-y-6">
              <div className="bg-white p-4 rounded-xl inline-block shadow-lg border-2 border-primary/20">
                {qrUrl && qrUrl !== '' && <img src={qrUrl} alt="Scan to Pay" className="w-64 h-64 object-contain" />}
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 text-primary font-bold text-lg mb-1">
                  <ScanLine className="animate-pulse" /> Scan to Pay {formatPrice(app.price || 0)}
                </div>
                <p className="text-sm text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 py-1 px-3 rounded inline-block">
                  {settings.upiId}
                </p>
                <p className="text-xs text-gray-400 mt-2">Use Paytm, GPay, or any UPI App</p>
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button fullWidth onClick={handleStartPayment} variant="primary" size="lg">
                I Have Paid
              </Button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-5">
              <div className="text-center">
                <h4 className="font-bold text-lg">Payment Verification</h4>
                <p className="text-xs text-gray-500">Please provide details to unlock download</p>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertTriangle size={16} /> {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold mb-1">Paytm Transaction ID <span className="text-red-500">*</span></label>
                <input 
                  value={userTxnId}
                  onChange={e => setUserTxnId(e.target.value)}
                  placeholder="e.g. 2023052012345678"
                  className="w-full p-3 rounded-lg border dark:bg-dark-bg dark:border-gray-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">UTR Number (Optional)</label>
                <input 
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  placeholder="e.g. 123456789012"
                  className="w-full p-3 rounded-lg border dark:bg-dark-bg dark:border-gray-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Screenshot (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  {(screenshot && screenshot.trim() !== '') ? (
                    <div className="relative">
                      <img src={screenshot} className="h-32 mx-auto rounded object-contain" />
                      <button onClick={() => setScreenshot('')} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block w-full h-full">
                      <Upload className="mx-auto text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Upload Payment Proof</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleScreenshotUpload} />
                    </label>
                  )}
                </div>
              </div>

              <Button fullWidth onClick={handleSubmitProof} disabled={isSubmitting || !userTxnId} size="lg">
                {isSubmitting ? <><Loader2 className="animate-spin mr-2"/> Verifying...</> : 'Submit Verification'}
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Request Submitted</h3>
              <p className="text-gray-500 mb-8">
                Admin approval is required. Once approved, you will be notified and the game will unlock automatically.
              </p>
              <Button onClick={onClose} fullWidth>Close</Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
