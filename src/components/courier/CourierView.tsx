import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COURIER_IMAGE } from '../../data/mockData';
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  ShieldAlert, 
  Camera, 
  Calculator, 
  Bike, 
  CheckCircle2, 
  Info,
  Clock
} from 'lucide-react';
import { Order } from '../../types';

export const CourierView: React.FC = () => {
  const { 
    setActiveService, 
    selectedAddress, 
    user, 
    createOrder, 
    setActiveOrder, 
    setIsTrackingModalOpen,
    showToast 
  } = useApp();

  const [pickupAddress, setPickupAddress] = useState(
    `${selectedAddress.streetAddress}, ${selectedAddress.village}, Arjawinangun`
  );
  const [destinationAddress, setDestinationAddress] = useState(
    'Jl. Sunan Gunung Jati No. 88, Klayan, Cirebon'
  );
  const [recipientName, setRecipientName] = useState('Hendra Wijaya');
  const [recipientPhone, setRecipientPhone] = useState('081399887766');
  const [packageCategory, setPackageCategory] = useState<'Dokumen' | 'Makanan' | 'Pakaian' | 'Pecah Belah' | 'Elektronik'>('Dokumen');
  const [weightKg, setWeightKg] = useState<number>(1);
  const [description, setDescription] = useState('Berkas dokumen penting & sampel kain batik');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Pricing formula: Base fee Rp8.000 + Rp2.500/km + (weight - 1)*Rp2.000
  const estimatedKm = 12.4; // Arjawinangun to Cirebon Kota
  const baseTariff = 8000;
  const distanceCost = Math.round(estimatedKm * 2500);
  const weightCost = Math.max(0, (weightKg - 1) * 2000);
  const totalTariff = baseTariff + distanceCost + weightCost;

  const handleOrderCourier = () => {
    if (!agreedTerms) {
      showToast('Harap setujui syarat & ketentuan pengiriman barang');
      return;
    }

    // Direct simulated instant courier order
    const courierOrder: Order = {
      id: `ord-kirim-${Date.now()}`,
      orderNumber: `AWD-${Date.now().toString().slice(-6)}`,
      serviceType: 'courier',
      merchantName: 'AWD Kirim Instan Arjawinangun',
      destinationAddress: {
        ...selectedAddress,
        streetAddress: destinationAddress,
        recipientName,
        phone: recipientPhone,
      },
      items: [
        {
          id: 'item-pkt-1',
          name: `Paket ${packageCategory} (${weightKg} kg)`,
          price: totalTariff,
          quantity: 1,
          notes: description,
        }
      ],
      subtotal: totalTariff,
      deliveryFee: 0,
      platformFee: 1500,
      voucherDiscount: 0,
      totalAmount: totalTariff + 1500,
      status: 'driver_assigned',
      paymentMethod: 'mitrapay',
      isPaid: true,
      etaMinutes: 25,
      createdAt: new Date().toISOString(),
      notes: `Titik jemput: ${pickupAddress}`,
      packageDetails: {
        category: packageCategory,
        description,
        weightKg,
        senderName: user.name,
        senderPhone: user.phone,
      }
    };

    setActiveOrder(courierOrder);
    setIsTrackingModalOpen(true);
    showToast('Kurir AWD ditugaskan! Menuju titik jemputmu di Arjawinangun.');
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveService(null)}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>AWD Kirim · Ekspedisi & Titip Paket</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kirim barang hari ini sampai dalam hitungan jam se-Cirebon & sekitarnya
          </p>
        </div>
      </div>

      {/* Hero Visual Card */}
      <div className="relative rounded-3xl overflow-hidden h-36 bg-slate-900 shadow-md">
        <img
          src={COURIER_IMAGE}
          alt="AWD Kirim"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-indigo-950/70 to-transparent p-4 flex flex-col justify-center text-white">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300">
            AWD - ARJAWINANGUN DELIVERY · BY WONG NANGUN
          </span>
          <h3 className="text-base sm:text-lg font-bold">
            Jemput di Pintu Rumah, Langsung Antar ke Tujuan
          </h3>
          <p className="text-xs text-blue-100 mt-0.5">
            Gratis asuransi kehilangan s/d Rp1.000.000 per pengiriman
          </p>
        </div>
      </div>

      {/* Address Form: Pickup & Destination */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>Rute Pengiriman Paket</span>
        </h3>

        {/* Pickup Field */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-sky-400">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Titik Jemput (Arjawinangun)
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Pengirim: {user.name}</span>
          </div>
          <input
            type="text"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Destination Field */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              Titik Pengantaran (Tujuan)
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Estimasi: {estimatedKm} km</span>
          </div>
          <input
            type="text"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Recipient Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
              Nama Penerima
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
              No. HP / WhatsApp Penerima
            </label>
            <input
              type="text"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Package Specs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <span>Detail Barang & Paket</span>
        </h3>

        {/* Category Pills */}
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">
            Kategori Paket
          </label>
          <div className="flex flex-wrap gap-2">
            {(['Dokumen', 'Makanan', 'Pakaian', 'Pecah Belah', 'Elektronik'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setPackageCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  packageCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Weight Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-slate-700 dark:text-slate-300">Perkiraan Berat Barang:</span>
            <span className="text-blue-600 font-mono font-bold text-sm">{weightKg} Kg</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>1 kg</span>
            <span>5 kg</span>
            <span>10 kg</span>
            <span>Maks 20 kg (Motor AWD)</span>
          </div>
        </div>

        {/* Description & Photo */}
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
            Deskripsi / Instruksi Tambahan
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setHasPhoto(!hasPhoto);
              showToast(hasPhoto ? 'Foto dihapus' : 'Foto paket berhasil ditambahkan (simulasi)');
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              hasPhoto
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                : 'border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{hasPhoto ? 'Foto Terlampir ✓' : '+ Lampirkan Foto Paket'}</span>
          </button>
        </div>
      </div>

      {/* Restricted Items Warning Notice */}
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 text-xs text-red-800 dark:text-red-300 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Larangan Pengiriman Barang Terlarang</span>
          <p className="text-[11px] leading-relaxed">
            AWD secara ketat melarang pengiriman narkoba/psikotropika, senjata tajam/api, uang tunai tanpa segel, hewan hidup, dan bahan kimia mudah meledak sesuai hukum Republik Indonesia.
          </p>
        </div>
      </div>

      {/* Agreement Checkbox */}
      <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={agreedTerms}
          onChange={(e) => setAgreedTerms(e.target.checked)}
          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
        />
        <span>Saya menjamin barang yang dikirim aman dan bukan barang terlarang.</span>
      </label>

      {/* Cost Breakdown & Confirmation CTA */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-blue-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Tarif Dasar AWD Kirim</span>
            <span className="font-mono">Rp{baseTariff.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Jarak Tempuh ({estimatedKm} km x Rp2.500)</span>
            <span className="font-mono">Rp{distanceCost.toLocaleString('id-ID')}</span>
          </div>
          {weightCost > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>Biaya Tambahan Berat ({weightKg} kg)</span>
              <span className="font-mono">Rp{weightCost.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-500">
            <span>Biaya Layanan Aplikasi</span>
            <span className="font-mono">Rp1.500</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Total Ongkos Kirim</span>
            <span className="text-blue-600 dark:text-sky-400 font-mono text-base font-black">
              Rp{(totalTariff + 1500).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <button
          onClick={handleOrderCourier}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Bike className="w-4 h-4" />
          <span>Pesan Kurir AWD Sekarang · Rp{(totalTariff + 1500).toLocaleString('id-ID')}</span>
        </button>
      </div>
    </div>
  );
};
