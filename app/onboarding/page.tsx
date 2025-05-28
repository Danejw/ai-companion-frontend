'use client';

import { OnboardingFlowProvider, useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10 } from '@/components/onboarding/screens';

const screens = [
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
  Screen9,
  Screen10,
];

function Renderer() {
  const { screenId } = useOnboardingFlow();
  const Screen = screens[screenId - 1] ?? Screen1;
  return <Screen />;
}

export default function OnboardingPage() {
  return (
    <OnboardingFlowProvider>
      <Renderer />
    </OnboardingFlowProvider>
  );
}
