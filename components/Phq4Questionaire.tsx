import React, { useState } from 'react';
import { Button } from './ui/button';
import { submitPhq4Response, Phq4Questionaire } from '@/lib/api/pqh4';
import { toast } from 'sonner';

export type QuestionnaireStage = 'pre' | 'post';
export type QuestionnaireResponses = { q1: number; q2: number; q3: number; q4: number };

export interface Phq4QuestionnaireProps {
  onSubmit: (responses: QuestionnaireResponses) => void;
  stage: QuestionnaireStage;
  onClose: () => void;
}

const QUESTIONS = [
  { id: 'q1', text: 'Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?' },
  { id: 'q2', text: 'How often have you not been able to stop or control worrying?' },
  { id: 'q3', text: 'How often have you had little interest or pleasure in doing things?' },
  { id: 'q4', text: 'How often have you been feeling down, depressed, or hopeless?' },
];

// Reusable questionnaire component
export function Phq4Questionnaire({ onSubmit, stage, onClose }: Phq4QuestionnaireProps) {
    const [responses, setResponses] = useState<QuestionnaireResponses>({ q1: -1, q2: -1, q3: -1, q4: -1 });
    const [isWaiting, setIsWaiting] = useState(false);
  
    const handleChange = (id: string, value: number) => {
      setResponses(prev => ({ ...prev, [id]: value }));
    };
  
    const handleSubmit = async () => {
      // ensure all answered
      const allAnswered = QUESTIONS.every(q => responses[q.id as keyof QuestionnaireResponses] >= 0);
      if (!allAnswered) return;
      setIsWaiting(true);
      try {
        onSubmit(responses);

        const response: Phq4Questionaire = {
          stage: stage,
          q1: responses.q1,
          q2: responses.q2,
          q3: responses.q3,
          q4: responses.q4,
          phq4_score: responses.q1 + responses.q2 + responses.q3 + responses.q4,
        };
        await submitPhq4Response(response);

        toast.info('PHQ-4 response submitted');
        onClose();
      } finally {
        setIsWaiting(false);
      }
    };
  
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Pilot Program Check-In</h2>
        <p className="text-gray-600 text-base italic mb-4 text-center">
          {stage === 'pre'
            ? "Quick set of questions to understand how you've been feeling."
            : "One last set to see how things have changed."
          }
        </p>
  
        {QUESTIONS.map(({ id, text }) => (
          <div
            key={id}
            className="bg-gray-50 rounded-lg p-4 shadow-sm space-y-3 border border-gray-200"
          >
            <p className="font-semibold text-gray-800">{text}</p>
            <div className="flex flex-wrap gap-4">
              {[
                { value: 0, label: 'Not at all' },
                { value: 1, label: 'Several days' },
                { value: 2, label: 'More than half the days' },
                { value: 3, label: 'Nearly every day' },
              ].map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition"
                >
                  <input
                    type="radio"
                    name={id}
                    value={option.value}
                    checked={responses[id as keyof QuestionnaireResponses] === option.value}
                    onChange={() => handleChange(id, option.value)}
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
  
        <Button
          variant="default"
          onClick={handleSubmit}
          disabled={isWaiting || !QUESTIONS.every(q => responses[q.id as keyof QuestionnaireResponses] >= 0)}
          className="mt-2 w-full disabled:bg-gray-300"
        >
          {isWaiting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    );
  }