// useScrollLock.js
import { useEffect } from 'react';

const useScrollLock = () => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // Re-enable scrolling when hook unmounts
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
      document.body.style.height = 'auto';
    };
  }, []);
};

export default useScrollLock;
