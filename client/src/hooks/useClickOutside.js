// hooks/useClickOutside.js
import { useEffect } from 'react';

export const useClickOutside = (ref, callback, ignoreRef) => {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        if (!ignoreRef?.current?.contains(event.target)) {
          callback();
        }
      }
    };
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback, ignoreRef]);
};