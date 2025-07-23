'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BiLeftArrow } from 'react-icons/bi';
import './page.css';
import Link from 'next/link';
// import PasswordStrengthBar from 'react-password-strength-bar';

export default function SignUpPage() {
  
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted]     = useState(false);
  const [consented, setConsented]     = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const passwordRules = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  
  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const isPasswordMatch = password === confirmPassword;
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(regex.test(val) ? '' : 'Please enter a valid email');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isPasswordMatch) {
      setError('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms');
      return;
    }
    if (emailError) return setError('Please fix your email address');

    setLoading(true);

    try {
      const response = await fetch('https://form-vive-server.onrender.com/api/v1/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, termsAccepted, consented, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Sign up failed');
      } else {
        setSuccess(data.message || 'Sign up successful!');
        localStorage.setItem('token', data.token);
        const redirectUrl = `/auth/verify-email?token=${data.token}&email=${encodeURIComponent(data.email)}`;
        router.push(redirectUrl);
        
        // Clear form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTermsAccepted(false);
        setConsented(false);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  // Lazy-load zxcvbn only when password changes
  useEffect(() => {
    if (!password) {
      setPasswordScore(0);
      setPasswordFeedback([]);
      return;
    }
  
    const evaluatePassword = async () => {
      const zxcvbn = (await import('zxcvbn')).default;
      const result = zxcvbn(password);
      setPasswordScore(result.score);
      setPasswordFeedback(result.feedback.suggestions || []);
    };
  
    evaluatePassword();
  }, [password]);
  const hidePasswordHints = password === '' || (passwordScore >= 4 && isPasswordMatch);
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-white w-full">
      <div className="signUpPage">
      <div className="Navbar">
        <div className="left">
          <button onClick={() => router.back()}><BiLeftArrow size={40} /></button>
        </div>
        <Link href={'/'}><h1 className="title">Formvive</h1></Link>
        <div className="right">{/* Empty space to balance layout */}</div>
      </div>
          
        <div className="signUpBlock">
          <h2 className="font-medium">Create your account and get started</h2>
          <form className="signUpForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label>First Name</label>
              <input
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                name="firstname"
                autoComplete="firstname"
                className="border border-gray-300 rounded"
              />
            </div>

            <div className="inputGroup">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                name="last-name"
                autoComplete='last-name'
                className="border border-gray-300 rounded"
              />
            </div>

            <div className="inputGroup">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                name='email'
                autoComplete="email"
                className="border border-gray-300 rounded"
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>
            <div className='passwordBlock'>
              <div className="passwordRow">
                <label>Password</label>
                <div className="password">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name='password'
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    <Image src='/assets/icons/eye.svg' alt="reveal password button" width={20} height={15}/>
                  </button>
                </div>
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className={`h-2 rounded transition-all duration-300 ${
                        passwordScore === 0 ? 'w-1/5 bg-red-500' :
                        passwordScore === 1 ? 'w-2/5 bg-orange-500' :
                        passwordScore === 2 ? 'w-3/5 bg-yellow-500' :
                        passwordScore === 3 ? 'w-4/5 bg-blue-500' :
                        'w-full bg-green-600'
                      }`}
                    ></div>
                  </div>
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
                    name='confirm-password'
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    <Image src='/assets/icons/eye.svg' alt="reveal password button" width={20} height={15}/>
                  </button>
                </div>
                {!isPasswordMatch && confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 ml-1">Passwords do not match</p>
                )}
              </div>
            </div>
            {!hidePasswordHints && (
              <>
                <ul className="text-xs mt-2 ml-1 space-y-1 text-gray-600 grid justify-items-start grid-cols-2">
                  <li className={passwordRules.length ? 'text-green-600' : ''}>• At least 6 characters</li>
                  <li className={passwordRules.upper ? 'text-green-600' : ''}>• At least one uppercase letter</li>
                  <li className={passwordRules.lower ? 'text-green-600' : ''}>• At least one lowercase letter</li>
                  <li className={passwordRules.number ? 'text-green-600' : ''}>• At least one number</li>
                </ul>

                <div className="text-xs text-gray-600 mt-1">
                  {passwordFeedback.length > 0
                    ? passwordFeedback.map((msg, i) => (
                        <p key={i} className="text-red-500">• {msg}</p>
                      ))
                    : <p className="text-green-600">Your password looks good!</p>}
                </div>
              </>
            )}

            <div className="flex items-center text-sm mt-4 termsCheckbox">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="rounded border-gray-300 w-4 h-4 md:w-6 md:h-6"
              />
              <span className="ml-2">I agree to the Terms and Privacy Policy</span>
            </div>
            <div className="flex items-center text-sm mt-4 termsCheckbox">
              <input
                type="checkbox"
                checked={consented}
                onChange={(e) => setConsented(e.target.checked)}
                className="rounded border-gray-300 w-4 h-4 md:w-6 md:h-6"
              />
              <span className="ml-2">I consent to be contacted for marketing purposes, perks and offers by Formvive.com</span>
            </div>

            <button
              type="submit"
              className="signUpBtn mt-4"
              disabled={loading || !isPasswordValid}
            >
              {loading ? 'Signing up...' : 'Get started'}
            </button>
          </form>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

          <div className="signUpBtns mt-4">
            <button>
              <Image src="/assets/icons/goog.png" alt="Google" width={20} height={20} />
              Get started with Google
            </button>
            {/* <button>
              <Image src="/assets/icons/git.png" alt="GitHub" width={20} height={20} />
              Sign up with GitHub
            </button>
            <button>
              <Image src="/assets/icons/linkd.png" alt="LinkedIn" width={20} height={20} />
              Sign up with LinkedIn
            </button> */}
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
