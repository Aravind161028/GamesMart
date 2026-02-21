import { useState } from 'react';
import { Send, CheckCircle, MessageSquare } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Support = () => {
  const { submitTicket } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gameName: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTicket({
      ...formData,
      email: 'user@system.com', // Auto-filled or from Auth
      type: 'request'
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl text-center max-w-md border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Received!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Thank you for your submission. We will review your request and upload the game soon.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">Submit Another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-light-bg dark:bg-dark-bg">
      <div className="container max-w-2xl">
        <div className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <MessageSquare className="text-primary" /> Support & Messages
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Send a message to the administration team.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                placeholder="Type your message here..."
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <Button type="submit" size="lg" fullWidth className="gap-2">
              <Send size={18} /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
