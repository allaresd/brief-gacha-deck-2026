import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Sparkles } from 'lucide-react';
import Card from './components/Card';
import { INITIAL_DECK } from './constants';
import { CardData } from './types';

export default function App() {
  const [deck, setDeck] = useState<CardData[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(true);
  const [drawsRemaining, setDrawsRemaining] = useState(2);
  const [showPopup, setShowPopup] = useState(false);

  const [revealedCardFlipped, setRevealedCardFlipped] = useState(false);
  const deckStageRef = useRef<HTMLDivElement | null>(null);
  const revealStageRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return 1920;
    return window.innerWidth;
  });

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isPhone = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1200;

  const spreadLayout = isPhone
    ? { xStart: -86, xStep: 24, yWave: 14, rotateStart: -12, rotateStep: 3.2 }
    : isTablet
      ? { xStart: -150, xStep: 46, yWave: 30, rotateStart: -16, rotateStep: 4.2 }
      : { xStart: -240, xStep: 80, yWave: 60, rotateStart: -20, rotateStep: 8 };

  const shuffleDeck = useCallback(() => {
    setIsShuffling(true);
    setSelectedCardId(null);
    setRevealedCardFlipped(false);
    setDrawsRemaining(2);
    setShowPopup(false);
    
    // Simulate a shuffle animation delay
    setTimeout(() => {
      const shuffled = [...INITIAL_DECK].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setIsShuffling(false);
    }, 1500);
  }, []);

  useEffect(() => {
    shuffleDeck();
  }, [shuffleDeck]);

  const handleCardClick = (id: string) => {
    if (!selectedCardId && drawsRemaining > 0) {
      setSelectedCardId(id);
      setDrawsRemaining(prev => prev - 1);
      setRevealedCardFlipped(false);
      setShowPopup(true);
    }
  };

  const scrollToSectionCenter = (element: HTMLElement | null) => {
    if (!element) return;
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };

  const handlePopupContinue = () => {
    setShowPopup(false);
    // Wait for popup exit transition, then guide focus to reveal stage and flip.
    window.setTimeout(() => {
      scrollToSectionCenter(revealStageRef.current);
      window.setTimeout(() => {
        setRevealedCardFlipped(true);
      }, 450);
    }, 280);
  };

  const handleDrawAnother = () => {
    setSelectedCardId(null);
    setRevealedCardFlipped(false);
    window.setTimeout(() => {
      scrollToSectionCenter(deckStageRef.current);
    }, 80);
  };

  const saveImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `brief-card-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download image:', error);
      // Fallback for cross-origin if blob fails
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans select-none bg-[#050508]">
      <div className="atmosphere" />
      
      {/* Header */}
      <header className="p-10 flex justify-between items-end shrink-0 z-20 max-[900px]:p-5 max-[900px]:items-start max-[900px]:gap-4">
        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-40 max-[900px]:text-[9px] max-[900px]:tracking-[0.25em]">BGD202 Advertising</p>
          <h1 className="text-5xl font-light italic tracking-tight font-serif max-[1200px]:text-4xl max-[900px]:text-2xl">
            Brief Gacha <span className="text-purple-400">v.1</span>
          </h1>
        </div>
        <div className="flex gap-12 text-right max-[900px]:ml-auto max-[900px]:gap-6">
          <div>
            <p className="text-[10px] uppercase opacity-40">Draws Remaining</p>
            <p className={`text-2xl font-mono max-[900px]:text-xl ${drawsRemaining === 0 ? 'text-red-500' : 'text-purple-400'}`}>
              {drawsRemaining} / 2
            </p>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 flex px-4 pb-8 z-10 min-h-[700px] max-[1800px]:flex-col max-[1800px]:gap-10 max-[900px]:px-2 max-[900px]:min-h-0">
        
        {/* Left: The Deck Spread (1/2) */}
        <div ref={deckStageRef} className="w-5/7 flex flex-col justify-left relative border-r border-white/5 px-4 max-[1800px]:w-full max-[1800px]:border-r-0 max-[1800px]:border-b max-[1800px]:border-white/5 max-[1800px]:pb-10">
          <div className="relative w-full h-[750px] flex items-center justify-center max-[1200px]:h-[620px] max-[900px]:h-[340px]">
            <AnimatePresence mode="wait">
              {isShuffling ? (
                <motion.div
                  key="shuffling"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center gap-4 text-purple-400/50"
                >
                  <RefreshCw className="w-16 h-16 animate-spin-slow" />
                  <span className="text-sm tracking-[0.4em] uppercase">Recalibrating sequence...</span>
                </motion.div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  {deck.map((card, index) => {
                    const isSelected = selectedCardId === card.id;
                    if (isSelected) return null;

                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, x: -200 }}
                        animate={{ 
                          opacity: 1, 
                          x: spreadLayout.xStart + (index * spreadLayout.xStep),
                          y: Math.sin(index * 2) * spreadLayout.yWave,
                          rotate: spreadLayout.rotateStart + (index * spreadLayout.rotateStep),
                          zIndex: index,
                        }}
                        transition={{ delay: index * 0.08, duration: 0.6 }}
                        className="absolute cursor-pointer group"
                        onClick={() => handleCardClick(card.id)}
                      >
                        <div className="w-64 aspect-[256/710] bg-[#0A0A10] border border-white/10 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden p-2 flex flex-col group-hover:translate-y-[-60px] group-hover:border-purple-500/60 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-500 max-[1200px]:w-44 max-[1200px]:group-hover:translate-y-[-40px] max-[900px]:w-24 max-[900px]:group-hover:translate-y-[-18px]">
                           <div className="flex-1 border border-white/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                              <img src={card.backImage} className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                           </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-20 text-[10px] tracking-[0.3em] uppercase opacity-40 italic text-center max-[900px]:mt-8 max-[900px]:text-[9px] max-[900px]:tracking-[0.16em]">
            Select to unlock your creative ad brief for concepting
          </p>
        </div>

        {/* Right: Reveal Stage (1/2) */}
        <div ref={revealStageRef} className="w-2/7 flex flex-col items-center justify-center relative max-[1800px]:w-full max-[1800px]:py-8">
          <div className="absolute w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] -z-10 animate-pulse max-[900px]:w-[300px] max-[900px]:h-[300px] max-[900px]:blur-[80px]"></div>
          
          <AnimatePresence mode="wait">
            {selectedCardId ? (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center group"
              >
                <Card
                  card={deck.find(c => c.id === selectedCardId)!}
                  isFlipped={revealedCardFlipped}
                  onSave={saveImage}
                />
                
                {/* Contextual Controls */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-4 mt-12"
                >
                  <button 
                    onClick={() => saveImage(deck.find(c => c.id === selectedCardId)!.frontImage)}
                    className="floating-action px-4 py-2 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    Download Brief
                  </button>

                  {drawsRemaining > 0 ? (
                    <button 
                      onClick={handleDrawAnother}
                      className="floating-action bg-purple-500/20 text-purple-200 px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest hover:bg-purple-500/40 transition-all border border-purple-500/30"
                    >
                      Draw Another ({drawsRemaining})
                    </button>
                  ) : null}

                  {/* <button 
                    onClick={shuffleDeck}
                    className="floating-action bg-white text-black px-8 py-3 rounded-full text-[10px] uppercase font-bold tracking-widest hover:opacity-80 transition-opacity"
                  >
                    {drawsRemaining === 0 ? "Reset & Shuffle" : "Force Reshuffle"}
                  </button> */}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                className="text-center"
              >
                <div className="w-[320px] h-[480px] border border-white/5 rounded-2xl flex items-center justify-center italic font-serif text-2xl max-[900px]:w-[220px] max-[900px]:h-[320px] max-[900px]:text-lg">
                  Waiting for selection
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-10 flex items-center justify-between opacity-30 border-t border-white/5 text-[9px] uppercase tracking-[0.5em] z-20 max-[900px]:p-5 max-[900px]:tracking-[0.2em] max-[900px]:text-[8px] max-[900px]:gap-4">
        <div>Sequence {Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
        <div className="flex gap-8">
           <span>Designed by</span>
           <span>©2026 Dong Sun</span>
        </div>
      </footer>

      {/* Popup Notification */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0A0A10] border border-purple-500/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-6"
            >
              <div className="space-y-2">
                <p className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-40">Reminder</p>
                <h3 className="text-2xl font-serif italic text-white">Sequence Recorded</h3>
              </div>
              
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-sm uppercase tracking-widest opacity-80 mb-1">Draws Remaining</p>
                <p className="text-4xl font-mono text-purple-400">{drawsRemaining}</p>
              </div>

              <p className="text-xs text-white/40 leading-relaxed uppercase">
                {drawsRemaining > 0 
                  ? "You have one more attempt to draw from this sequence."
                  : "Maximum sequence limit reached. You must reset the deck to draw again."}
              </p>

              <button
                onClick={handlePopupContinue}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-purple-500/20 active:scale-95"
              >
                Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
