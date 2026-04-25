import { motion } from 'motion/react';
import { CardData } from '../types';
import { Download } from 'lucide-react';

interface CardProps {
  card: CardData;
  isFlipped: boolean;
  onClick?: () => void;
  onSave?: (image: string) => void;
  disabled?: boolean;
}

export default function Card({ card, isFlipped, onClick, onSave, disabled }: CardProps) {
  return (
    <div className="card-perspective w-[300px] h-[825px] cursor-pointer group" onClick={disabled ? undefined : onClick}>
      <motion.div
        className="card-inner w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 200, damping: 25 }}
      >
        {/* Back of Card */}
        <div className="card-face card-back deck-glow !rounded-[8px]">
          <div className="m-1.5 h-full border border-white/5 rounded-[6px] flex items-center justify-center overflow-hidden relative group-hover:border-white/20 transition-colors">
            <img 
              src={card.backImage} 
              alt="Card Back" 
              className="w-full h-full object-cover opacity-60 grayscale group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Front of Card */}
        <div className="card-face card-front !rounded-[8px]">
          <div className="flex justify-between items-start mb-2 px-3 pt-3">
            <span className="text-[10px] font-bold border border-white/20 px-2 py-0.5 rounded-full opacity-60">NO. 00{card.id}</span>
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
          </div>

          <div className="flex-1 bg-gradient-to-b from-purple-950/20 to-transparent rounded-md mb-2 mx-2 flex items-center justify-center border border-white/5 overflow-hidden relative">
            <img 
              src={card.frontImage} 
              alt={card.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isFlipped && onSave && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(card.frontImage);
                }}
                className="absolute top-2 right-2 p-2 floating-action rounded-full hover:bg-white hover:text-black transition-all shadow-lg z-10"
                title="Save Archive"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="px-3 pb-3 space-y-1">
            <h2 className="text-lg font-serif italic text-white tracking-tight leading-tight">{card.name}</h2>
            <p className="text-[9px] text-white/40 leading-tight uppercase tracking-tighter">
            
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
