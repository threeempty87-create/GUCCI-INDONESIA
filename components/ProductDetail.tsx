import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency, calculateReturns } from '../utils';
import { ArrowLeft, MessageCircle, CheckCircle2, Lock, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onComplete: () => void;
  isTaskCompleted: boolean; 
  isLocked?: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onComplete, isTaskCompleted, isLocked }) => {
  const stats = calculateReturns(product.price, product.commissionRate);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [expandDesc, setExpandDesc] = useState(false);

  // Determine if this view is read-only (either because it's done, or it's locked for future)
  const isRestricted = isTaskCompleted || isLocked;

  const handleInitialClick = () => {
    if (isRestricted) return;
    setShowConfirmation(true);
  };

  const handleConfirmedOrder = () => {
    setIsProcessing(true);
    onComplete();
    
    const waNumber = "6281374192072"; 
    const message = encodeURIComponent(
      `Halo Admin, saya ingin mengambil tugas *${product.name}*.\n\n` +
      `Rincian Produk:\n` +
      `- Kategori: ${product.category}\n` +
      `- Harga Modal: ${formatCurrency(product.price)}\n` +
      `- Komisi (${Math.round(product.commissionRate * 100)}%): ${formatCurrency(stats.commission)}\n` +
      `- Total Pencairan: ${formatCurrency(stats.total)}\n\n` +
      `Mohon diproses agar tugas saya selesai.`
    );
    const waLink = `https://wa.me/${waNumber}?text=${message}`;

    setTimeout(() => {
      window.open(waLink, '_blank');
      setIsProcessing(false);
      setShowConfirmation(false);
    }, 500);
  };

  return (
    <>
      {/* ==============================================
          DESKTOP VIEW (Large Screens)
         ============================================== */}
      <div className="hidden lg:block min-h-[80vh] bg-white relative pb-32">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-12 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 pb-12">
            {/* Left: Image - Slow Fade In */}
            <div className="relative bg-gray-50 aspect-[3/4] lg:aspect-auto lg:h-[80vh] overflow-hidden shadow-sm animate-scale-in">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
              />
               {isRestricted && (
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center animate-fade-in">
                   <div className="bg-white px-8 py-4 shadow-xl text-center border border-gray-100">
                      {isTaskCompleted ? <CheckCircle2 size={20} className="mx-auto mb-2 text-emerald-600"/> : <Lock size={20} className="mx-auto mb-2 text-brand-black"/>}
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        {isTaskCompleted ? 'Task Completed' : 'Preview Locked'}
                      </p>
                   </div>
                </div>
              )}
            </div>

            {/* Right: Details - Staggered Fade Up */}
            <div className="flex flex-col justify-center h-full pt-4 lg:pt-0">
              <div className="flex items-center justify-between mb-6 animate-fade-up delay-100 opacity-0" style={{animationFillMode: 'forwards'}}>
                 <div className="flex items-center gap-4">
                  <span className={`px-3 py-1.5 text-white text-[10px] uppercase tracking-[0.2em] font-bold ${isRestricted ? 'bg-gray-300' : 'bg-brand-black'}`}>
                    {isRestricted ? 'Read Only' : 'Selected'}
                  </span>
                  <div className="h-px w-8 bg-gray-200"></div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-gray-400">
                    {product.category}
                  </span>
                 </div>

                 {/* Desktop Status Indicators */}
                 <div className="hidden lg:flex gap-2">
                    {isTaskCompleted && (
                      <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                        <CheckCircle2 size={14} /> Level Completed
                      </span>
                    )}
                    {isLocked && (
                      <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <Lock size={14} /> Preview Only
                      </span>
                    )}
                 </div>
              </div>

              <h1 className="text-3xl lg:text-5xl font-serif text-brand-black mb-8 leading-tight animate-fade-up delay-200 opacity-0" style={{animationFillMode: 'forwards'}}>
                {product.name}
              </h1>
              
              {/* Financial Header - Blurred if Restricted */}
              <div className={`flex items-baseline gap-6 mb-10 border-b border-gray-100 pb-10 transition-all duration-500 animate-fade-up delay-300 opacity-0 ${isRestricted ? 'blur-md select-none opacity-50 pointer-events-none' : ''}`} style={{animationFillMode: 'forwards'}}>
                <div className={isRestricted ? 'bg-gray-200 text-transparent rounded' : ''}>
                  <p className="text-3xl font-serif text-brand-black">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <div className={isRestricted ? 'bg-gray-200 text-transparent rounded' : ''}>
                  <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest border border-brand-gold/30 px-3 py-1">
                    Profit {Math.round(product.commissionRate * 100)}%
                  </span>
                </div>
              </div>

              <div className="prose prose-sm text-gray-500 mb-12 font-light leading-loose tracking-wide animate-fade-up delay-400 opacity-0" style={{animationFillMode: 'forwards'}}>
                <p>{product.description}</p>
              </div>

              {/* Financial Breakdown Card - Luxury Ticket Style - Blurred if Restricted */}
              <div className={`bg-white border border-brand-gold/30 p-8 mb-10 transition-all duration-300 relative shadow-sm animate-fade-up delay-500 opacity-0 ${isRestricted ? 'blur-xl select-none pointer-events-none grayscale' : ''}`} style={{animationFillMode: 'forwards'}}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-brand-gold">
                  <CheckCircle2 size={16} fill="white" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-center text-gray-400">
                  Estimasi Rincian Pendapatan
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-light">Modal Produk</span>
                    <span className={`font-serif text-lg ${isRestricted ? 'bg-gray-200 text-transparent rounded' : ''}`}>{formatCurrency(stats.price)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-gold">Komisi Mitra ({Math.round(product.commissionRate * 100)}%)</span>
                    <span className={`font-serif text-lg text-brand-gold ${isRestricted ? 'bg-gray-200 text-transparent rounded' : ''}`}>
                      +{formatCurrency(stats.commission)}
                    </span>
                  </div>
                  <div className="h-px my-4 bg-gray-100 w-full"></div>
                  <div className="flex justify-between items-center">
                    <span className="uppercase tracking-[0.1em] text-[10px] font-bold">Total Pencairan</span>
                    <span className={`font-serif text-2xl text-brand-black ${isRestricted ? 'bg-gray-200 text-transparent rounded' : ''}`}>{formatCurrency(stats.total)}</span>
                  </div>
                </div>
              </div>

              {/* CTA Button - Disabled if Restricted */}
              <button 
                onClick={handleInitialClick}
                disabled={isRestricted}
                style={{animationFillMode: 'forwards'}}
                className={`w-full py-5 px-8 flex items-center justify-center gap-3 transition-all duration-500 group animate-fade-up delay-700 opacity-0 ${
                  isRestricted 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                    : 'bg-brand-black text-white hover:bg-brand-gold hover:text-white hover:shadow-2xl hover:-translate-y-1'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  {isTaskCompleted ? 'TUGAS SELESAI' : isLocked ? 'TUGAS TERKUNCI' : 'PILIH PAKET PRODUK INI'}
                </span>
                {!isRestricted && <MessageCircle size={18} className={`transition-transform duration-500 ${!isProcessing && 'group-hover:translate-x-1'}`}/>}
                {isRestricted && (isTaskCompleted ? <CheckCircle2 size={16} /> : <Lock size={16} />)}
              </button>
              
              <p className="text-[10px] text-center text-gray-300 mt-6 uppercase tracking-wider flex justify-center items-center gap-2 animate-fade-in delay-700">
                <Lock size={10} /> Official Gucci Client Transaction
              </p>
            </div>
          </div>
        </div>

         {/* FIXED BACK BUTTON - BOTTOM LEFT */}
         <div className="fixed bottom-6 left-6 z-50 animate-fade-in delay-500">
               <button 
                onClick={onBack}
                className="bg-white border border-gray-200 shadow-xl px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-all active:scale-95 group"
              >
                <ArrowLeft size={16} className="text-gray-400 group-hover:-translate-x-1 transition-transform duration-500 group-hover:text-brand-black" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black">Back to Collection</span>
              </button>
         </div>
      </div>

      {/* ==============================================
          MOBILE VIEW (Viewport Height Optimized)
         ============================================== */}
      <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col animate-fade-in h-[100dvh] w-full overflow-hidden">
        {/* Top: Image Section (45% Height) */}
        <div className="relative h-[45%] w-full flex-shrink-0 animate-scale-in">
           <img 
             src={product.image} 
             alt={product.name} 
             className="w-full h-full object-cover"
           />
           {/* Dark Overlay for text readability if needed */}
           <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10"></div>

           {/* Mobile Floating Back Button (Top Left for better space usage on full screen) */}
           <button 
             onClick={onBack}
             className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-md border border-white/30 text-white p-2.5 rounded-full shadow-lg active:scale-95 transition-transform"
           >
             <ArrowLeft size={20} />
           </button>

           {/* Mobile Status Badges */}
           <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
              {isTaskCompleted && (
                <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <CheckCircle2 size={10} /> Completed
                </span>
              )}
              {isLocked && (
                <span className="bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Lock size={10} /> Locked
                </span>
              )}
           </div>
        </div>

        {/* Bottom: Content Sheet (55% Height) */}
        <div className="flex-1 bg-white -mt-10 rounded-t-[2.5rem] relative z-10 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-fade-up">
            {/* Handle Bar */}
            <div className="w-full flex justify-center pt-3 pb-1 flex-shrink-0">
               <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto px-6 pt-2 pb-20 custom-scrollbar">
               {/* Header Info */}
               <div className="flex justify-between items-start mb-4">
                  <div className="w-[65%]">
                     <span className="text-[9px] uppercase tracking-widest text-gray-400 block mb-1 font-bold">{product.category}</span>
                     <h1 className="text-xl font-serif text-brand-black leading-tight">{product.name}</h1>
                  </div>
                  <div className="w-[35%] text-right">
                     <div className={`font-serif text-lg text-brand-black ${isRestricted ? 'text-transparent bg-gray-200 rounded' : ''}`}>
                       {formatCurrency(product.price)}
                     </div>
                     {!isRestricted && (
                       <span className="inline-block mt-1 text-[8px] font-bold bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                         Profit {Math.round(product.commissionRate * 100)}%
                       </span>
                     )}
                  </div>
               </div>

               {/* Description (Collapsible) */}
               <div className="mb-6 relative group">
                  <p 
                    onClick={() => setExpandDesc(!expandDesc)}
                    className={`text-xs text-gray-500 font-light leading-relaxed cursor-pointer transition-all duration-300 ${expandDesc ? '' : 'line-clamp-3'}`}
                  >
                    {product.description}
                  </p>
                  <button 
                    onClick={() => setExpandDesc(!expandDesc)} 
                    className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-gray-400 mt-1 font-bold"
                  >
                    {expandDesc ? <>Lebih Sedikit <ChevronUp size={10}/></> : <>Selengkapnya <ChevronDown size={10}/></>}
                  </button>
               </div>

               {/* Compact Financial Breakdown */}
               <div className={`bg-gray-50 rounded-xl p-4 border border-gray-100 transition-all duration-500 ${isRestricted ? 'grayscale opacity-60' : ''}`}>
                  <div className="space-y-2">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-medium text-[10px] uppercase tracking-wider">Modal</span>
                        <span className={`font-serif font-medium text-brand-black ${isRestricted ? 'text-transparent bg-gray-200 rounded' : ''}`}>{formatCurrency(stats.price)}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-brand-gold font-medium text-[10px] uppercase tracking-wider">Komisi</span>
                        <span className={`font-serif font-medium text-brand-gold ${isRestricted ? 'text-transparent bg-gray-200 rounded' : ''}`}>+{formatCurrency(stats.commission)}</span>
                     </div>
                     <div className="h-px bg-gray-200 w-full my-1"></div>
                     <div className="flex justify-between items-center">
                        <span className="text-brand-black font-bold text-[10px] uppercase tracking-wider">Total</span>
                        <span className={`font-serif text-lg text-brand-black ${isRestricted ? 'text-transparent bg-gray-200 rounded' : ''}`}>{formatCurrency(stats.total)}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Fixed Bottom CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
               <button 
                  onClick={handleInitialClick}
                  disabled={isRestricted}
                  className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all duration-300 ${
                    isRestricted 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-brand-black text-white hover:bg-brand-gold'
                  }`}
               >
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    {isTaskCompleted ? 'Tugas Selesai' : isLocked ? 'Terkunci' : 'Pilih Paket'}
                  </span>
                  {!isRestricted && <MessageCircle size={16} />}
               </button>
            </div>
        </div>
      </div>

      {/* Shared Confirmation Modal - Works for both views */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-md p-6 animate-fade-in">
          <div className="bg-white p-8 max-w-sm w-full shadow-2xl rounded-sm border border-gray-100 text-center relative animate-fade-up">
            <div className="w-10 h-1 bg-brand-black mx-auto mb-6"></div>
            <h3 className="text-xl font-serif text-brand-black mb-3">
              Konfirmasi Order
            </h3>
            <p className="text-xs text-gray-500 mb-8 font-light leading-relaxed">
              Anda akan diarahkan ke WhatsApp Admin untuk memproses paket <strong>{product.name}</strong>.
            </p>
            
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={handleConfirmedOrder} 
                disabled={isProcessing}
                className="w-full py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] bg-brand-black text-white hover:bg-brand-gold transition-colors rounded-sm"
              >
                {isProcessing ? 'Memproses...' : 'Proses Sekarang'}
              </button>
              <button 
                onClick={() => setShowConfirmation(false)} 
                className="w-full py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-brand-black transition-colors rounded-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;