import React, { useState } from 'react';
import { Flashcard } from '../types';

interface FlashcardsProps {
  cards: Flashcard[];
}

const Flashcards: React.FC<FlashcardsProps> = ({ cards }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIdx((prev) => (prev + 1) % cards.length), 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIdx((prev) => (prev - 1 + cards.length) % cards.length), 200);
  };

  const card = cards[currentIdx];

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <h3 className="text-xl font-bold text-slate-800 self-start flex items-center gap-2">
         <span>🗂️</span> Study Flashcards
      </h3>
      
      <div 
        className="relative w-full max-w-md h-64 cursor-pointer perspective-1000 group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute w-full h-full bg-white border border-slate-200 rounded-xl shadow-md p-8 flex flex-col items-center justify-center backface-hidden">
            <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">Question</div>
            <p className="text-lg font-medium text-center text-slate-800">{card.question}</p>
            <div className="absolute bottom-4 text-xs text-slate-400">Click to flip</div>
          </div>
          
          {/* Back */}
          <div className="absolute w-full h-full bg-blue-600 text-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center rotate-y-180 backface-hidden">
             <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-4">Answer</div>
             <p className="text-lg font-medium text-center">{card.answer}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button onClick={handlePrev} className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition">
           &larr; Prev
        </button>
        <span className="text-sm font-medium text-slate-500">{currentIdx + 1} / {cards.length}</span>
        <button onClick={handleNext} className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition">
           Next &rarr;
        </button>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default Flashcards;
