'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      const resp = await fetch('https://form-vive-server.onrender.com/api/:version/auth/google/callback', {
        credentials: 'include',
      });
      if (!resp.ok) {
        // redirect to error page
        return router.replace('/login?error=google_fail');
      }
      const json = await resp.json();
      const token = json.data.token;
      // store token
      localStorage.setItem('token', token);
      // optionally redirect back to original path
      router.replace('/');
    };
    fetchToken();
  }, [router]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('authToken', token);
      document.cookie = `authToken=${token}; path=/;`;
      router.push('/onboarding');
    } else {
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Signing you in with Google...</p>
    </div>
  );
}
