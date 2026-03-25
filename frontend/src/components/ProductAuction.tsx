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
    <main className="max-w-3xl mx-auto mt-16 px-4">
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <img
          src={product.imgURL}
          alt=""
          className="w-full h-64 object-cover rounded-xl"
        />

        <h1 className="text-2xl font-semibold">{product.product1}</h1>

        <p className="text-gray-500">Startpris: {product.startsum} kr</p>

        <p className="text-xl font-bold text-blue-600">
          Current bid: {currentBid} kr
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-4 sm:flex-row sm:items-end sm:flex-wrap">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border border-[#19323C] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A93F55] sm:max-w-xs"
        />
        <input
          type="number"
          min={1}
          step={1}
          required
          placeholder="Your bid (kr)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-[#19323C] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A93F55] sm:flex-1"
        />
        <button
          type="submit"
          className="border border-[#19323C] text-[#19323C] px-6 py-3 rounded-xl font-medium hover:bg-[#A93F55] hover:text-white transition"
        >
          Place bid
        </button>
      </form>

      {feedback && (
        <p className={`mt-3 text-sm ${feedback.type === 'ok' ? 'text-green-700' : 'text-red-600'}`}>
          {feedback.text}
        </p>
      )}
    </main>
  );
}
