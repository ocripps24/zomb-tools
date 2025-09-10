import React, { useState, useEffect } from 'react';

interface TransitionWrapperProps {
  children: React.ReactNode;
  transitionKey: string;
  className?: string;
}

export function TransitionWrapper({ children, transitionKey, className = '' }: TransitionWrapperProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [content, setContent] = useState(children);

  useEffect(() => {
    if (content !== children) {
      // Start fade out
      setIsVisible(false);
      
      // After fade out completes, update content and fade in
      const timer = setTimeout(() => {
        setContent(children);
        setIsVisible(true);
      }, 150); // Half of the total transition duration
      
      return () => clearTimeout(timer);
    }
  }, [children, content]);

  return (
    <div className={`transition-wrapper ${className}`}>
      <div
        className={`step-content ${isVisible ? 'fade-enter-active' : 'fade-exit-active'} ${!isVisible ? 'transitioning' : ''}`}
        key={transitionKey}
      >
        {content}
      </div>
    </div>
  );
}