'use client';

import { useState } from 'react';
import Image from 'next/image';
import './page.css';
import { BiLeftArrow } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(regex.test(val) ? '' : 'Please enter a valid email');
    console.log(emailError);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const res = await fetch('https://form-vive-server.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      // console.log(data);
  
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      if (data.message?.toLowerCase().includes('verify')) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
  
      if (data?.data?.token) {
        localStorage.setItem('authToken', data.data.token);
        document.cookie = `authToken=${data.data.token}; path=/;`;
        router.push('/onboarding');
      } else {
        throw new Error('Token not received from server.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-white w-full">
      <div className="loginPage">
      <div className="Navbar">
        <div className="left">
          <button onClick={() => router.back()}><BiLeftArrow size={40} /></button>
        </div>
        <Link href={'/'}><h1 className="title">Formvive</h1></Link>
        <div className="right">{/* Empty space to balance layout */}</div>
      </div>
        <div className='loginBlock'>
            <h2 className="font-medium">Sign In</h2>
            <p className="text-center">Welcome Back</p>
            <form className="loginForm" onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    className="loginFormInput w-full px-3 py-2 border border-gray-300 rounded"
                />
                <div className="password">
                    <input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='loginFormInput'
                    />
                    <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                    <Image src='/assets/icons/eye.svg' alt="reveal password button" width={20} height={15}/>
                    </button>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 font-semibold text-white bg-black rounded"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300 w-max" />
                    <span>Keep me signed in</span>
                    </label>
                    <a href="#" className="hover:underline">
                    Forgot Password?
                    </a>
                </div>
            </form>
            <div className="signUpBtns">
            <button>
                <Image src="/assets/icons/goog.png" alt="Google" width={20} height={20} className="mr-2" />
                Sign up with Google
            </button>
            {/* <button>
                <Image src="/assets/icons/git.png" alt="GitHub" width={20} height={20} className="mr-2" />
                Sign up with GitHub
            </button>
            <button>
                <Image src="/assets/icons/linkd.png" alt="LinkedIn" width={20} height={20} className="mr-2" />
                Sign up with Linkedin
            </button> */}
            </div>
            <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{' '}
            <a href="/signup" className="font-semibold hover:underline text-black">
                Sign up
            </a>
            </p>
        </div>
      </div>
    </div>
  );
}