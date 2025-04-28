import { useState } from 'react';

export default function Subscribe() {
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/stripe-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (data.success) {
      window.location.href = data.url; // Redirect to "Thank You" or real Stripe page later
    } else {
      alert('Subscription failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Subscribe</h1>
      <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
          Subscribe for $10/month
        </button>
      </form>
    </div>
  );
}