import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Mail, Phone } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsMenuOpen(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Properties', path: '/properties' },
    { name: 'Photography', path: '/photography' },
    { name: 'Contact', path: '/contact' },
  ];

  const leftNavLinks = navLinks.slice(0, 3);
  const rightNavLinks = navLinks.slice(3);
  const desktopLinkClass =
    'font-nav text-sm tracking-[0.16em] uppercase font-light leading-none text-brand-gold transition-colors relative group py-1.5 hover:text-brand-gold/72';
  const mobileButtonClass = 'lg:hidden z-50 text-brand-gold transition-colors focus:outline-none hover:text-brand-gold/72';
  const desktopLogoClass = 'w-auto';
  const mobileLogoClass = 'w-auto';

  return (
    <div className="flex flex-col min-h-screen font-sans text-brand-charcoal selection:bg-brand-gold selection:text-white">
      {/* Navigation */}
      <nav
        className="fixed w-full z-50 border-b border-brand-charcoal/10 bg-white py-2.5 shadow-[0_10px_40px_rgba(6,63,71,0.08)]"
      >
        <div className="site-frame flex items-center justify-between gap-4 lg:block">
          <Link to="/" className="z-50 group lg:hidden" onClick={() => setIsMenuOpen(false)}>
            <img
              src="/MKS%20PM.png"
              alt="MKS Property Management"
              className={`${mobileLogoClass} h-[3.3rem] sm:h-[3.6rem]`}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-6 text-brand-gold xl:gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <div className="flex min-w-0 justify-end items-center gap-4 xl:gap-6">
              {leftNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={desktopLinkClass}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[1px] bg-brand-gold transition-all duration-300 ease-out ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              ))}
            </div>

            <Link to="/" className="z-50 group justify-self-center" onClick={() => setIsMenuOpen(false)}>
              <img
                src="/MKS%20PM.png"
                alt="MKS Property Management"
                className={`${desktopLogoClass} h-[4.8rem] xl:h-24`}
              />
            </Link>

            <div className="flex min-w-0 justify-start items-center gap-4 xl:gap-6">
              {rightNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={desktopLinkClass}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[1px] bg-brand-gold transition-all duration-300 ease-out ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={mobileButtonClass}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-500 ${
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-[2px]"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close navigation backdrop"
        />

        <aside
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`absolute inset-y-0 right-0 flex min-h-full w-full max-w-full flex-col overflow-y-auto bg-white px-7 pb-8 pt-24 shadow-[-24px_0_60px_rgba(6,63,71,0.14)] transition-transform duration-500 ease-out sm:w-[min(88vw,24rem)] sm:border-l sm:border-brand-charcoal/10 sm:px-8 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-charcoal/45">
              Navigation
            </p>
            <div className="mt-8 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`border-b border-brand-charcoal/10 py-4 font-nav text-[1.9rem] leading-none tracking-[0.06em] transition-colors sm:text-[2.2rem] ${
                    location.pathname === link.path
                      ? 'text-brand-gold'
                      : 'text-brand-charcoal hover:text-brand-gold'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-auto border-t border-brand-charcoal/10 pt-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-charcoal/45">Connect</p>
            <div className="mt-5 space-y-4 text-sm font-light text-brand-charcoal/78">
              <a
                href="mailto:mks.cyservices@gmail.com"
                className="flex items-center gap-3 transition-colors hover:text-brand-gold"
              >
                <Mail size={16} className="text-brand-charcoal/45" />
                mks.cyservices@gmail.com
              </a>
              <a
                href="tel:+35799156137"
                className="flex items-center gap-3 transition-colors hover:text-brand-gold"
              >
                <Phone size={16} className="text-brand-charcoal/45" />
                +357 99156137
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className={`flex-grow ${isHome ? '' : 'pt-24 sm:pt-28 lg:pt-32'}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-charcoal text-white border-t border-white/10 pt-16 pb-10 md:pt-20 md:pb-12">
        <div className="site-frame">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.25fr_0.95fr_0.9fr] md:gap-8">
            <div>
              <Link to="/" className="inline-block mb-8">
                <img
                  src="/MKS%20PM.png"
                  alt="MKS Property Management"
                  className="h-16 w-auto brightness-0 invert"
                />
              </Link>
              <p className="footer-muted font-light text-sm leading-loose max-w-md">
                Redefining property management in Paphos with a commitment to excellence, transparency, and boutique service. Your investment, elevated.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-widest-plus mb-8 text-white">Menu</h4>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
                {navLinks.map(link => (
                    <li key={link.name}>
                        <Link to={link.path} className="footer-muted text-sm font-light hover:text-white transition-colors flex items-center group">
                            <span className="w-0 group-hover:w-2 transition-all duration-300 overflow-hidden border-t border-white mr-0 group-hover:mr-2"></span>
                            {link.name}
                        </Link>
                    </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest-plus mb-8 text-white">Connect</h4>
              <div className="space-y-5">
                <a href="mailto:mks.cyservices@gmail.com" className="footer-muted flex items-center text-sm font-light hover:text-white transition-colors group">
                    <Mail size={16} className="mr-3 text-white group-hover:text-white transition-colors" />
                    mks.cyservices@gmail.com
                </a>
                <a href="tel:+35799156137" className="footer-muted flex items-center text-sm font-light hover:text-white transition-colors group">
                    <Phone size={16} className="mr-3 text-white group-hover:text-white transition-colors" />
                    +357 99156137
                </a>
                <div className="pt-3 flex items-center gap-4">
                    <span className="footer-muted text-[10px] uppercase tracking-[0.24em]">Social</span>
                    <span className="footer-muted inline-flex items-center">
                      <Instagram size={18} className="text-white mr-2" />
                      Available on request
                    </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-14 pt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="footer-legal text-[10px] tracking-[0.22em] uppercase text-center md:text-left">&copy; {new Date().getFullYear()} MKS Property Management</p>
            <div className="flex flex-col items-center gap-3 text-center md:flex-row md:gap-8 md:text-right">
                <span className="footer-legal text-[10px] tracking-[0.22em] uppercase">Privacy policy available on request</span>
                <span className="footer-legal text-[10px] tracking-[0.22em] uppercase">Terms shared before onboarding</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
