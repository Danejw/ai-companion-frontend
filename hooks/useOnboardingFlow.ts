'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ResponseMap {
  [key: number]: any;
}

interface OnboardingFlowContextValue {
  screenId: number;
  responses: ResponseMap;
  next: () => void;
  prev: () => void;
  submitAnswer: (id: number, response: any, complete?: boolean) => Promise<void>;
}

const OnboardingFlowContext = createContext<OnboardingFlowContextValue | null>(null);

export function OnboardingFlowProvider({ children }: { children: ReactNode }) {
  const [screenId, setScreenId] = useState(1);
  const [responses, setResponses] = useState<ResponseMap>({});

  const next = () => setScreenId((id) => Math.min(id + 1, 10));
  const prev = () => setScreenId((id) => Math.max(id - 1, 1));

  const submitAnswer = async (id: number, response: any, complete?: boolean) => {
    setResponses((prev) => ({ ...prev, [id]: response }));
    try {
      await fetch('/api/onboarding/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screen_id: id, response, complete }),
      });
    } catch (err) {
      console.error('Failed to update onboarding:', err);
    }
    if (!complete) next();
  };

  return (
    <OnboardingFlowContext.Provider value={{ screenId, responses, next, prev, submitAnswer }}>
      {children}
    </OnboardingFlowContext.Provider>
  );
}

export function useOnboardingFlow() {
  const ctx = useContext(OnboardingFlowContext);
  if (!ctx) {
    throw new Error('useOnboardingFlow must be used within OnboardingFlowProvider');
  }
  return ctx;
}
