import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [displayedContent, setDisplayedContent] = useState(children);
  const previousLocation = useRef(location.pathname);

  useEffect(() => {
    // Only trigger transition if location actually changed
    if (previousLocation.current !== location.pathname) {
      // Start fade out
      setIsVisible(false);
      
      // After fade out completes, update content and fade in
      const timer = setTimeout(() => {
        setDisplayedContent(children);
        setIsVisible(true);
        previousLocation.current = location.pathname;
      }, 150); // Half of transition duration
      
      return () => clearTimeout(timer);
    } else {
      // If location didn't change, just update content
      setDisplayedContent(children);
    }
  }, [location.pathname, children]);

  return (
    <div
      className={`page-transition ${isVisible ? 'fade-enter-active' : 'fade-exit-active'} ${!isVisible ? 'transitioning' : ''}`}
      key={location.pathname}
    >
      {displayedContent}
    </div>
  );
}