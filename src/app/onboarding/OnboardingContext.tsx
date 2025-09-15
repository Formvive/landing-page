'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import './page.css';
import { getAuthToken } from '@/utils/authHelper';

export default function OnboardingContext() {
  const router = useRouter();
  const searchParams = useSearchParams();
  let userId = localStorage.getItem('userId') || searchParams.get('userId');
  // Clean up userId if it contains query parameters
  if (userId && userId.includes('?')) {
    userId = userId.split('?')[0];
  }
  

  const [role, setRole]               = useState('');
  const [companySize, setCompanySize] = useState('');
  const [useCase, setUseCase]         = useState('');
  const [earlyAccess, setEarlyAccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  // Redirect to /signup if no token found
  useEffect(() => {
    const token = getAuthToken();
    if (!userId && !token) {
      router.push('/signup');
    }
  }, [router, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if ( !role || !companySize || !useCase) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();

      if (!token && !userId) {
        setError('Unauthorized access. Please sign up.');
        router.push('/signup');
        return;
      }

      const response = await fetch('https://form-vive-server.onrender.com/api/v1/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            userId,
          role,
          companySize: Number(companySize),
          useCase,
          earlyAccess
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong');
      } else {
        setSuccess('Onboarding completed! Welcome...');
        // Redirect to dashboard after short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="signUpPage">
        <h1>Welcome to Formvive</h1>
        <div className="signUpBlock">
          <h2 className="font-medium">Help us personalize your experience</h2>
          <p className="text-center">
            Just a few quick questions to get you set up. We’ll use your answers to shape the best possible Formvive experience.
          </p>

          <form className="signUpForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label>Your Role / Job Title</label>
              <input
                type="text"
                placeholder="Example: Founder, Designer, Product Manager"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-300 rounded"
              />
            </div>

            <div className="inputGroup">
              <label>Company or Team Size</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                <option value="">Select size</option>
                <option value="1">Just Me</option>
                <option value="2-10">2–10 People</option>
                <option value="11-25">11-25 People</option>
                <option value="26-50">26-50 People</option>
                <option value="51+">51+</option>
              </select>
            </div>

            <div className="inputGroup">
              <label>How do you plan to use Formvive?</label>
              <textarea
                rows={2}
                placeholder="Example: to build better feedback forms, onboarding flows, client research"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="border border-gray-300 rounded p-4"
              ></textarea>
            </div>

            <button type="submit" className="signUpBtn" disabled={loading}>
              {loading ? 'Submitting...' : 'Continue to Dashboard'}
            </button>

            <div className="flex items-center text-sm termsCheckbox">
              <input
                type="checkbox"
                checked={earlyAccess}
                onChange={(e) => setEarlyAccess(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2">Keep me in the loop with early access news & tips</span>
            </div>
          </form>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        </div>
      </div>
    </div>
  );
}
