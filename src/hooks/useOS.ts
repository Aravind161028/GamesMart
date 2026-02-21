import { useState, useEffect } from 'react';
import { PlatformType } from '../types';

export const useOS = () => {
  const [os, setOS] = useState<PlatformType | 'unknown'>('unknown');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    if (/android/.test(userAgent)) {
      setOS('android');
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      setOS('ios');
    } else if (/win/.test(userAgent)) {
      setOS('windows');
    } else if (/mac/.test(userAgent)) {
      setOS('mac');
    } else if (/linux/.test(userAgent)) {
      setOS('linux');
    } else {
      setOS('unknown');
    }
  }, []);

  return os;
};
