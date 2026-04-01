import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Video, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';

const Photography: React.FC = () => {
  const packages = [
    {
      title: "Apartment",
      subtitle: "1 - 2 Bed",
      price: "120",
      features: ["20-30 High Quality Edited Photos", "Professional Lighting", "Wide Angle Interior Shots"]
    },
    {
      title: "Maisonette",
      subtitle: "1 - 3 Bed",
      price: "150",
      features: ["30-45 High Quality Edited Photos", "Professional Lighting", "Interior & Exterior Details"]
    },
    {
      title: "House / Villa",
      subtitle: "3 - 4 Bed",
      price: "180",
      features: ["30-45 High Quality Edited Photos", "Full Property Coverage", "Landscape Integration"]
    }
  ];

  return (
    <div className="page-shell fade-in-up">
      <div className="site-frame">
        <div className="page-header text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-brand-charcoal mb-8">Professional Photography</h1>
          <div className="w-16 h-[1px] bg-brand-charcoal/20 mx-auto mb-8"></div>
          <p className="font-light text-brand-charcoal/72 max-w-xl mx-auto text-lg leading-relaxed">
            Capturing the essence of your property. High-quality visuals are the key to unlocking maximum booking potential.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <div key={index} className="group bg-white p-10 md:p-14 border border-brand-charcoal/10 hover:border-brand-gold/30 hover:shadow-[0_24px_60px_rgba(6,63,71,0.08)] transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              
              <Camera strokeWidth={1} className="text-brand-stone mb-6 group-hover:text-brand-gold transition-colors" size={36} />
              
              <h3 className="text-3xl font-serif text-brand-charcoal mb-2">{pkg.title}</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-charcoal/45 mb-10">{pkg.subtitle}</p>
              
              <div className="mb-10 relative">
                <span className="text-5xl font-serif text-brand-gold font-light">€{pkg.price}</span>
              </div>

              <ul className="space-y-6 mb-12 w-full">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="text-sm font-light text-brand-charcoal/72">
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                variant="secondary"
                className="mt-auto w-full"
              >
                <Link
                  to={`/contact?service=photography&package=${encodeURIComponent(pkg.title)}&source=photography-packages`}
                >
                  Book Now
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Extras Section */}
        <div className="max-w-5xl mx-auto bg-white border border-brand-charcoal/10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
            <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-4">
                    <Video className="text-brand-gold mr-4" size={28} strokeWidth={1} />
                    <h3 className="text-3xl font-serif text-brand-charcoal">Drone & Video Services</h3>
                </div>
                <p className="font-light text-brand-charcoal/72 mb-2 text-lg">Cinematic footage to showcase the surrounding area and property scale.</p>
                <p className="text-sm font-medium text-brand-charcoal tracking-wide uppercase mt-4">Price: TBD According to Request</p>
            </div>
             <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-brand-charcoal/20 pt-8 md:pt-0 md:pl-12 flex-shrink-0">
                 <div className="flex items-center justify-center md:justify-end mb-3 text-brand-charcoal/45">
                    <MapPin size={18} className="mr-2" />
                    <span className="text-[10px] uppercase tracking-widest">Location Policy</span>
                 </div>
                 <p className="font-light text-brand-charcoal/72 text-sm italic">
                    *Travel fees are applied for out of Paphos bookings*
                 </p>
                 <Button
                   asChild
                   size="lg"
                   variant="secondary"
                   className="mt-6"
                 >
                   <Link to="/contact?service=drone-video&source=photography-extras">
                     Ask About Drone/Video
                   </Link>
                 </Button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Photography;
