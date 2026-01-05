import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Login } from './Login';
import { Signup } from './Signup';

type AuthMode = 'login' | 'signup';

export function AuthContainer() {
  const [mode, setMode] = useState<AuthMode>('login');

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
                <Login onSwitchToSignup={() => setMode('signup')} />
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
                <Signup onSwitchToLogin={() => setMode('login')} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
