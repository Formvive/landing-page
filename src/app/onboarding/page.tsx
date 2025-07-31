'use client';

import { Suspense } from 'react';
import OnboardingContext from './OnboardingContext';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <OnboardingContext />
    </Suspense>
  );
}
