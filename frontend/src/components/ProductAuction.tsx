import { type FormEvent, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type Product = {
  id: string;
  product1: string;
  imgURL: string;
  startsum: number;
  bid: number;
};

/** En produkt med bud i realtid via socket. */
export function ProductAuction() {
  const auctionId = new URLSearchParams(window.location.search).get('id');
  const [product, setProduct] = useState<Product | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentBid, setCurrentBid] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [userName, setUserName] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!auctionId) {
      setLoadError('Missing product id in URL');
      return;
    }
    fetch(`${API_BASE}/api/product/${auctionId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Could not load product');
        return res.json();
      })
      .then((p: Product) => {
        setProduct(p);
        setCurrentBid(p.bid > 0 ? p.bid : p.startsum);
      })
      .catch(() => setLoadError('Could not load product'));
  }, [auctionId]);

  useEffect(() => {
    if (!auctionId) return;

    const socket: Socket = io(API_BASE);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinAuction', { auctionId });
    });

    socket.on('bidAccepted', () => {
      setFeedback({ type: 'ok', text: 'Bid accepted' });
    });

    socket.on('bidRefused', (data: { reason?: string }) => {
      setFeedback({ type: 'err', text: data?.reason ?? 'Bid refused' });
    });

    socket.on('bidUpdated', (payload: { bid: number; product?: Product }) => {
      setCurrentBid(payload.bid);
      if (payload.product) setProduct(payload.product);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [auctionId]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!auctionId || !socketRef.current) return;
    setFeedback(null);
    const value = Number(amount);
    socketRef.current.emit('placeBid', {
      auctionId,
      amount: value,
      user: userName.trim() || 'Anonymous',
    });
  }

  if (!auctionId || loadError) {
    return (
      <main className="max-w-3xl mx-auto mt-16 px-4">
        <p className="text-red-600">{loadError ?? 'Invalid link'}</p>
      </main>
    );
  }

  if (!product || currentBid === null) {
    return (
      <main className="max-w-3xl mx-auto mt-16 px-4">
        <p className="text-gray-600">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">

          <img
            src={product.imgURL}
            alt=""
            className="w-full h-64 object-cover rounded-xl"
          />

          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#19323C] to-[#A93F55] bg-clip-text text-transparent">
            {product.product1}
          </h1>

          <p className="text-[#A93F55]">
            Startpris: {product.startsum.toLocaleString('sv-SE')} kr
          </p>

          <p className="text-2xl font-bold text-[#19323C]">
            Current bid: {currentBid.toLocaleString('sv-SE')} kr
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
        >
          <input
            type="text"
            placeholder="Ditt namn (valfritt)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border border-[#19323C] bg-white text-black px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A93F55]placeholder-gray-400 sm:max-w-xs"
          />

          <input
            type="number"
            min={1}
            required
            placeholder="Ditt bud (kr)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-[#19323C] bg-white text-black px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A93F55]placeholder-gray-400 sm:flex-1"
          />

          <button
            type="submit"
            className="bg-[#19323C] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#A93F55] transition"
          >
            Lägg bud
          </button>
        </form>

        {feedback && (
          <div
            className={`p-3 rounded-xl text-sm font-medium ${
              feedback.type === 'ok'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {feedback.text}
          </div>
        )}
      </div>
    </main>
  );
}
