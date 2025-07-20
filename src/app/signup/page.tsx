'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './page.css';

export default function SignUpPage() {
  const router = useRouter();

  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted]     = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://form-vive-server.onrender.com/api/v1/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          termsAccepted
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Sign up failed');
      } else {
        setSuccess(data.message || 'Sign up successful!');
        localStorage.setItem('token', data.token);

        // Redirect to onboarding
        router.push('/onboarding');

        // Clear form (optional)
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTermsAccepted(false);
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
        <h1>Formvive</h1>
        <div className="signUpBlock">
          <h2 className="font-medium">Sign Up</h2>
          <p className="text-center">Create your account and get started</p>

          <form className="signUpForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label>First Name</label>
              <input
                type="text"
                placeholder="Enter your firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border border-gray-300 rounded"
              />
            </div>
            <div className="inputGroup">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Enter your lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border border-gray-300 rounded"
              />
            </div>
            <div className="inputGroup">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded"
              />
            </div>

            <div className="flex flex-row justify-between gap-5">
              <div className="passwordRow">
                <label>Password</label>
                <div className="password">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    <Image src='/assets/icons/eye.svg' alt="reveal password button" width={20} height={15}/>
                  </button>
                </div>
              </div>

              <div className="passwordRow">
                <label>Confirm Password</label>
                <div className="password">
                  <input
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    <Image src='/assets/icons/eye.svg' alt="reveal password button" width={20} height={15}/>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="signUpBtn"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>

            <div className="flex items-center text-sm termsCheckbox">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2">I agree to the Terms and Privacy Policy</span>
            </div>
          </form>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

          <div className="signUpBtns">
            <button>
              <Image src="/assets/icons/goog.png" alt="Google" width={20} height={20} />
              Sign up with Google
            </button>
            <button>
              <Image src="/assets/icons/git.png" alt="GitHub" width={20} height={20} />
              Sign up with GitHub
            </button>
            <button>
              <Image src="/assets/icons/linkd.png" alt="LinkedIn" width={20} height={20} />
              Sign up with Linkedin
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Have an account?{' '}
            <a href="/login" className="font-semibold hover:underline text-black">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
