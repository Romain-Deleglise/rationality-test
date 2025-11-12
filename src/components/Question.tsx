'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Question as QuestionType } from '@/types';
import { useState, useEffect } from 'react';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (value: any) => void;
  defaultValue?: any;
}

export default function Question({ question, onAnswer, defaultValue }: QuestionProps) {
  const [value, setValue] = useState<any>(defaultValue || '');
  const [isAnimating, setIsAnimating] = useState(true);

  // Réinitialiser quand la question change avec animation
  useEffect(() => {
    // Déclencher l'animation d'entrée
    setIsAnimating(true);

    if (question.type === 'ranking') {
      setValue(question.options?.map((_: any, i: number) => i) || []);
    } else if (question.type === 'confidence-interval') {
      setValue({ min: '', max: '' });
    } else if (question.type === 'multiple-choice-confidence') {
      setValue({ choice: undefined, confidence: undefined });
    } else {
      setValue(defaultValue || '');
    }

    // Supprimer la classe d'animation après un court délai
    const timer = setTimeout(() => setIsAnimating(false), 50);
    return () => clearTimeout(timer);
  }, [question.id]); // Se déclenche quand la question change
  
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
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-400 transition bg-white dark:bg-gray-900"
                >
                  <RadioGroupItem value={String(index)} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-base text-gray-900 dark:text-gray-100"
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Unité : {question.unit}</p>
            )}
          </div>
        );

      case 'confidence-interval':
        const intervalValue = (typeof value === 'object' && value !== null)
          ? value
          : { min: '', max: '' };
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded">
              Donnez un intervalle de confiance à 90% : vous êtes 90% certain que la
              vraie réponse se trouve dans cet intervalle.
            </p>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                placeholder="Minimum"
                value={value.min || ''}
                onChange={(e) => setValue({ ...value, min: e.target.value })}
                className="flex-1"
              />
              <span className="text-gray-500 dark:text-gray-400">à</span>
              <Input
                type="number"
                placeholder="Maximum"
                value={value.max || ''}
                onChange={(e) => setValue({ ...value, max: e.target.value })}
                className="flex-1"
              />
              {question.unit && <span className="text-gray-500 dark:text-gray-400">{question.unit}</span>}
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
                  className="flex items-center space-x-3 p-3 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"
                >
                  <RadioGroupItem value={String(index + 1)} id={`likert-${index}`} />
                  <Label htmlFor={`likert-${index}`} className="flex-1 cursor-pointer text-gray-900 dark:text-gray-100">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );
      case 'ranking': {
        const ranking = value && Array.isArray(value) && value.length === question.options?.length
          ? value
          : question.options?.map((_: any, i: number) => i) || [];

        const moveItem = (fromIndex: number, toIndex: number) => {
          const newRanking = [...ranking];
          const [movedItem] = newRanking.splice(fromIndex, 1);
          newRanking.splice(toIndex, 0, movedItem);
          setValue(newRanking);
        };

        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded mb-4">
              ✋ Glissez-déposez ou utilisez les flèches ▲▼ pour réordonner.
              <br/>
              1 = le plus probable.
            </p>
            <div className="space-y-2">
              {ranking.map((optionIndex: number, position: number) => (
                <div
                  key={`${optionIndex}-${position}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', String(position));
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const draggedPosition = Number(e.dataTransfer.getData('text/plain'));
                    if (draggedPosition !== position) {
                      moveItem(draggedPosition, position);
                    }
                  }}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg
                           hover:border-blue-200 dark:hover:border-blue-400 cursor-move transition"
                >
                  {/* Icône de drag */}
                  <span className="text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing">
                    ⋮⋮
                  </span>

                  {/* Numéro */}
                  <span className="font-bold text-lg text-blue-600 dark:text-blue-400 w-8">
                    {position + 1}.
                  </span>

                  {/* Texte */}
                  <span className="flex-1 text-base text-gray-900 dark:text-gray-100">
                    {question.options?.[optionIndex]}
                  </span>

                  {/* Flèches */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveItem(position, position - 1)}
                      disabled={position === 0}
                      className="px-2 py-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30
                               rounded disabled:opacity-30 disabled:cursor-not-allowed transition"
                      type="button"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(position, position + 1)}
                      disabled={position === ranking.length - 1}
                      className="px-2 py-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30
                               rounded disabled:opacity-30 disabled:cursor-not-allowed transition"
                      type="button"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'multiple-choice-confidence':
        return (
          <div className="space-y-6">
            <RadioGroup
              value={value.choice !== undefined ? String(value.choice) : ''}
              onValueChange={(v: string) => setValue({ ...value, choice: Number(v) })}
            >
              <div className="space-y-3">
                {question.options?.map((option: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-400 transition bg-white dark:bg-gray-900"
                  >
                    <RadioGroupItem value={String(index)} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-base text-gray-900 dark:text-gray-100"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {value.choice !== undefined && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Quel est votre niveau de confiance dans cette réponse ?
                </p>
                <RadioGroup
                  value={value.confidence ? String(value.confidence) : ''}
                  onValueChange={(v: string) => setValue({ ...value, confidence: Number(v) })}
                >
                  <div className="space-y-2">
                    {(question.confidenceLevels || [50, 60, 70, 80, 90, 100]).map((level: number) => (
                      <div
                        key={level}
                        className="flex items-center space-x-3 p-3 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"
                      >
                        <RadioGroupItem value={String(level)} id={`conf-${level}`} />
                        <Label htmlFor={`conf-${level}`} className="flex-1 cursor-pointer text-gray-900 dark:text-gray-100">
                          {level}% de confiance {level === 50 && '(je devine)'}
                          {level === 100 && '(je suis certain)'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        );
      default:
        return <p className="text-red-500 dark:text-red-400">Type de question non supporté</p>;
    }
  };

  const isValid = () => {
    if (question.type === 'confidence-interval') {
      const interval = value || {};
      return interval.min && interval.max && Number(interval.min) < Number(interval.max);
    }
    
    if (question.type === 'ranking') {
      return value && Array.isArray(value) && value.length === question.options?.length;
    }
    
    if (question.type === 'multiple-choice-confidence') {
      return value.choice !== undefined && value.confidence !== undefined;
    }
    
    return value !== '' && value !== null && value !== undefined;
  };

  return (
    <Card className={`w-full max-w-3xl mx-auto transition-all duration-500 ease-out ${
      isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
    }`}>
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