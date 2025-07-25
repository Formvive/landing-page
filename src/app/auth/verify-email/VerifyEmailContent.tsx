'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
          body: JSON.stringify({ token }),
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      });
      setResendStatus(res.ok ? 'sent' : 'failed');
    } catch {
      setResendStatus('failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center bg-white">
      <AnimatePresence mode="wait">
        {status === 'verifying' && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Verifying your email...</h1>
            <p className="text-gray-600">Please wait a moment</p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-600">Email Verified! ✅</h1>
            <p className="text-gray-600 mb-4">Your email has been successfully verified.</p>
            <p className="text-gray-500 text-sm">Redirecting you to the login page...</p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-red-600">Verification failed ❌</h1>
            <p className="text-gray-600 mb-4">Please try again or resend the verification email below.</p>
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
          </motion.div>
        )}

        {status === 'default' && (
          <motion.div
            key="default"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Check your inbox to verify your email</h1>
            <p className="text-gray-600 mb-6">
              We’ve sent a verification link to <span className="font-semibold">{email || resendEmail}</span><br />
              Click the link to confirm your account and continue to Formvive
            </p>
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
              <p className="text-xs text-gray-500 mt-6">
                Didn’t receive anything? It might take a minute or two and don’t forget to check your spam folder.
                Wanna go back <span className="underline cursor-pointer" onClick={() => router.push('/')}>home</span>?
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
