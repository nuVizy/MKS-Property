import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Mail, Phone } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isHeroMode = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes is handled by onClick on links to avoid cascading renders

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Properties', path: '/properties' },
    { name: 'Rates', path: '/rates' },
    { name: 'Photography', path: '/photography' },
    { name: 'Contact', path: '/contact' },
  ];

  const leftNavLinks = navLinks.slice(0, 3);
  const rightNavLinks = navLinks.slice(3);
  const desktopLinkClass = `font-nav text-sm tracking-[0.16em] uppercase font-light leading-none transition-colors relative group py-1.5 ${
    isHeroMode
      ? 'text-white hover:text-white/80 drop-shadow-[0_2px_12px_rgba(6,63,71,0.35)]'
      : 'text-brand-charcoal hover:text-brand-charcoal/70'
  }`;
  const desktopContactClass = `inline-flex items-center justify-center border px-4 py-3 text-[10px] uppercase tracking-[0.24em] font-medium transition-colors ${
    isHeroMode
      ? 'border-white/40 text-white hover:border-white hover:bg-white hover:text-brand-charcoal'
      : location.pathname === '/contact'
        ? 'border-brand-charcoal bg-brand-charcoal text-white'
        : 'border-brand-charcoal/16 text-brand-charcoal hover:border-brand-charcoal hover:bg-brand-charcoal hover:text-white'
  }`;
  const mobileButtonClass = `lg:hidden z-50 focus:outline-none transition-colors ${
    isHeroMode ? 'text-white hover:text-white/80' : 'text-brand-charcoal hover:text-brand-charcoal/70'
  }`;

  return (
    <div className="flex flex-col min-h-screen font-sans text-brand-charcoal selection:bg-brand-gold selection:text-white">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
          isHeroMode
            ? 'bg-transparent py-2'
            : 'bg-white/95 backdrop-blur-md py-2 border-b border-brand-charcoal/10 shadow-[0_10px_40px_rgba(6,63,71,0.08)]'
        }`}
      >
        <div className="site-frame flex items-center justify-between md:block">
          <Link to="/" className="z-50 group lg:hidden" onClick={() => setIsMenuOpen(false)}>
            <img
              src="/MKS%20PM.png"
              alt="MKS Property Management"
              className={`w-auto transition-all duration-500 ${isHeroMode ? 'h-14' : 'h-11'}`}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 xl:gap-10">
            <div className="flex min-w-0 justify-end items-center gap-4 xl:gap-6">
              {leftNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={desktopLinkClass}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[1px] transition-all duration-300 ease-out ${isHeroMode ? 'bg-white/80' : 'bg-brand-gold'} ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              ))}
            </div>

            <Link to="/" className="z-50 group justify-self-center" onClick={() => setIsMenuOpen(false)}>
              <img
                src="/MKS%20PM.png"
                alt="MKS Property Management"
                className={`w-auto transition-all duration-500 ${isHeroMode ? 'h-28 xl:h-32' : 'h-16 xl:h-20'}`}
              />
            </Link>

            <div className="flex min-w-0 justify-start items-center gap-4 xl:gap-6">
              {rightNavLinks.map((link) => (
                link.path === '/contact' ? (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={desktopContactClass}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={desktopLinkClass}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 h-[1px] transition-all duration-300 ease-out ${isHeroMode ? 'bg-white/80' : 'bg-brand-gold'} ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={mobileButtonClass}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-white z-40 transform transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) flex items-center justify-center ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col space-y-10 text-center">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="font-nav text-[2.5rem] font-light tracking-[0.08em] leading-none text-brand-charcoal hover:text-brand-charcoal/70 transition-colors transform hover:translate-x-2 duration-300"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`flex-grow ${isHome ? '' : 'pt-24 md:pt-32'}`}>
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
