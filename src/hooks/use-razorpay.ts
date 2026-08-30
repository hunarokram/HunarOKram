import { useState, useCallback } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadRazorpay = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        setIsLoaded(true);
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setIsLoaded(true);
        resolve(true);
      };
      script.onerror = () => {
        reject(new Error('Razorpay SDK failed to load'));
      };
      
      document.body.appendChild(script);
    });
  }, []);

  const openCheckout = useCallback(
    async (options: any) => {
      if (!window.Razorpay) {
        await loadRazorpay();
      }
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    },
    [loadRazorpay]
  );

  return { isLoaded, loadRazorpay, openCheckout };
};
