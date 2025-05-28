'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';

interface InputScreenProps {
  id: number;
  question: string;
  complete?: boolean;
  textarea?: boolean;
}

function InputScreen({ id, question, complete, textarea }: InputScreenProps) {
  const { submitAnswer } = useOnboardingFlow();
  const [value, setValue] = useState('');
  const Field = textarea ? Textarea : Input;

  return (
    <div className="min-h-screen flex flex-col justify-between p-4">
      <div className="flex-1">
        <p className="mb-4 text-lg">{question}</p>
        <Field
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setValue(e.target.value)
          }
        />
      </div>
      <Button className="mt-6" onClick={() => submitAnswer(id, value, complete)}>
        {complete ? 'Finish' : 'Next'}
      </Button>
    </div>
  );
}

export function Screen1() {
  return <InputScreen id={1} question="What's your name?" />;
}
export function Screen2() {
  return <InputScreen id={2} question="How old are you?" />;
}
export function Screen3() {
  return <InputScreen id={3} question="Where do you live?" />;
}
export function Screen4() {
  return <InputScreen id={4} question="What's your favorite hobby?" />;
}
export function Screen5() {
  return <InputScreen id={5} question="How did you hear about us?" />;
}
export function Screen6() {
  return <InputScreen id={6} question="What's your primary goal with Knolia?" textarea />;
}
export function Screen7() {
  return <InputScreen id={7} question="Would you like notifications?" />;
}
export function Screen8() {
  return <InputScreen id={8} question="Pick a preferred color theme" />;
}
export function Screen9() {
  return <InputScreen id={9} question="Share one fun fact about yourself" textarea />;
}
export function Screen10() {
  return <InputScreen id={10} question="Ready to start?" complete />;
}
