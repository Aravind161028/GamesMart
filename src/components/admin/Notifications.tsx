import { useState } from 'react';
import { Bell, Send } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Notifications = () => {
  const { sendSystemNotification, hasRole } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // Permission: Manager+
  if (!hasRole(['manager'])) {
    return <div className="p-8 text-center text-gray-500">Access Restricted</div>;
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && message) {
      sendSystemNotification(title, message);
      setSent(true);
      setTitle('');
      setMessage('');
      setTimeout(() => setSent(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-dark-card p-8 rounded-xl border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell size={32} className="text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Push Notifications</h2>
        <p className="text-gray-500">Send alerts to all registered users.</p>
      </div>

      <form onSubmit={handleSend} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Notification Title</label>
          <input 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg border dark:bg-dark-bg dark:border-gray-700"
            placeholder="e.g. New Game Released!"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Message Body</label>
          <textarea 
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full p-3 rounded-lg border dark:bg-dark-bg dark:border-gray-700"
            rows={4}
            placeholder="Enter your message here..."
            required
          />
        </div>
        <Button size="lg" fullWidth className="gap-2" disabled={sent}>
          {sent ? 'Sent Successfully!' : <><Send size={18} /> Send to All Users</>}
        </Button>
      </form>
    </div>
  );
};

export default Notifications;
