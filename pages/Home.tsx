import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background Image Parallax-ish */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-[-1.75rem] scale-[1.04] bg-cover bg-center blur-[3px]"
            style={{ backgroundImage: "url('/pexels-the-ghazi-2152398165-33314763.jpg')" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_36%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/62 via-black/28 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/44 to-black/34" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 text-center text-white drop-shadow-[0_14px_36px_rgba(0,0,0,0.32)] sm:py-20 lg:py-24 fade-in-up">
          <div className="mb-8 inline-flex items-center justify-center space-x-3 opacity-90">
            <div className="h-[1px] w-8 bg-brand-gold"></div>
            <p className="text-xs md:text-sm tracking-[0.4em] uppercase font-light">Paphos • Cyprus</p>
            <div className="h-[1px] w-8 bg-brand-gold"></div>
          </div>
          
          <h1 className="mb-10 text-[3.35rem] font-serif font-thin leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Elevating <span className="italic font-normal text-white">Living</span> <br /> 
            Spaces & Experiences
          </h1>
          
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6">
            <Button asChild size="xl" variant="primary" className="min-w-[13rem]">
              <Link to="/about">
                <span className="text-xs tracking-widest-plus uppercase font-medium text-white">
                  Meet Mikaela
                </span>
              </Link>
            </Button>
            <Button asChild size="xl" variant="inverse" className="min-w-[13rem]">
              <Link to="/services">
                <span className="text-xs tracking-widest-plus uppercase font-medium text-white">
                  Our Services
                </span>
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-60 sm:bottom-10">
            <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>
      </section>

      {/* Introduction Snippet */}
      <section className="bg-white py-20 md:py-28">
        <div className="site-frame max-w-4xl text-center">
          <div className="fade-in-delayed">
            <h2 className="text-3xl md:text-5xl font-serif leading-tight text-brand-charcoal mb-10 font-light">
              "The goal is to create seamless, stress-free management experiences, ensuring your property is always in the best hands."
            </h2>
            <div className="w-px h-16 bg-brand-charcoal/20 mx-auto mb-10"></div>
            <p className="font-light text-brand-charcoal/72 leading-loose mb-12 max-w-2xl mx-auto text-sm md:text-base">
              Dedicated and experienced property management committed to excellence. With a strong background in managing diverse property portfolios, MKS brings a hands-on, detail-oriented approach to every project.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/services">
                <span className="text-xs font-medium uppercase tracking-widest-plus">
                  Explore Our Expertise
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Visual Service Showcase */}
      <section className="bg-white py-20 md:py-28">
          <div className="site-frame">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-8 md:auto-rows-fr">
                  
                  {/* Item 1 */}
                  <div className="md:col-span-4 relative group overflow-hidden cursor-pointer h-[360px] md:h-[620px]">
                      <div className="absolute inset-0 bg-brand-charcoal/20 group-hover:bg-brand-charcoal/38 transition-colors z-10 duration-500"></div>
                      <img src="https://images.pexels.com/photos/2995012/pexels-photo-2995012.jpeg" alt="Design" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                          <span className="text-white/80 text-[10px] uppercase tracking-widest mb-2 block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Service 01</span>
                          <h3 className="text-white text-3xl font-serif italic tracking-wide mb-2">Interior Design</h3>
                          <div className="w-0 group-hover:w-full h-[1px] bg-white/50 transition-all duration-700 ease-in-out"></div>
                      </div>
                  </div>

                  {/* Item 2 */}
                  <div className="md:col-span-4 relative group overflow-hidden cursor-pointer h-[360px] md:h-[620px] shadow-[0_24px_60px_rgba(6,63,71,0.12)]">
                       <div className="absolute inset-0 bg-brand-charcoal/20 group-hover:bg-brand-charcoal/38 transition-colors z-10 duration-500"></div>
                      <img src="/hands-typing-on-laptop.jpg" alt="Hands typing on a laptop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                          <span className="text-white/80 text-[10px] uppercase tracking-widest mb-2 block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Service 02</span>
                          <h3 className="text-white text-3xl font-serif italic tracking-wide mb-2">Reservations</h3>
                           <div className="w-0 group-hover:w-full h-[1px] bg-white/50 transition-all duration-700 ease-in-out"></div>
                      </div>
                  </div>

                  {/* Item 3 */}
                  <div className="md:col-span-4 relative group overflow-hidden cursor-pointer h-[360px] md:h-[620px]">
                       <div className="absolute inset-0 bg-brand-charcoal/20 group-hover:bg-brand-charcoal/38 transition-colors z-10 duration-500"></div>
                      <img src="/services1.png" alt="Premium care service" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                          <span className="text-white/80 text-[10px] uppercase tracking-widest mb-2 block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Service 03</span>
                          <h3 className="text-white text-3xl font-serif italic tracking-wide mb-2">Premium Care</h3>
                           <div className="w-0 group-hover:w-full h-[1px] bg-white/50 transition-all duration-700 ease-in-out"></div>
                      </div>
                  </div>

              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-charcoal text-white text-center py-20 md:py-24">
          <div className="site-frame">
              <Star className="mx-auto text-white mb-6" size={24} />
              <h2 className="text-4xl md:text-5xl font-serif mb-8">Ready to elevate your property?</h2>
              <Button asChild size="xl" variant="inverse">
                <Link to="/contact?source=home-bottom-cta">
                  <span className="text-xs uppercase tracking-widest-plus text-white">Begin Your Inquiry</span>
                </Link>
              </Button>
          </div>
      </section>
    </div>
  );
};

export default Home;
