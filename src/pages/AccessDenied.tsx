import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-4">
      <div className="text-center max-w-md">
        <div className="bg-red-100 dark:bg-red-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          You do not have permission to view this page. Please contact your administrator if you believe this is an error.
        </p>
        <Link to="/">
          <Button variant="primary" className="gap-2">
            <Home size={18} /> Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
