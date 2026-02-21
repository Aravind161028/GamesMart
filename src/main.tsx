import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GameProvider } from './context/GameContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { PaymentProvider } from './context/PaymentContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <GameProvider>
        <PaymentProvider>
          <App />
        </PaymentProvider>
      </GameProvider>
    </AuthProvider>
  </StrictMode>,
);
