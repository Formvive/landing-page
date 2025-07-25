"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const GoogleCallbackContent = dynamic(() => import('./GoogleCallbackContent'), { ssr: false });

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
