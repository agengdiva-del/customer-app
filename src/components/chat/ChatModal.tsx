import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QUICK_CHAT_RESPONSES } from '../../data/mockData';
import { 
  X, 
  Send, 
  Image, 
  Phone, 
  CheckCheck, 
  Smile, 
  Paperclip,
  Check
} from 'lucide-react';

export const ChatModal: React.FC = () => {
  const { 
    isChatModalOpen, 
    setIsChatModalOpen, 
    chatMessages, 
    sendChatMessage, 
    activeOrder,
    showToast 
  } = useApp();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatModalOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatModalOpen]);

  if (!isChatModalOpen) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  const handleQuickChipClick = (response: string) => {
    sendChatMessage(response);
  };

  const handleSendPhotoSimulation = () => {
    sendChatMessage('Foto teras rumah:', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=80');
    showToast('Foto rumah berhasil dikirim ke driver');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden h-[90vh] sm:h-[650px] flex flex-col border border-blue-100 dark:border-slate-800 animate-in fade-in duration-200">
        {/* Chat Header in Blue Gradient */}
        <div className="p-3.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activeOrder?.driver?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt="Driver"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/60"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-sky-400 border-2 border-blue-800 rounded-full" />
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight">
                {activeOrder?.driver?.name || 'Kang Asep (Kurir AWD)'}
              </h4>
              <span className="text-[11px] text-blue-100 flex items-center gap-1 font-mono">
                {activeOrder?.driver?.vehiclePlate || 'E 4567 AW'} · Kurir AWD Online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast(`Menghubungi ${activeOrder?.driver?.name}...`)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              title="Telepon"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsChatModalOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950">
          <div className="text-center my-2">
            <span className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 px-3 py-1 rounded-full font-medium border border-blue-200/50 dark:border-blue-800/40">
              Obrolan dienkripsi untuk privasi Anda & Kurir AWD Arjawinangun
            </span>
          </div>

          {chatMessages.map(msg => {
            const isMe = msg.senderType === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-xs space-y-1 ${
                    isMe
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-blue-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  {msg.imageUrl && (
                    <div className="rounded-xl overflow-hidden mb-1.5 max-h-40">
                      <img src={msg.imageUrl} alt="Lampiran" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="leading-relaxed">{msg.text}</p>
                  <div
                    className={`flex items-center justify-end gap-1 text-[9px] ${
                      isMe ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-sky-200" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Chips Strip */}
        <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {QUICK_CHAT_RESPONSES.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleQuickChipClick(chip)}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 transition-colors shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
          <button
            onClick={handleSendPhotoSimulation}
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Kirim Foto"
          >
            <Image className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik pesan untuk kurir AWD..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 disabled:opacity-40 text-white transition-all shadow-md shadow-blue-500/25 active:scale-95"
            title="Kirim"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
