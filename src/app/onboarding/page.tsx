'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

export default function OnboardingPage() {
  const router = useRouter();

  const [fullName, setFullName]       = useState('');
  const [role, setRole]               = useState('');
  const [companySize, setCompanySize] = useState('');
  const [useCase, setUseCase]         = useState('');
  const [earlyAccess, setEarlyAccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  // Redirect to /signup if no token found
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signup');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!fullName || !role || !companySize || !useCase) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No signup token found. Please sign up again.');
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
          fullName,
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
        setSuccess('Onboarding completed! Redirecting...');
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
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-gray-300 rounded"
              />
            </div>

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
              <input
                type="number"
                placeholder="Example: 1, 2–5, 6–10, 11+"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="border border-gray-300 rounded"
              />
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
