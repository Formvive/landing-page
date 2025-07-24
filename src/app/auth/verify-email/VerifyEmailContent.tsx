'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'default' | 'verifying' | 'success' | 'error'>('default');
  const [wrongEmailMode, setWrongEmailMode] = useState(false);
  const [resendEmail, setResendEmail] = useState(email || '');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  useEffect(() => {
    if (!token) return;

    setStatus('verifying');

    const verifyEmail = async () => {
      try {
        const res = await fetch('https://api.formvive.com/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token }),
        });

        if (res.ok) {
          setStatus('success');
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
        throw new Error(status + 'verifying email. Please try again later.');
      }
    };

    verifyEmail();
  }, [token, router]);
  
  const handleResend = async () => {
    if (!resendEmail) return;

    setResendStatus('sending');

    try {
      const res = await fetch('https://form-vive-server.onrender.com/api/v1/auth/resend-verification-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resendEmail}),
      });
      console.log('Resend response:', res);
      const text = await res.text();
      console.log('✅ Resend response status:', res.status);
      console.log('📩 Resend response body:', text);
      setResendStatus(res.ok ? 'sent' : 'failed');
    } catch {
      setResendStatus('failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Check your inbox to verify your email</h1>
        <p className="text-gray-600 mb-6">
          We’ve sent a verification link to <span className="font-semibold">{email || resendEmail}</span><br />
          Click the link to confirm your account and continue to Formvive
        </p>

        {wrongEmailMode ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your correct Email Address"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              className="px-4 py-3 rounded-md border border-gray-300 w-full sm:w-auto"
            />
            <button
              onClick={handleResend}
              className="bg-black text-white px-6 py-3 rounded-md font-semibold"
              disabled={resendStatus === 'sending'}
            >
              {resendStatus === 'sending' ? 'Sending...' : 'Resend Email'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleResend}
              className="bg-black text-white px-6 py-3 rounded-md font-semibold"
              disabled={resendStatus === 'sending'}
            >
              {resendStatus === 'sending' ? 'Sending...' : 'Resend Email'}
            </button>

            <button
              className="mt-2 text-sm font-semibold"
              onClick={() => setWrongEmailMode(true)}
            >
              Wrong email? <span className="underline">Edit and try again</span>
            </button>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-6">
          Didn’t receive anything? It might take a minute or two and don’t forget to check your spam folder.
          Wanna go back <span className="underline cursor-pointer" onClick={() => router.push('/')}>home</span>?
        </p>
      </div>
    </div>
  );
}
