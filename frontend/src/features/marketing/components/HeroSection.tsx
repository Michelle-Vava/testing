import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            <span className="text-yellow-500 text-sm font-medium">Now Live in Halifax</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Stop Overpaying for Car Repairs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto"
          >
            Get transparent, competing quotes from verified providers. Compare prices, reviews, and availability — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/auth/signup" search={{ mode: 'owner' }} onClick={() => sessionStorage.setItem('landingPage', '/')}>
              <Button
                size="lg"
                className="text-lg px-8 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold shadow-xl shadow-yellow-500/20"
              >
                <motion.span
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="inline-block"
                >
                  Get Free Quotes →
                </motion.span>
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-lg px-8 border-slate-600 text-white hover:bg-slate-800">
                Learn More
              </Button>
            </Link>
          </motion.div>

          <p className="mt-6 text-sm text-slate-400">
            ✓ No spam calls &nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp; ✓ Compare up to 5 quotes
          </p>
        </div>
      </div>
    </section>
  );
}
