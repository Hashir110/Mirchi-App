import React, { useState } from 'react';
import { Flame, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    onLogin();
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-charcoal-950 via-charcoal-900 to-charcoal-950 px-6 pt-12 pb-8">
      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-mirchi-500 to-mirchi-red rounded-2xl flex items-center justify-center shadow-lg shadow-mirchi-500/20 mb-4">
          <Flame className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gradient">Mirchi Point</h1>
        <p className="text-charcoal-400 text-sm mt-1">Taste the Fire</p>
      </div>

      {/* Toggle */}
      <div className="flex bg-charcoal-900 rounded-xl p-1 mb-8">
        <button
          onClick={() => setIsSignup(false)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            !isSignup
              ? 'bg-gradient-to-r from-mirchi-500 to-mirchi-600 text-white'
              : 'text-charcoal-400'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsSignup(true)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isSignup
              ? 'bg-gradient-to-r from-mirchi-500 to-mirchi-600 text-white'
              : 'text-charcoal-400'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {isSignup && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-500" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-12"
                required={isSignup}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-500" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-12"
              required
            />
          </div>

          {isSignup && (
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-500" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field pl-12"
                required={isSignup}
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary flex items-center justify-center gap-2 mt-6"
        >
          <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-center text-charcoal-500 text-sm mt-4">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className="text-mirchi-500 font-medium"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className="text-mirchi-500 font-medium"
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
