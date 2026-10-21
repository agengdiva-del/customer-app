import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    cartMerchant, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    setIsCheckoutOpen 
  } = useApp();

  if (!isCartOpen) return null;

  const deliveryFee = cartMerchant?.deliveryFee || 6000;
  const platformFee = 2000;
  const estimatedTotal = cartTotal + deliveryFee + platformFee;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Keranjang Pesanan AWD
              </h3>
              {cartMerchant && (
                <span className="text-xs text-slate-500 truncate block max-w-[220px]">
                  {cartMerchant.name}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
              <ShoppingBag className="w-12 h-12 text-slate-300 stroke-[1.5]" />
              <p className="text-sm font-medium">Keranjang belanja Anda masih kosong</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <img
                    src={item.item.imageUrl}
                    alt={item.item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.item.name}
                    </h4>
                    {item.notes && (
                      <p className="text-[10px] text-slate-400 italic mt-0.5 truncate">
                        "{item.notes}"
                      </p>
                    )}
                    <div className="text-xs font-bold font-mono text-blue-600 dark:text-sky-400 mt-1">
                      Rp{item.item.price.toLocaleString('id-ID')}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-lg">
                        <button
                          onClick={() => updateCartQuantity(item.item.id, -1)}
                          className="text-slate-600 dark:text-slate-300 hover:text-blue-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold font-mono w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.item.id, 1)}
                          className="text-slate-600 dark:text-slate-300 hover:text-blue-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.item.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs font-bold text-slate-900 dark:text-white">
                    Rp{(item.item.price * item.quantity).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}

              <div className="pt-2 text-right">
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:underline"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer & Total */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal Menu</span>
                <span className="font-mono">Rp{cartTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim Estimasi</span>
                <span className="font-mono">Rp{deliveryFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan Aplikasi</span>
                <span className="font-mono">Rp{platformFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Estimasi Total</span>
                <span className="text-blue-600 dark:text-sky-400 font-mono text-base font-black">
                  Rp{estimatedTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
