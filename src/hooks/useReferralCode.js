import { useState, useEffect } from 'react';

export const useReferralCode = () => {
  const [referralCode, setReferralCode] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('referral_code');
    
    if (codeFromUrl) {
      localStorage.setItem('referral_code', codeFromUrl);
      setReferralCode(codeFromUrl);
      
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete('referral_code');
      window.history.replaceState({}, '', newUrl);
    } else {
      const savedCode = localStorage.getItem('referral_code');
      if (savedCode) {
        setReferralCode(savedCode);
      }
    }
  }, []);

  const clearReferralCode = () => {
    localStorage.removeItem('referral_code');
    setReferralCode(null);
  };

  return {
    referralCode,
    clearReferralCode
  };
};
