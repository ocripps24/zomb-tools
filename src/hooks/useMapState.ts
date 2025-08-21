import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface MapStep {
  id: string;
  name: string;
  path: string;
  component: React.ComponentType<any>;
}

export interface UseMapStateOptions {
  steps: MapStep[];
  basePath: string; // e.g. "/bo6/terminus" 
  storagePrefix: string; // e.g. "terminus"
}

export interface UseMapStateReturn {
  // Navigation state
  activeStepIndex: number;
  currentStep: MapStep | null;
  
  // Navigation functions
  goToStep: (stepPath: string) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  
  // Data management
  getStepData: (stepId: string) => any;
  handleStepDataChange: (stepId: string, data: any) => void;
  
  // Reset functionality
  handleReset: () => void;
}

/**
 * Custom hook for managing multi-step map state and navigation.
 * 
 * This hook consolidates the common patterns used across all map components:
 * - Multi-step navigation with React Router
 * - Per-step state management
 * - Automatic redirection to first step
 * - Data persistence and reset functionality
 * 
 * @param options Configuration for the map
 * @returns Object with navigation state, functions, and data management
 */
export function useMapState({ steps, basePath, storagePrefix }: UseMapStateOptions): UseMapStateReturn {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize state for each step
  const [stepData, setStepData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {};
    steps.forEach(step => {
      initialData[step.id] = {};
    });
    return initialData;
  });
  
  // Current path and step logic
  const currentPath = location.pathname;
  const currentStepIndex = steps.findIndex((step) => step.path === currentPath);
  
  // Get active step index (with fallback to first step)
  const getActiveStepIndex = () => {
    if (currentStepIndex >= 0) {
      return currentStepIndex;
    }
    return 0;
  };
  
  const activeStepIndex = getActiveStepIndex();
  const currentStep = steps[activeStepIndex] || null;
  
  // Auto-redirect to first step if visiting base URL
  useEffect(() => {
    if (currentPath === basePath || currentPath === `${basePath}/`) {
      navigate(steps[0].path, { replace: true });
    }
  }, [currentPath, navigate, basePath, steps]);
  
  // Navigation functions
  const goToStep = useCallback((stepPath: string) => {
    navigate(stepPath);
  }, [navigate]);
  
  const goToNext = useCallback(() => {
    if (activeStepIndex < steps.length - 1) {
      navigate(steps[activeStepIndex + 1].path);
    }
  }, [activeStepIndex, steps, navigate]);
  
  const goToPrevious = useCallback(() => {
    if (activeStepIndex > 0) {
      navigate(steps[activeStepIndex - 1].path);
    }
  }, [activeStepIndex, steps, navigate]);
  
  // Data management functions
  const getStepData = useCallback((stepId: string) => {
    return stepData[stepId] || {};
  }, [stepData]);
  
  const handleStepDataChange = useCallback((stepId: string, data: any) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: data
    }));
  }, []);
  
  // Reset functionality
  const handleReset = useCallback(() => {
    // Reset all step data
    const resetData: Record<string, any> = {};
    steps.forEach(step => {
      resetData[step.id] = {};
    });
    setStepData(resetData);
    
    // Clear localStorage for all steps
    steps.forEach(step => {
      const storageKey = `${storagePrefix}-${step.id.replace(/-/g, '-')}-data`;
      console.log(`Removing localStorage key: ${storageKey}`);
      localStorage.removeItem(storageKey);
    });
  }, [steps, storagePrefix]);
  
  return {
    // Navigation state
    activeStepIndex,
    currentStep,
    
    // Navigation functions
    goToStep,
    goToNext,
    goToPrevious,
    
    // Data management
    getStepData,
    handleStepDataChange,
    
    // Reset functionality
    handleReset
  };
}