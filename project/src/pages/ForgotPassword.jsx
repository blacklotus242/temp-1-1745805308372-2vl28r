import { useState } from 'react';
import { requestPasswordReset } from '../api/authApi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await requestPasswordReset(email);
    if (success) {
      alert('Password reset email sent (simulated).');
    } else {
      alert('Email not found.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Send Reset Email
        </button>
      </form>
    </div>
  );
}