import { useState } from 'react';
import { usePayment } from '../../context/PaymentContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Eye, AlertTriangle, Clock, X } from 'lucide-react';
import Button from '../ui/Button';

const PendingPayments = () => {
  const { pendingTransactions, verifyTransaction, rejectTransaction } = usePayment();
  const { user, hasRole } = useAuth();
  const [viewImage, setViewImage] = useState<string | null>(null);

  // Permissions
  const canApprove = hasRole(['owner', 'md', 'manager']);
  const canRecommend = hasRole(['tl']);

  if (pendingTransactions.length === 0) {
    return <div className="p-8 text-center text-gray-500">No pending payments to review.</div>;
  }

  return (
    <div className="space-y-6">
      {pendingTransactions.map(tx => (
        <div key={tx.id} className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock size={12} /> Pending Verification
                </span>
                <span className="text-xs text-gray-400">{new Date(tx.date).toLocaleString()}</span>
              </div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{tx.gameName}</h4>
              <p className="text-sm text-gray-500 mb-4">User: {tx.userEmail}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                <div>
                  <span className="text-gray-500 block text-xs">Amount</span>
                  <span className="font-bold">${tx.amount}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Method</span>
                  <span className="font-bold">{tx.utrNumber ? 'UPI/UTR' : 'Paytm'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block text-xs">Transaction ID</span>
                  <span className="font-mono bg-white dark:bg-black/20 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 block mt-1">
                    {tx.transactionId}
                  </span>
                </div>
                {tx.utrNumber && (
                  <div className="col-span-2">
                    <span className="text-gray-500 block text-xs">UTR Number</span>
                    <span className="font-mono bg-white dark:bg-black/20 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 block mt-1">
                      {tx.utrNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-48 flex flex-col gap-3">
              <div className="relative group cursor-pointer" onClick={() => setViewImage(tx.screenshot || '')}>
                {tx.screenshot && tx.screenshot !== '' ? (
                  <img src={tx.screenshot} className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                ) : (
                  <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-400">No Image</div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <Eye className="text-white" />
                </div>
              </div>
              
              <div className="flex gap-2">
                {canApprove ? (
                  <>
                    <Button size="sm" variant="success" fullWidth onClick={() => verifyTransaction(tx.id, user?.id || 'system')}>
                      Approve
                    </Button>
                    <Button size="sm" variant="secondary" fullWidth onClick={() => rejectTransaction(tx.id, user?.id || 'system', 'Invalid Proof')}>
                      Reject
                    </Button>
                  </>
                ) : canRecommend ? (
                   <Button size="sm" variant="primary" fullWidth>Recommend Approval</Button>
                ) : (
                  <div className="text-xs text-center text-gray-500 italic">View Only Access</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Image Modal */}
      {viewImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4" onClick={() => setViewImage(null)}>
          <img src={viewImage} className="max-w-full max-h-[90vh] object-contain" />
          <button className="absolute top-4 right-4 text-white"><X size={32}/></button>
        </div>
      )}
    </div>
  );
};

export default PendingPayments;
