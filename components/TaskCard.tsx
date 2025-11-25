import React from 'react';
import { Task } from '../types';
import { formatCurrency } from '../utils';
import { Lock, CheckCircle2, Diamond, Crown } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isLocked: boolean;
  isCompleted: boolean;
  onClick: () => void;
  index?: number; // Added for staggered animation
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isLocked, isCompleted, onClick, index = 0 }) => {
  const isSpecial = task.isSpecial;
  
  // Calculate delay based on index for waterfall effect
  const animationStyle = {
    animationDelay: `${index * 150}ms`,
    opacity: 0 // Start invisible, let animation handle opacity
  };

  return (
    <div 
      style={animationStyle}
      onClick={onClick}
      className={`group relative overflow-hidden transition-all duration-700 cursor-pointer rounded-sm animate-fade-up ${
        isLocked
          ? 'border border-gray-100 opacity-90 bg-white'
          : isCompleted
            ? 'border border-emerald-50 bg-white'
            : isSpecial 
              ? 'bg-neutral-950 ring-1 ring-brand-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:-translate-y-2' 
              : 'border border-gray-200 bg-white hover:border-black hover:shadow-2xl hover:-translate-y-2'
      }`}
    >
      {/* Top Border Indicator */}
      <div className={`h-1.5 w-full transition-all duration-700 ${
        isCompleted ? 'bg-emerald-500' : 
        isLocked ? 'bg-gray-200' : 
        isSpecial ? 'bg-gradient-to-r from-[#8B7355] via-[#FCF6BA] to-[#8B7355] animate-shimmer' :
        'bg-brand-black group-hover:h-2'
      }`} />

      {/* Special Background Effect */}
      {isSpecial && !isLocked && !isCompleted && (
        <>
          {/* Subtle Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          {/* Spotlight Effect */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-gold/10 blur-[80px] rounded-full animate-slow-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
        </>
      )}

      <div className="p-6 lg:p-8 flex flex-col h-full justify-between min-h-[260px] relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm backdrop-blur-md border transition-colors duration-500 ${
              isSpecial && !isLocked && !isCompleted 
                ? 'bg-gradient-to-r from-brand-gold/20 to-brand-gold/5 text-brand-gold-light border-brand-gold/30 shadow-sm' 
                : isCompleted ? 'bg-emerald-100 text-emerald-700 border-transparent' 
                : 'bg-gray-100 text-gray-600 border-transparent group-hover:bg-black group-hover:text-white'
            }`}>
              {isSpecial ? (
                <span className="flex items-center gap-1"><Crown size={12} /> TUGAS SPESIAL</span>
              ) : (
                `Tugas 0${task.id}`
              )}
            </span>
            {isCompleted && <CheckCircle2 size={18} className="text-emerald-500 drop-shadow-sm" />}
            {isLocked && <Lock size={16} className="text-gray-400" />}
            {isSpecial && !isLocked && !isCompleted && <Diamond size={16} className="text-brand-gold fill-brand-gold animate-pulse drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />}
          </div>
        </div>

        <div className="pr-12 relative">
          <h3 className={`text-xl lg:text-2xl font-serif mb-3 leading-tight tracking-wide transition-colors duration-500 ${
            isLocked || isCompleted ? 'text-gray-400' : 
            isSpecial ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FCF6BA] via-[#D4AF37] to-[#AA8C2C] drop-shadow-sm' : 'text-brand-black group-hover:text-gray-700'
          }`}>
            {task.title}
          </h3>
          <p className={`text-[10px] uppercase tracking-[0.2em] mb-6 transition-colors duration-500 ${isSpecial && !isLocked ? 'text-gray-400' : 'text-gray-500 group-hover:text-brand-gold'}`}>
            {task.products.length} Masterpieces
          </p>
          
          <div className="space-y-2">
            <p className={`text-[9px] uppercase tracking-[0.25em] ${isSpecial && !isLocked ? 'text-brand-gold/60' : 'text-gray-400'}`}>Investment Range</p>
            {/* Strong Blur Effect for Locked OR Completed Tasks */}
            <div className={`${(isLocked || isCompleted) ? 'blur-xl select-none pointer-events-none' : ''} transition-all duration-700`}>
               <div className={(isLocked || isCompleted) ? 'bg-gray-200 text-transparent rounded-sm w-3/4' : ''}>
                <p className={`font-serif text-sm lg:text-base tracking-wide ${isSpecial ? 'text-brand-gray' : 'text-gray-900'}`}>
                  {formatCurrency(task.minPrice)} — {formatCurrency(task.maxPrice)}
                </p>
              </div>
            </div>
            
            {/* Special Commission Badge - Luxurious Look */}
            {isSpecial && !isLocked && !isCompleted && (
              <div className="pt-4">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-brand-gold/40 bg-brand-gold/10 rounded-sm">
                   <SparkleIcon />
                   <span className="text-[10px] font-bold text-brand-gold-light tracking-[0.2em]">
                     EKSKLUSIF 50%
                   </span>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Status Indicators */}
        <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 transform translate-y-0 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          {isCompleted ? (
            <span className="text-emerald-600 flex items-center gap-2 group-hover:underline decoration-emerald-600/50 underline-offset-4">
              <CheckCircle2 size={14} /> Selesai
            </span>
          ) : isLocked ? (
            <span className="text-gray-400 flex items-center gap-2">
              <Lock size={14} /> Terkunci
            </span>
          ) : (
            <span className={`${isSpecial ? 'text-brand-gold-light' : 'text-brand-black'} flex items-center gap-3 group-hover:gap-4 transition-all duration-300`}>
              {isSpecial ? 'Lihat Koleksi' : 'Lihat Produk Tugas'} <span className="text-lg leading-none font-serif">&rarr;</span>
            </span>
          )}
        </div>
      </div>

      {/* Thumbnail Image - Bottom Right */}
      <div className={`absolute bottom-8 right-8 w-20 h-20 lg:w-24 lg:h-24 rounded-sm overflow-hidden shadow-2xl transition-all duration-1000 ease-out ${
        isSpecial 
          ? 'border border-brand-gold/30 rotate-3 group-hover:rotate-6 group-hover:scale-110 shadow-brand-gold/20' 
          : 'border border-gray-100 bg-gray-50 lg:grayscale lg:group-hover:grayscale-0 group-hover:scale-110'
        } ${isCompleted ? 'opacity-60 grayscale' : ''}`}>
        <img 
          src={task.coverImage} 
          alt={task.title} 
          className={`w-full h-full object-cover transition-all duration-1000 transform ${(isLocked || isCompleted) ? 'grayscale opacity-50' : 'group-hover:scale-110'}`}
        />
        {/* Gloss overlay for special */}
        {isSpecial && <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/20 to-transparent mix-blend-overlay"></div>}
      </div>
    </div>
  );
};

// Tiny helper for sparkle icon
const SparkleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#D4AF37"/>
  </svg>
);

export default TaskCard;