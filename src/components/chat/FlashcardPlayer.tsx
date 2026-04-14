"use client";

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Shuffle, 
  Download, 
  Trash2, 
  MoreVertical,
  Check,
  X,
  Maximize2,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardPlayerProps {
  title: string;
  cards: Flashcard[];
  onBack: () => void;
  onDelete?: () => void;
}

export const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({ title, cards, onBack, onDelete }) => {
  const { isMaximized, setIsMaximized } = useStore();
  const [localCards, setLocalCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setLocalCards(Array.isArray(cards) ? cards : []);
  }, [cards]);

  const currentCard = localCards[currentIndex];

  const goNext = () => {
    if (currentIndex < localCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const recordScore = (isKnown: boolean) => {
    if (isKnown) {
      setKnownCount(prev => prev + 1);
    } else {
      setUnknownCount(prev => prev + 1);
    }

    if (currentIndex < localCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
    setUnknownCount(0);
    setIsFinished(false);
  };

  const shuffleCards = () => {
    const shuffled = [...localCards].sort(() => Math.random() - 0.5);
    setLocalCards(shuffled);
    resetGame();
  };

  const downloadCards = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localCards, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${title || 'flashcards'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (localCards.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center bg-background text-foreground">
        <p className="text-muted-foreground mb-4">Ushbu to'plamda kartochkalar mavjud emas.</p>
        <Button onClick={onBack}>Orqaga</Button>
      </div>
    );
  }

  const renderHeader = () => (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => {
          if (isMaximized) setIsMaximized(false);
          onBack();
        }}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold truncate">{title}</h2>
          <p className="text-[10px] text-muted-foreground truncate">{localCards.length} ta kartochka</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {isMaximized ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => setIsMaximized(false)}>
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMaximized(true)}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  if (isFinished) {
    return (
      <div className={cn(
        "flex h-full w-full flex-col bg-background transition-all duration-300",
        isMaximized ? "fixed inset-4 sm:inset-10 z-[100] rounded-3xl border shadow-2xl bg-background overflow-hidden" : "relative"
      )}>
        {renderHeader()}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Tabriklaymiz!</h2>
          <p className="text-muted-foreground mb-8">Siz barcha kartochkalarni ko'rib chiqdingiz.</p>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
            <div className="flex flex-col items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-3xl font-bold text-emerald-600 mb-1">{knownCount}</span>
              <span className="text-sm text-emerald-600 font-medium">O'rganildi</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-rose-50 rounded-2xl border border-rose-100">
              <span className="text-3xl font-bold text-rose-600 mb-1">{unknownCount}</span>
              <span className="text-sm text-rose-600 font-medium">Qiyinchilik</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <Button className="flex-1 rounded-xl h-11" onClick={resetGame}>
              <RotateCcw className="mr-2 h-4 w-4" /> Qayta boshlash
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => {
              if (isMaximized) setIsMaximized(false);
              onBack();
            }}>
              Yopish
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isMaximized && (
        <div className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-sm" onClick={() => setIsMaximized(false)} />
      )}
      <div className={cn(
        "flex h-full w-full flex-col bg-background transition-all duration-300",
        isMaximized ? "fixed inset-4 sm:inset-10 z-[100] rounded-3xl border shadow-2xl bg-background overflow-hidden" : "relative"
      )}>
        {renderHeader()}

        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6 overflow-hidden">
          {/* Card */}
          <div 
            className={cn(
                "relative w-full max-w-md perspective-1000 cursor-pointer group",
                isMaximized ? "aspect-[4/3] max-w-2xl" : "aspect-[4/5]"
            )}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-[#2C2C2C] rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-xl">
                <div className="absolute top-6 left-8 text-white/40 text-sm font-medium">
                  {currentIndex + 1} / {localCards.length}
                </div>
                <div className="absolute top-6 right-8">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white">
                              <MoreVertical className="h-4 w-4" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); resetGame(); }}>
                            <RotateCcw className="h-4 w-4 mr-2" />To'plamni qayta o'rganish
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); shuffleCards(); }}>
                            <Shuffle className="h-4 w-4 mr-2" />To'plamni aralashtirish
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); downloadCards(); }}>
                            <Download className="h-4 w-4 mr-2" />Yuklab olish
                          </DropdownMenuItem>
                          {onDelete && (
                            <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                              <Trash2 className="h-4 w-4 mr-2" />O'chirish
                            </DropdownMenuItem>
                          )}
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>
                
                <h3 className={cn(
                    "text-white font-medium leading-tight px-4",
                    isMaximized ? "text-4xl" : "text-2xl"
                )}>
                  {currentCard?.question}
                </h3>
                
                <div className="absolute bottom-8 text-white/40 text-sm">
                  Javobni ko'rish
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-xl border-2 border-[#2C2C2C]">
                <div className="absolute top-6 left-8 text-black/40 text-sm font-medium">
                  {currentIndex + 1} / {localCards.length}
                </div>
                <h3 className={cn(
                    "text-black font-medium leading-relaxed overflow-y-auto max-h-full px-4",
                    isMaximized ? "text-3xl" : "text-xl"
                )}>
                  {currentCard?.answer}
                </h3>
                <div className="absolute bottom-8 text-black/40 text-sm">
                  Savolga qaytish
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 w-full max-w-md justify-between px-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full border-2"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
               <Button 
                  variant="outline" 
                  className="h-12 px-6 rounded-full border-2 gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  onClick={(e) => { e.stopPropagation(); recordScore(false); }}
               >
                  <X className="h-5 w-5" />
                  <span className="font-bold">{unknownCount}</span>
               </Button>

               <Button 
                  variant="outline" 
                  className="h-12 px-6 rounded-full border-2 gap-2 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                  onClick={(e) => { e.stopPropagation(); recordScore(true); }}
               >
                  <span className="font-bold">{knownCount}</span>
                  <Check className="h-5 w-5" />
               </Button>
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full border-2"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              disabled={currentIndex === localCards.length - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Footer feedback buttons */}
        {!isMaximized && (
          <div className="border-t p-4 flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl h-11 gap-2 text-xs font-medium">
                <Check className="h-4 w-4" />
                Sifatli kontent
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl h-11 gap-2 text-xs font-medium">
                <X className="h-4 w-4" />
                Sifatsiz kontent
            </Button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}} />
    </>
  );
};
