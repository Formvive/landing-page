'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import './page.css';
// import { getAuthToken } from '@/utils/authHelper';

export default function OnboardingContext() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [role, setRole] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [useCase, setUseCase] = useState('');
  const [earlyAccess, setEarlyAccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- 1. THE FIX: Extract Token & UserId manually on load ---
  useEffect(() => {
    // We access window.location.href directly to handle the 
    // double '?' bug from the backend
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      
      // A. Extract Token (handling both ?access= and &access=)
      const tokenMatch = currentUrl.match(/[?&]access=([^&]+)/);
      if (tokenMatch && tokenMatch[1]) {
        const token = tokenMatch[1];
        localStorage.setItem('authToken', token);
        console.log("Token secured from URL");
      }

      // B. Extract UserId
      // Try searchParams first, fallback to localStorage, fallback to Regex
      let currentUserId = searchParams.get('userId') || localStorage.getItem('userId');
      
      // If searchParams got confused by the double '?', it might include the access token
      // e.g., "user123?access=..." -> we split to get just "user123"
      if (currentUserId && currentUserId.includes('?')) {
        currentUserId = currentUserId.split('?')[0];
      }
      
      // Fallback: If searchParams failed entirely, regex the URL for userId
      if (!currentUserId) {
        const idMatch = currentUrl.match(/[?&]userId=([^?&]+)/);
        if (idMatch) currentUserId = idMatch[1];
      }

      // Final check
      if (currentUserId) {
        setUserId(currentUserId);
        // Optional: Save userId to storage if you want it to persist across reloads
        localStorage.setItem('userId', currentUserId); 
      } else {
        // If we really can't find an ID or a Token after all that, redirect
        const storedToken = localStorage.getItem('authToken');
        if (!storedToken) {
          // Allow a small delay for state to settle, or redirect immediately
          // router.push('/signup'); 
        }
      }
    }
  }, [searchParams, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!role || !companySize || !useCase) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // Get the token we saved in the useEffect above
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      // Note: We use the `userId` state variable here
      if (!token && !userId) {
        setError('Unauthorized access. Please sign up.');
        router.push('/signup');
        return;
      }

      const response = await fetch('https://form-vive-server.onrender.com/api/v1/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Explicitly send the Bearer token
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          userId: userId, // Ensure this matches what your backend expects
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