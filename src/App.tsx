import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Store from './pages/Store';
import AppDetails from './pages/AppDetails';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import OwnerDashboard from './pages/OwnerDashboard';
import AccessDenied from './pages/AccessDenied';
import Support from './pages/Support';
import Privacy from './pages/Privacy';
import Disclaimer from './pages/Disclaimer';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MobileApp from './pages/MobileApp';
import MyLibrary from './pages/MyLibrary';
import DownloadManager from './components/ui/DownloadManager';
import { DownloadProvider } from './context/DownloadContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <DownloadProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route 
                path="/store" 
                element={
                  <ProtectedRoute>
                    <Store />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/library" 
                element={
                  <ProtectedRoute>
                    <MyLibrary />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/app/:id" element={<AppDetails />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/support" element={<Support />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="/mobile-app" element={<MobileApp />} />
              
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['owner', 'ceo', 'md', 'manager', 'tl', 'staff']}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/owner-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['owner', 'ceo']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <DownloadManager />
        </div>
      </DownloadProvider>
    </Router>
  );
}

export default App;
