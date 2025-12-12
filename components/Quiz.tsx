import React, { useState } from 'react';
import { QuizQuestion, ClarifyingQuestion, QuestionAnswer } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
}

interface AdaptiveQuizProps {
    questions: ClarifyingQuestion[];
    onComplete: (answers: QuestionAnswer[]) => void;
    loading: boolean;
}

export const KnowledgeQuiz: React.FC<QuizProps> = ({ questions }) => {
  const [selections, setSelections] = useState<{ [key: number]: number | null }>({});
  const [showResults, setShowResults] = useState<{ [key: number]: boolean }>({});

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (showResults[questionId]) return;
    setSelections(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = (questionId: number) => {
    setShowResults(prev => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <span>📝</span> Knowledge Check
      </h3>
      <div className="grid gap-6">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h4 className="font-semibold text-lg mb-4 text-slate-800">{idx + 1}. {q.question}</h4>
            <div className="space-y-3">
              {q.options.map((option, optIdx) => {
                const isSelected = selections[idx] === optIdx;
                const isRevealed = showResults[idx];
                const isCorrect = optIdx === q.correctAnswer;
                
                let btnClass = "w-full text-left p-3 rounded-lg border transition-all ";
                
                if (isRevealed) {
                  if (isCorrect) btnClass += "bg-green-100 border-green-500 text-green-800";
                  else if (isSelected && !isCorrect) btnClass += "bg-red-100 border-red-500 text-red-800";
                  else btnClass += "border-slate-200 opacity-60";
                } else {
                  if (isSelected) btnClass += "bg-blue-50 border-blue-500 text-blue-800";
                  else btnClass += "border-slate-200 hover:bg-slate-50";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(idx, optIdx)}
                    className={btnClass}
                    disabled={isRevealed}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            
            {!showResults[idx] && selections[idx] !== undefined && selections[idx] !== null && (
               <button 
                 onClick={() => handleSubmit(idx)}
                 className="mt-4 text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
               >
                 Check Answer
               </button>
            )}

            {showResults[idx] && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-700 border-l-4 border-blue-400">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


export const AdaptiveQuiz: React.FC<AdaptiveQuizProps> = ({ questions, onComplete, loading }) => {
    const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentQ = questions[currentIndex];

    const handleAnswer = (answer: string) => {
        const newAnswers = [
            ...answers,
            { questionId: currentQ.id, questionText: currentQ.text, answer }
        ];
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Finished
        }
    };
    
    const handleFinish = () => {
         onComplete(answers);
    };

    const isLast = currentIndex === questions.length - 1;
    const hasAnsweredCurrent = answers.find(a => a.questionId === currentQ.id);

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-blue-100 animate-fade-in">
            <div className="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-800">Clarifying Questionnaire</h3>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Question {currentIndex + 1} of {questions.length}
                </span>
            </div>

            <p className="text-lg font-medium text-slate-800 mb-6">{currentQ.text}</p>

            <div className="grid gap-3 mb-8">
                {currentQ.options.map((opt, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleAnswer(opt)}
                     className={`w-full text-left p-4 rounded-xl border transition-all ${
                         hasAnsweredCurrent?.answer === opt 
                         ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                         : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                     }`}
                     disabled={!!hasAnsweredCurrent && hasAnsweredCurrent.answer !== opt}
                   >
                     {opt}
                   </button>
                ))}
            </div>

            <div className="flex justify-between items-center">
                 <button 
                   onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                   disabled={currentIndex === 0}
                   className="text-slate-400 font-medium disabled:opacity-30 hover:text-slate-600 transition"
                 >
                    &larr; Previous
                 </button>

                 {hasAnsweredCurrent && (
                     isLast ? (
                        <button 
                            onClick={handleFinish}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center gap-2"
                        >
                            {loading ? "Generating Report..." : "Finish & Generate Report"}
                        </button>
                     ) : (
                         <button 
                            onClick={() => setCurrentIndex(prev => prev + 1)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                         >
                             Next Question &rarr;
                         </button>
                     )
                 )}
            </div>
        </div>
    );
};
