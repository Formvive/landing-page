'use client';

import { useState } from 'react';
import Image from 'next/image';
import './page.css';

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="loginPage">
        <h1>Formvive</h1>
        <div className='loginBlock'>
            <h2 className="font-medium">Sign In</h2>
            <p className="text-center">Welcome Back</p>
            <form className="loginForm">
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <div className="password">
                    <input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Password"
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
                    className="w-full py-2 font-semibold text-white bg-black rounded"
                >
                    Login
                </button>
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
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
            <button>
                <Image src="/assets/icons/git.png" alt="GitHub" width={20} height={20} className="mr-2" />
                Sign up with GitHub
            </button>
            <button>
                <Image src="/assets/icons/linkd.png" alt="LinkedIn" width={20} height={20} className="mr-2" />
                Sign up with Linkedin
            </button>
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