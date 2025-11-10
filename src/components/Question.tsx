'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Question as QuestionType } from '@/types';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (value: any) => void;
  defaultValue?: any;
}

export default function Question({ question, onAnswer, defaultValue }: QuestionProps) {
  const [value, setValue] = useState<any>(defaultValue || '');

  const handleSubmit = () => {
    if (value !== '' && value !== null && value !== undefined) {
      onAnswer(value);
    }
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup value={String(value)} onValueChange={(v) => setValue(Number(v))}>
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-blue-200 transition"
                >
                  <RadioGroupItem value={String(index)} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Votre réponse"
              className="text-lg p-4"
            />
            {question.unit && (
              <p className="text-sm text-gray-500">Unité : {question.unit}</p>
            )}
          </div>
        );

      case 'confidence-interval':
        const intervalValue = (typeof value === 'object' && value !== null) 
          ? value 
          : { min: '', max: '' };
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              Donnez un intervalle de confiance à 90% : vous êtes 90% certain que la
              vraie réponse se trouve dans cet intervalle.
            </p>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                placeholder="Min"
                value={value.min || ''}
                onChange={(e) => setValue({ ...value, min: e.target.value })}
                className="flex-1"
              />
              <span className="text-gray-500">à</span>
              <Input
                type="number"
                placeholder="Max"
                value={value.max || ''}
                onChange={(e) => setValue({ ...value, max: e.target.value })}
                className="flex-1"
              />
              {question.unit && <span className="text-gray-500">{question.unit}</span>}
            </div>
          </div>
        );

      case 'likert':
        const likertLabels = [
          'Fortement en désaccord',
          'Modérément en désaccord',
          'Légèrement en désaccord',
          "Légèrement d'accord",
          "Modérément d'accord",
          "Fortement d'accord",
        ];
        return (
          <RadioGroup value={String(value)} onValueChange={(v) => setValue(Number(v))}>
            <div className="space-y-2">
              {likertLabels.map((label, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded border hover:bg-gray-50"
                >
                  <RadioGroupItem value={String(index + 1)} id={`likert-${index}`} />
                  <Label htmlFor={`likert-${index}`} className="flex-1 cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      default:
        return <p className="text-red-500">Type de question non supporté</p>;
    }
  };

  const isValid = () => {
    if (question.type === 'confidence-interval') {
      return value.min && value.max && Number(value.min) < Number(value.max);
    }
    return value !== '' && value !== null && value !== undefined;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl leading-relaxed">{question.text}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderQuestionInput()}

        <Button
          onClick={handleSubmit}
          disabled={!isValid()}
          className="w-full"
          size="lg"
        >
          Suivant →
        </Button>
      </CardContent>
    </Card>
  );
}