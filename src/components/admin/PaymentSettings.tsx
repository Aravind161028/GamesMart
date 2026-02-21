import { useState } from 'react';
import { usePayment } from '../../context/PaymentContext';
import { QrCode, Upload, ToggleLeft, ToggleRight } from 'lucide-react';
import Button from '../ui/Button';

const PaymentSettings = () => {
  const { paymentMethods, togglePaymentMethod, updateQrCode } = usePayment();

  const handleFileChange = (methodId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateQrCode(methodId, e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <QrCode size={20} /> Payment Methods & QR Codes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map(method => (
            <div key={method.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">{method.name}</h4>
                <button onClick={() => togglePaymentMethod(method.id)} className="text-primary">
                  {method.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-gray-400" />}
                </button>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 bg-white rounded-lg p-2 shadow-sm flex-shrink-0">
                  <img src={method.qrImage} alt="QR" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-2">UPI ID: {method.upiId}</p>
                  <label className="cursor-pointer">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(method.id, e)} />
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-600 rounded text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Upload size={14} /> Update QR
                    </div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
