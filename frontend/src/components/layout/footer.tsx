import { Link } from '@tanstack/react-router';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-[#CBD5E1] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#F5B700] rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <svg className="w-5 h-5 text-[#0F172A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#FFFFFF]">Service Connect</span>
            </div>
            <p className="text-sm text-[#94A3B8]">
              Transparent pricing for vehicle maintenance. Built for drivers, powered by verified mechanics.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-[#FFFFFF] font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/#how-it-works" className="hover:text-[#FFFFFF] transition-colors">How It Works</a></li>
              <li><Link to="/auth/signup" className="hover:text-[#FFFFFF] transition-colors">For Vehicle Owners</Link></li>
              <li><Link to="/auth/signup" className="hover:text-[#FFFFFF] transition-colors">For Service Providers</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[#FFFFFF] font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-[#FFFFFF] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#FFFFFF] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[#FFFFFF] font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="hover:text-[#FFFFFF] transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-[#FFFFFF] transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-[#FFFFFF] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#FFFFFF] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1E293B] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-[#94A3B8]">
            © {currentYear} Service Connect, Inc. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="https://twitter.com/serviceconnect" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#FFFFFF] transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://facebook.com/serviceconnect" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#FFFFFF] transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://linkedin.com/company/serviceconnect" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#FFFFFF] transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
