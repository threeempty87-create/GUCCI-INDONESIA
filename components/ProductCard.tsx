import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils';
import { Lock, Eye, Diamond } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  isLocked?: boolean;
  isSpecial?: boolean;
  index?: number; // Added for staggered animation
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, isLocked, isSpecial, index = 0 }) => {
  
  // Stagger animation
  const animationStyle = {
    animationDelay: `${index * 100}ms`,
    opacity: 0 // Start invisible
  };

  return (
    <div 
      style={animationStyle}
      onClick={onClick}
      className={`group cursor-pointer flex flex-col transition-all duration-700 ease-out relative animate-fade-up ${
        isLocked ? 'opacity-80' : ''
      } ${
        isSpecial 
          ? 'bg-neutral-900 border border-brand-gold/20 hover:border-brand-gold/60 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:-translate-y-2' 
          : 'bg-white hover:shadow-2xl hover:-translate-y-2'
      }`}
    >
      {/* Golden Shine for Special */}
      {isSpecial && !isLocked && (
        <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      )}

      {/* Image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 transition-colors duration-500 ${
          isSpecial ? 'bg-black/20 group-hover:bg-black/40' : 'bg-black/0 group-hover:bg-black/5'
        }`} />
        
        {/* Lock Icon */}
        {isLocked && (
          <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full backdrop-blur-md z-10 shadow-sm animate-fade-in">
            <Lock size={14} className="text-gray-500" />
          </div>
        )}
        
        {/* Action Button - Always Visible with Animation */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10 overflow-hidden">
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 flex items-center gap-2 shadow-lg transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-95 transform translate-y-0 group-hover:translate-y-0 ${
            isSpecial 
              ? 'bg-brand-gold text-black hover:bg-white' 
              : 'bg-white text-brand-black hover:bg-brand-black hover:text-white'
          }`}>
            {isLocked ? <><Eye size={14}/> Preview</> : 'Cek Detail'}
          </span>
        </div>
        
         {isLocked && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-sm">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Lock size={10} /> Preview
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className={`p-5 relative ${isSpecial ? 'text-center' : 'text-left'}`}>
        {isSpecial && (
          <div className="mb-2 flex justify-center">
             <Diamond size={12} className="text-brand-gold fill-brand-gold animate-pulse" />
          </div>
        )}
        
        <h3 className={`text-sm font-serif mb-2 leading-relaxed tracking-wide transition-colors duration-300 group-hover:underline decoration-1 underline-offset-4 ${
          isSpecial ? 'text-brand-gold-light' : 'text-brand-black'
        }`}>
          {product.name}
        </h3>
        <p className={`text-[10px] mb-4 font-sans uppercase tracking-[0.2em] ${
          isSpecial ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {product.category}
        </p>
        
        {/* Price & Commission Block - Blurred if Locked */}
        <div className={`${isLocked ? 'blur-xl select-none opacity-50 grayscale pointer-events-none' : ''} transition-all duration-500`}>
          <div className={`mb-2 ${isLocked ? 'bg-gray-200 text-transparent rounded-sm inline-block' : ''}`}>
            <p className={`text-base font-serif ${
              isSpecial ? 'text-brand-gold' : 'text-gray-900 font-medium'
            }`}>
              {formatCurrency(product.price)}
            </p>
          </div>
          <div className={`flex items-center gap-2 ${isSpecial ? 'justify-center' : ''} ${isLocked ? 'opacity-0' : ''}`}>
             <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
               isSpecial 
                 ? 'text-brand-gold border-brand-gold/30 bg-brand-gold/10' 
                 : 'text-emerald-600 border-emerald-200 bg-emerald-50'
             }`}>
              + Komisi {Math.round(product.commissionRate * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;