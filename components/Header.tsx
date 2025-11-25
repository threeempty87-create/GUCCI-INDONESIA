import React, { useState, useRef, useEffect } from 'react';
import { generateStylistResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Upload, User, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';

const AIStylist: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Selamat Datang. I am your personal Gucci client advisor. How may I assist you in curating your look today? You can ask for outfit advice or upload an image for accessory matching."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const imageToSend = selectedImage ? selectedImage.split(',')[1] : undefined; // Remove data URL prefix
    const mimeType = selectedImage ? selectedImage.split(';')[0].split(':')[1] : 'image/jpeg';
    
    setSelectedImage(null); // Clear image after sending
    setIsLoading(true);

    const responseText = await generateStylistResponse(userMessage.text, imageToSend, mimeType);

    const modelMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-gray/20 pt-20 pb-12 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-2xl overflow-hidden flex flex-col h-[80vh] border border-gray-200">
        
        {/* Header */}
        <div className="bg-brand-black p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-2 rounded-full">
                    <Sparkles className="text-brand-gold" size={24} />
                </div>
                <div>
                    <h2 className="text-white font-serif text-xl">Gucci Private Stylist</h2>
                    <p className="text-white/60 text-xs tracking-widest uppercase">Powered by Gemini</p>
                </div>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] md:max-w-[70%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.role === 'user' ? 'bg-gray-100 border-gray-300' : 'bg-brand-black border-brand-black'}`}>
                  {msg.role === 'user' ? <User size={16} className="text-gray-600" /> : <span className="font-serif text-white font-bold text-xs">G</span>}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col space-y-2`}>
                  <div className={`p-4 md:p-6 text-sm md:text-base leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gray-100 text-gray-800 rounded-2xl rounded-tr-sm' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm font-light'
                  }`}>
                    {msg.image && (
                      <img src={msg.image} alt="User upload" className="max-w-full h-auto rounded mb-3 border border-gray-200" />
                    )}
                    {msg.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm flex items-center space-x-2 ml-14">
                  <Loader2 className="animate-spin text-brand-black" size={16} />
                  <span className="text-xs text-gray-400 tracking-widest">CURATING RESPONSE...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
           {selectedImage && (
             <div className="mb-4 relative inline-block">
               <img src={selectedImage} alt="Preview" className="h-20 w-auto rounded border border-gray-200" />
               <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
               >
                 <span className="sr-only">Remove</span>
                 <XIcon />
               </button>
             </div>
           )}

           <div className="flex items-center gap-4">
             <label className="cursor-pointer p-3 rounded-full hover:bg-gray-50 text-gray-400 hover:text-brand-gold transition-colors">
               <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
               <ImageIcon size={20} />
             </label>
             
             <div className="flex-grow relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask for advice or describe what you're looking for..."
                    className="w-full bg-gray-50 border-none focus:ring-1 focus:ring-brand-gold rounded-none px-4 py-3 text-sm font-light"
                />
             </div>

             <button 
               onClick={handleSend}
               disabled={isLoading || (!input && !selectedImage)}
               className="p-3 bg-brand-black text-white hover:bg-brand-gold disabled:opacity-50 transition-colors"
             >
               <Send size={20} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper for X icon
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default AIStylist;