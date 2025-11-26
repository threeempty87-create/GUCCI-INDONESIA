import React, { useState, useEffect } from 'react';
import TaskCard from './components/TaskCard';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import { Task, Product } from './types';
import { ArrowLeft, Lock, CheckCircle2, Star, X, Sparkles } from 'lucide-react';

// --- DATA GENERATION ---

// Helper to generate products with commission rate
const createProduct = (id: string, name: string, cat: string, price: number, img: string, desc: string, rate: number = 0.20): Product => ({
  id, name, category: cat, price, image: img, description: desc, commissionRate: rate
});

// 5 Tasks + 1 Special Task
const TASKS: Task[] = [
  {
    id: 1,
    title: "GUCCI PARFUME COLLECTION",
    subtitle: "Koleksi Parfum",
    minPrice: 100000,
    maxPrice: 800000,
    coverImage: 'https://u-mercari-images.mercdn.net/photos/m53126147461_1.jpg',
    products: [
      createProduct('1-1', 'Gucci Flora Gorgeous Gardenia', 'Parfume collection', 100000, 'https://u-mercari-images.mercdn.net/photos/m53126147461_1.jpg', 'Wewangian floral khas untuk semua wanita berjiwa bebas yang penuh energi positif.', 0.20),
      createProduct('1-2', 'Gucci Flora Gorgeous Gardenia', 'Parfume collection', 300000, 'https://i.pinimg.com/736x/f1/c7/ba/f1c7bad409354ef34bbf3b10ff1057e2.jpg', 'Edisi terbatas yang memukau. Aroma buah pir yang ceria berpadu dengan sentuhan gula merah.', 0.20),
      createProduct('1-3', 'Shop Gucci Bloom Ambrosia', 'Parfume collection', 500000, 'https://www.myperfumeshop.in/cdn/shop/products/gucci-bloom-ambrosia-di-fiori-edp-intense-perfume-cologne-483404.jpg?v=1705004114&width=694', 'Varian intens dari Gucci Bloom yang ikonik. Menghadirkan aroma buket bunga yang semerbak.', 0.20),
      createProduct('1-4', 'Guilty Love Edition Pour Homme', 'Parfume collection', 800000, 'https://www.sephora.com/productimages/sku/s2838571-av-01-zoom.jpg?imwidth=315', 'Aroma aromatik fougère spicy green modern yang merayakan kebebasan.', 0.20)
    ]
  },
  {
    id: 2,
    title: "GUCCI FOOTWEAR COLLECTION",
    subtitle: "Koleksi Sepatu",
    minPrice: 540000,
    maxPrice: 2150000,
    coverImage: 'https://www.dhresource.com/webp/m/0x0/f2/albu/g21/M00/87/5B/rBVaqmC0pW-AVlR0AAFv9MudDrs133.jpg',
    products: [
      createProduct('2-1', 'Princetown Leather Slippers', 'SHOES collection', 540000, 'https://www.dhresource.com/webp/m/0x0/f2/albu/g21/M00/87/5B/rBVaqmC0pW-AVlR0AAFv9MudDrs133.jpg', 'Sandal kulit Princetown yang ikonik dengan detail Horsebit emas.', 0.20),
      createProduct('2-2', "Women's Natural Horsebit Espadrilles", 'SHOES collection', 750000, 'https://www.dr-alimansourkayali.com/mwhdfgubng/bcd0bbeca92f0cd5e51c67096a7aaabb/o_1iqff22odvtf916s2j6p380kb.jpeg', 'Espadrilles santai namun elegan dengan sentuhan Horsebit khas Gucci.', 0.20),
      createProduct('2-3', 'Gucci Princetown Fur Mule Loafer', 'SHOES collection', 1300000, 'https://moods.ir/wp-content/uploads/2025/02/papoosh-jlo-baste-9.webp', 'Loafer Princetown dengan lapisan bulu domba yang mewah.', 0.20),
      createProduct('2-4', 'Crystal GG Logo Canvas Low Top', 'SHOES collection', 2150000, 'https://i.pinimg.com/736x/fb/35/e9/fb35e97f8a50524a1f8c598c2a058af5.jpg', 'Sneakers platform low-top dengan kanvas berlogo GG kristal yang berkilau.', 0.20)
    ]
  },
  {
    id: 3,
    title: "GUCCI EYEWEAR COLLECTION",
    subtitle: "Koleksi Kacamata",
    minPrice: 1350000,
    maxPrice: 3150000,
    coverImage: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQqMmmopKjf1kawlroa1G8sUx0QURlpW7LYqDZdhg-0xSPE4fvZ',
    products: [
      createProduct('3-1', 'Sunglasses Gucci GG1802S', 'EYEWEAR collection', 1350000, 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQqMmmopKjf1kawlroa1G8sUx0QURlpW7LYqDZdhg-0xSPE4fvZ', 'Kacamata hitam dengan desain modern minimalis, memberikan perlindungan UV maksimal.', 0.20),
      createProduct('3-2', 'Sunglasses Gucci GG0817S', 'EYEWEAR collection', 2000000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWqkG9PR0quq2wR6o30-ueOPV9SEYd3pcZU9jrWSdbR3nY0jovEfTsiwZF&s', 'Desain bingkai tebal yang berani dengan logo Gucci di bagian samping.', 0.20),
      createProduct('3-3', 'Sunglasses Gucci GG0177S', 'EYEWEAR collection', 2700000, 'https://i.pinimg.com/736x/e8/fa/6b/e8fa6b35a1b13fef25d22d23e85982b6.jpg', 'Kacamata oversized ikonik dengan bingkai unik, dihiasi detail kristal.', 0.20),
      createProduct('3-4', 'Sunglasses Gucci GG1325S', 'EYEWEAR collection', 3150000, 'https://di2ponv0v5otw.cloudfront.net/posts/2025/05/22/682f10663752180f36fe287b/m_682f110688849a3ba2cbe494.jpeg', 'Koleksi terbaru dengan siluet futuristik dan material premium.', 0.20)
    ]
  },
  {
    id: 4,
    title: "GUCCI HANDBAGS COLLECTION",
    subtitle: "Koleksi Tas Wanita",
    minPrice: 2580000,
    maxPrice: 5800000,
    coverImage: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR3vs4TEPxE5dBaczF66ofU5kWKl7KKELy3JvFdM2jIyFAnqoNd',
    products: [
      createProduct('4-1', 'GUCCI DIANA', "BAG’S FOR WOMAN collection", 2580000, 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR3vs4TEPxE5dBaczF66ofU5kWKl7KKELy3JvFdM2jIyFAnqoNd', 'Tas jinjing bambu yang diciptakan kembali.', 0.20),
      createProduct('4-2', 'Gucci Padlock', "BAG’S FOR WOMAN collection", 3500000, 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcStVcMJq2HY_KEOHXu7P5d4TwthDPhZRs9UAu30iowLbNLsdwBO', 'Tas bahu terstruktur dengan penutup kunci arsip.', 0.20),
      createProduct('4-3', 'GUCCI MArmont', "BAG’S FOR WOMAN collection", 4000000, 'https://i.pinimg.com/736x/74/86/c3/7486c3ca4060b96bcca2609d7465b617.jpg', 'Tas bahu matelassé dengan detail Double G yang khas.', 0.30),
      createProduct('4-4', 'Gucci x Adidas Diana Medium', "BAG’S FOR WOMAN collection", 5800000, 'https://i.pinimg.com/1200x/97/92/02/979202411bd6562b5f0e1eb68c00f8f0.jpg', 'Kolaborasi eksklusif yang memadukan kode warisan Gucci dengan motif legendaris adidas.', 0.40)
    ]
  },
  {
    id: 5,
    title: "GUCCI WATCH COLLECTION",
    subtitle: "Koleksi Jam Tangan",
    minPrice: 3300000,
    maxPrice: 6100000,
    coverImage: 'https://i.etsystatic.com/55686872/r/il/993282/6877426488/il_fullxfull.6877426488_io5y.jpg',
    products: [
      createProduct('5-1', 'Gucci Bangle Watch', 'WATCH COLLECTION', 3300000, 'https://i.pinimg.com/736x/7e/9c/98/7e9c98a42744eece48b7db19c379b94b.jpg', 'Jam tangan bangle elegan dengan desain minimalis.', 0.30),
      createProduct('5-2', 'Gucci Diamantissima Watch', 'WATCH COLLECTION', 4800000, 'https://i.pinimg.com/736x/18/c8/bd/18c8bd79a435e80e9c2f2cecc34f1c25.jpg', 'Menampilkan pola diamante khas Gucci yang terukir halus.', 0.30),
      createProduct('5-3', 'Gucci 1990s Seashell Dial', 'WATCH COLLECTION', 5250000, 'https://i.pinimg.com/736x/62/81/f4/6281f437a3b724651d6ab50e1e7f420b.jpg', 'Jam tangan vintage rare item dari era 90an dengan dial kerang mutiara.', 0.40),
      createProduct('5-4', 'Gucci Guccissima', 'WATCH COLLECTION', 6100000, 'https://i.pinimg.com/736x/06/fc/b2/06fcb28b0d76253a6d62e8310a687a8c.jpg', 'Jam tangan gelang stainless steel dengan bezel berbentuk G yang ikonik.', 0.40)
    ]
  },
  {
    id: 6,
    title: "GUCCI HIGH JEWELRY",
    subtitle: "Akses Tugas Spesial",
    minPrice: 8000000,
    maxPrice: 17500000,
    isSpecial: true,
    coverImage: 'https://www.sijiewu.com/picc/b10/745c.jpg',
    products: [
      createProduct('6-1', 'Gucci Le Marché des Merveilles', 'HIGH JEWELRY', 8000000, 'https://www.sijiewu.com/picc/b10/745c.jpg', 'Kalung emas putih 18 karat dengan liontin berlian dan batu mulia.', 0.50),
      createProduct('6-2', 'Gucci Interlocking G Bracelet', 'HIGH JEWELRY', 10800000, 'https://img77.uenicdn.com/image/upload/v1678282871/business/45fe76ca-b4f0-4845-b6b3-db7ac445d18f.jpg', 'Gelang statement dengan desain Interlocking G yang ikonik.', 0.50),
      createProduct('6-3', 'Gucci Flora Diamond Ring', 'HIGH JEWELRY', 17500000, 'https://img4.dhresource.com/webp/m/0x0/f3/albu/ry/z/28/63cd44c7-596c-45e9-9ac8-4bc75f032c58.jpg', 'Cincin berlian motif flora yang melambangkan keanggunan abadi.', 0.50)
    ]
  }
];

const App: React.FC = () => {
  // STATE MANAGEMENT - PERSISTENT
  const [completedTaskLevel, setCompletedTaskLevel] = useState<number>(() => {
    // Try to load from local storage first
    try {
      const savedLevel = localStorage.getItem('gucci_task_level');
      return savedLevel ? parseInt(savedLevel, 10) : 0;
    } catch (error) {
      console.error("Failed to load progress", error);
      return 0;
    }
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSpecialModal, setShowSpecialModal] = useState(false);

  // SAVE PROGRESS whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('gucci_task_level', completedTaskLevel.toString());
    } catch (error) {
      console.error("Failed to save progress", error);
    }
  }, [completedTaskLevel]);

  // HANDLERS
  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleTaskComplete = () => {
    if (selectedTask) {
      const taskIndex = selectedTask.id - 1;
      
      // If completing the current active level
      if (taskIndex === completedTaskLevel) {
        // Special Logic: If user completes Task 3 (Index 2), show notification for Special Task
        if (taskIndex === 2) {
           setShowSpecialModal(true);
        }
        setCompletedTaskLevel(prev => Math.min(prev + 1, TASKS.length));
      }
    }
  };

  const goHome = () => {
    setSelectedTask(null);
    setSelectedProduct(null);
  };

  const goBackToTask = () => {
    setSelectedProduct(null);
  };

  // VIEW RENDERING
  const renderContent = () => {
    // 1. PRODUCT DETAIL VIEW
    if (selectedProduct && selectedTask) {
      const taskIndex = selectedTask.id - 1;
      let isLocked = taskIndex > completedTaskLevel;
      if (selectedTask.isSpecial) {
         isLocked = completedTaskLevel < 3;
      }

      const isCompleted = taskIndex < completedTaskLevel && !selectedTask.isSpecial; 

      return (
        <ProductDetail 
          product={selectedProduct} 
          onBack={goBackToTask}
          onComplete={handleTaskComplete}
          isTaskCompleted={isCompleted}
          isLocked={isLocked}
        />
      );
    }

    // 2. TASK PRODUCT LIST VIEW
    if (selectedTask) {
      const taskIndex = selectedTask.id - 1;
      let isLocked = taskIndex > completedTaskLevel;
      if (selectedTask.isSpecial) {
         isLocked = completedTaskLevel < 3;
      }
      
      const isCompleted = taskIndex < completedTaskLevel;
      const isSpecial = selectedTask.isSpecial;
      
      // Determine label
      let statusLabel = "";
      if (isLocked) statusLabel = "Mode Preview - Terkunci";
      if (isCompleted) statusLabel = "Mode Preview - Selesai";

      return (
        <div className={`animate-fade-in ${isSpecial ? 'bg-neutral-950 min-h-screen' : 'bg-white'} pb-32 relative`}>
          
          {/* Header Section for Task - Dynamic for Special */}
          <section className={`py-12 px-6 text-center border-b relative overflow-hidden animate-fade-up ${
             isSpecial ? 'border-brand-gold/20 text-brand-gold' : 'border-gray-100 text-brand-black bg-white'
          }`}>
             {isSpecial && (
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
             )}
             
            <span className={`text-xs font-sans uppercase tracking-[0.3em] mb-4 block ${
              isSpecial ? 'text-brand-gold-light opacity-80' : 'text-gray-400'
            }`}>
              {isSpecial ? 'Special Campaign' : `Gucci Campaign ${selectedTask.id}`}
            </span>
            
            <h2 className={`text-3xl md:text-5xl font-serif mb-6 tracking-tight relative inline-block ${
              isSpecial ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FCF6BA] via-[#D4AF37] to-[#AA8C2C] drop-shadow-md' : ''
            }`}>
              {selectedTask.title}
              {isSpecial && <Sparkles size={24} className="absolute -top-6 -right-8 text-brand-gold animate-pulse" />}
            </h2>
            
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className={`w-16 h-0.5 mb-2 ${isSpecial ? 'bg-gradient-to-r from-transparent via-brand-gold to-transparent' : 'bg-brand-gold'}`}></div>
              <p className={`max-w-lg mx-auto text-sm leading-relaxed font-light ${
                isSpecial ? 'text-brand-gray/80' : 'text-gray-500'
              }`}>
                {isSpecial 
                  ? "Koleksi Perhiasan Tinggi Eksklusif dengan penawaran komisi istimewa 50%. Akses terbatas." 
                  : `Silakan pilih produk dari koleksi ${selectedTask.title}. Setiap item mewakili keahlian pengrajin Italia kami.`
                }
              </p>
              
              {(isLocked || isCompleted) && (
                <span className={`inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full mt-4 ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                   {isCompleted ? <CheckCircle2 size={12}/> : <Lock size={12}/>} 
                   {statusLabel}
                </span>
              )}
            </div>
          </section>

          {/* Product Grid */}
          <section className="max-w-[1920px] mx-auto px-6 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {selectedTask.products.map((product, index) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onClick={() => handleProductSelect(product)}
                  isLocked={isLocked || isCompleted}
                  isSpecial={isSpecial}
                  index={index} // Pass index for stagger
                />
              ))}
            </div>
          </section>

          {/* FIXED BACK BUTTON - BOTTOM LEFT */}
          <div className="fixed bottom-6 left-6 z-50 animate-fade-in delay-500">
             <button 
              onClick={goHome}
              className={`flex items-center gap-3 px-5 py-3 shadow-xl backdrop-blur-md border transition-all duration-300 transform active:scale-95 group ${
                isSpecial 
                  ? 'bg-neutral-900 border-brand-gold/30 text-brand-gold hover:bg-black hover:border-brand-gold/60' 
                  : 'bg-white border-gray-200 text-brand-black hover:bg-gray-50'
              }`}
            >
              <ArrowLeft size={16} strokeWidth={2} className={`transition-transform duration-300 group-hover:-translate-x-1 ${isSpecial ? 'text-brand-gold' : 'text-gray-400 group-hover:text-brand-black'}`} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">All Collections</span>
            </button>
          </div>
        </div>
      );
    }

    // 3. HOME (TASK LIST) VIEW
    return (
      <>
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 text-center px-4 animate-fade-up border-b border-gray-50 bg-brand-gray/10 overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="text-[11px] font-bold font-sans uppercase tracking-[0.4em] text-brand-gold mb-8 block animate-fade-up delay-100 opacity-0" style={{animationFillMode: 'forwards'}}>
              GUCCI BUSINESS PROGRAM
            </span>
            
            {/* LUXURY ANIMATED TITLE */}
            <h2 className="text-6xl lg:text-9xl font-serif tracking-widest font-normal text-brand-black uppercase mb-8 leading-none flex justify-center gap-1 lg:gap-4 flex-wrap">
              {['G', 'U', 'C', 'C', 'I'].map((letter, index) => (
                <span 
                  key={index} 
                  className="inline-block opacity-0 animate-luxury-reveal"
                  style={{ animationDelay: `${index * 150 + 300}ms`, animationFillMode: 'forwards' }}
                >
                  {letter}
                </span>
              ))}
            </h2>
            
            <div className="w-24 h-0.5 bg-brand-black mx-auto mb-8 animate-scale-in delay-300 opacity-0" style={{animationFillMode: 'forwards'}}></div>
            <p className="max-w-md mx-auto text-sm text-gray-500 font-light leading-relaxed uppercase tracking-[0.2em] animate-fade-up delay-300 opacity-0" style={{animationFillMode: 'forwards'}}>
              Koleksi Kurasi & Penugasan Eksklusif
            </p>
          </div>
        </section>

        {/* Task Grid */}
        <section className="max-w-[1920px] mx-auto px-6 lg:px-12 py-16 lg:py-24 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {TASKS.map((task, index) => {
              // Standard logic
              let isLocked = index > completedTaskLevel;
              const isCompleted = index < completedTaskLevel;
              
              // Special Logic for Task 6 (Index 5)
              if (task.isSpecial) {
                isLocked = completedTaskLevel < 3;
              }
              
              return (
                <TaskCard 
                  key={task.id}
                  task={task}
                  isLocked={isLocked}
                  isCompleted={isCompleted}
                  onClick={() => handleTaskSelect(task)}
                  index={index} // Pass index for stagger
                />
              );
            })}
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-black font-sans selection:bg-brand-gold/30 selection:text-brand-black relative">
      <main className="flex-grow">
        {renderContent()}
      </main>
      
      <footer className="bg-black text-white pt-24 px-8 mt-auto overflow-hidden">
        <div className="max-w-[1920px] mx-auto w-full min-h-[50vh] flex flex-col justify-between">
           
           {/* Top Content Row - Horizontal Alignment */}
           <div className="flex flex-col gap-8 mb-12">
              <div className="flex flex-wrap items-center gap-6 md:gap-8">
                 {/* REMOVED: Icon - Gucci Interlocking G white square */}
                 
                 {/* Osteria Text */}
                 <div className="flex flex-col">
                      <span className="font-serif text-sm tracking-[0.2em] text-white">GUCCI</span>
                      <span className="font-serif text-sm tracking-[0.2em] text-[#D4AF37]">OSTERIA</span>
                      <span className="font-sans text-[8px] tracking-widest text-gray-500 mt-1">da Massimo Bottura</span>
                 </div>
                 
                 {/* Palazzo Text */}
                 <div className="font-serif text-sm tracking-[0.2em] text-[#D4AF37] ml-0 md:ml-4">
                     PALAZZO <span className="text-white">GUCCI</span>
                 </div>
              </div>

              {/* Copyright */}
              <div className="text-[9px] text-gray-600 font-sans tracking-wide leading-relaxed">
                 © 2016 - 2025 Guccio Gucci S.p.A. - All rights reserved. SIAE LICENCE # 2294/I/1936 and 5647/I/1936
              </div>
           </div>

           {/* Big Text Footer - Fully Visible */}
           <div className="w-full flex justify-center items-end">
              <h1 className="font-serif text-[23vw] text-white leading-[0.8] tracking-tighter select-none pointer-events-none text-center">
                 GUCCI
              </h1>
           </div>
        </div>
      </footer>

      {/* SPECIAL TASK UNLOCKED MODAL */}
      {showSpecialModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4">
          <div className="bg-neutral-900 max-w-md w-full p-8 text-center relative border border-brand-gold shadow-[0_0_50px_rgba(212,175,55,0.3)] animate-scale-in">
            <button 
              onClick={() => setShowSpecialModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="mb-6 flex justify-center">
              <div className="bg-brand-gold/10 p-5 rounded-full border border-brand-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Sparkles size={40} className="text-brand-gold fill-brand-gold animate-pulse" />
              </div>
            </div>
            <h3 className="text-3xl font-serif text-brand-gold mb-2 uppercase tracking-wide drop-shadow-md">
              AKSES SPESIAL TERBUKA
            </h3>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mb-6"></div>
            <p className="text-sm text-gray-300 mb-8 leading-relaxed">
              Selamat! Dedikasi Anda membuka akses ke <strong>High Jewelry Collection</strong>. Nikmati komisi eksklusif <strong>50%</strong> untuk koleksi termewah kami.
            </p>
            <button 
              onClick={() => setShowSpecialModal(false)}
              className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] text-black font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all transform hover:-translate-y-1"
            >
              Akses Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;