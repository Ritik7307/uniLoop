import Link from "next/link";
import { Mail, Globe } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-transparent py-12 md:py-16 border-t border-[var(--color-uniloop-text)]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6 mb-10 md:mb-12">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <img src="/images/logo.png" alt="UniLoop Logo" className="h-12 md:h-16 w-auto object-contain" />
            <div className="text-sm font-medium text-[var(--color-uniloop-secondary)] md:pl-2">Built for RGIPT students.</div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-semibold text-[var(--color-uniloop-secondary)]">
            <Link href="#marketplace" className="hover:text-[var(--color-uniloop-text)] transition-colors">Marketplace</Link>
            <Link href="#lost-found" className="hover:text-[var(--color-uniloop-text)] transition-colors">Lost & Found</Link>
            <Link href="#how-it-works" className="hover:text-[var(--color-uniloop-text)] transition-colors">How It Works</Link>
            <Link href="#about" className="hover:text-[var(--color-uniloop-text)] transition-colors">About</Link>
            <Link href="mailto:support@uniloop.com" className="hover:text-[var(--color-uniloop-text)] transition-colors">Contact</Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--color-uniloop-text)]/10 text-sm font-medium text-[var(--color-uniloop-secondary)]">
          <p>© {new Date().getFullYear()} UniLoop. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <Link href="https://uniloop.com" className="hover:text-[var(--color-uniloop-text)] transition-colors">
              <Globe size={20} />
            </Link>
            <Link href="mailto:support@uniloop.com" className="hover:text-[var(--color-uniloop-text)] transition-colors">
              <Mail size={20} />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
