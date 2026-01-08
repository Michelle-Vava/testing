import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Login } from './Login';
import { Signup } from './Signup';

type AuthMode = 'login' | 'signup';

export function AuthContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const search = (location.search as any) || {};
  
  const isSignup = location.pathname.includes('/signup');
  const mode: AuthMode = isSignup ? 'signup' : 'login';
  const userMode = search.mode || 'owner'; // default to owner

  const handleSwitchToSignup = () => {
    navigate({ to: '/auth/signup', search: { mode: userMode } });
  };

  const handleSwitchToLogin = () => {
    navigate({ to: '/auth/login', search: { mode: userMode } });
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-[520px]">
          
          {/* Animated single panel for all screen sizes */}
          <AnimatePresence mode="wait" custom={mode === 'signup' ? 1 : -1}>
            {mode === 'login' ? (
              <motion.div
                key="login"
                custom={-1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Login onSwitchToSignup={handleSwitchToSignup} />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Signup onSwitchToLogin={handleSwitchToLogin} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
