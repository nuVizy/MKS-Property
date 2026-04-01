import React from 'react';
import { Check } from 'lucide-react';

const Rates: React.FC = () => {
  return (
    <div className="page-shell fade-in-up bg-white">
      <div className="site-frame max-w-6xl">
        <div className="page-header text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-brand-charcoal mb-6">Rates</h1>
          <p className="font-light text-brand-charcoal/65 tracking-wide uppercase text-xs">Paphos Region Only • VAT included</p>
        </div>

        {/* Pricing List Style */}
        <div className="mb-20 md:mb-24">
            <div className="hidden md:grid grid-cols-4 gap-4 px-6 md:px-8 py-4 border-b border-brand-charcoal/10 text-xs uppercase tracking-widest text-brand-charcoal/45 font-medium mb-6">
                <div>Property Type</div>
                <div className="text-center">1-2 Guests</div>
                <div className="text-center">3-4 Guests</div>
                <div className="text-center">5-6 Guests</div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 md:px-8 py-8 md:py-10 border-b border-brand-charcoal/10 items-center hover:bg-brand-charcoal/[0.04] transition-colors">
                <div className="font-serif text-2xl text-brand-charcoal">1 Bed Apartment</div>
                <div className="flex justify-between md:justify-center items-center"><span className="md:hidden text-xs uppercase tracking-widest text-brand-charcoal/45">1-2 Guests</span> <span className="font-light text-lg text-brand-charcoal">€60</span></div>
                <div className="flex justify-between md:justify-center items-center"><span className="md:hidden text-xs uppercase tracking-widest text-brand-charcoal/45">3-4 Guests</span> <span className="font-light text-lg text-brand-charcoal">€75</span></div>
                <div className="flex justify-between md:justify-center items-center"><span className="md:hidden text-xs uppercase tracking-widest text-brand-charcoal/45">5-6 Guests</span> <span className="text-brand-charcoal/35 text-sm">N/A</span></div>
            </div>

            {/* Row 2 */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 md:px-8 py-8 md:py-10 border-b border-brand-charcoal/10 items-center hover:bg-brand-charcoal/[0.04] transition-colors">
                <div className="font-serif text-2xl text-brand-charcoal">2 Bed Apartment</div>
                <div className="flex justify-between md:justify-center items-center"><span className="md:hidden text-xs uppercase tracking-widest text-brand-charcoal/45">1-2 Guests</span> <span className="font-light text-lg text-brand-charcoal">€75</span></div>
                <div className="flex justify-between md:justify-center items-center"><span className="md:hidden text-xs uppercase tracking-widest text-brand-charcoal/45">3-4 Guests</span> <span className="font-light text-lg text-brand-charcoal">€85</span></div>
                <div className="flex justify-between md:justify-center items-center"><span className="md:hidden text-xs uppercase tracking-widest text-brand-charcoal/45">5-6 Guests</span> <span className="font-light text-lg text-brand-charcoal">€100</span></div>
            </div>

            {/* Row 3 */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 md:px-8 py-8 md:py-10 border-b border-brand-charcoal/10 items-center hover:bg-brand-charcoal/[0.04] transition-colors">
                <div className="font-serif text-2xl text-brand-charcoal">Maisonette <span className="text-sm font-sans font-light text-brand-charcoal/45 ml-2">(2/3 Bed)</span></div>
                <div className="flex justify-between md:justify-center items-center"><span className="md:hidden text-xs uppercase tracking-widest text-brand-charcoal/45">1-2 Guests</span> <span className="font-light text-lg text-brand-charcoal">€95</span></div>
                <div className="flex justify-between md:justify-center items-center"><span className="md:hidden text-xs uppercase tracking-widest text-brand-charcoal/45">3-4 Guests</span> <span className="font-light text-lg text-brand-charcoal">€105</span></div>
                <div className="flex justify-between md:justify-center items-center"><span className="md:hidden text-xs uppercase tracking-widest text-brand-charcoal/45">5-6 Guests</span> <span className="font-light text-lg text-brand-charcoal">€125</span></div>
            </div>

            {/* Row 4 */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 md:px-8 py-8 md:py-10 border-b border-brand-charcoal/10 items-center hover:bg-brand-charcoal/[0.04] transition-colors">
                <div className="font-serif text-2xl text-brand-charcoal">Villa</div>
                <div className="flex justify-between md:justify-center items-center"><span className="md:hidden text-xs uppercase tracking-widest text-brand-charcoal/45">1-2 Guests</span> <span className="font-light text-lg text-brand-charcoal">€115</span></div>
                <div className="flex justify-between md:justify-center items-center"><span className="md:hidden text-xs uppercase tracking-widest text-brand-charcoal/45">3-4 Guests</span> <span className="font-light text-lg text-brand-charcoal">€130</span></div>
                <div className="flex justify-between md:justify-center items-center"><span className="md:hidden text-xs uppercase tracking-widest text-brand-charcoal/45">5-6 Guests</span> <span className="font-light text-lg text-brand-charcoal">€155</span></div>
            </div>
        </div>

        {/* Additional Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <div>
                <h3 className="text-3xl font-serif text-brand-charcoal mb-8">Important Information</h3>
                <div className="space-y-6">
                    <div className="flex items-start">
                        <Check size={18} className="text-brand-gold mt-1 mr-4 flex-shrink-0" />
                        <div>
                             <strong className="text-sm font-medium uppercase tracking-wider block mb-1">Inclusions</strong>
                             <p className="font-light text-brand-charcoal/72 text-sm leading-relaxed">Pricing includes Laundry & Linen.</p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <Check size={18} className="text-brand-gold mt-1 mr-4 flex-shrink-0" />
                        <div>
                             <strong className="text-sm font-medium uppercase tracking-wider block mb-1">Payment Structure</strong>
                             <p className="font-light text-brand-charcoal/72 text-sm leading-relaxed">
                                 Regular cleaning prices are embedded into the online reservation offer. 
                                 The owner intermediates payments from guest to Mikaela.
                             </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Check size={18} className="text-brand-gold mt-1 mr-4 flex-shrink-0" />
                        <div>
                             <strong className="text-sm font-medium uppercase tracking-wider block mb-1">Extra Cleaning</strong>
                             <p className="font-light text-brand-charcoal/72 text-sm leading-relaxed">
                                Same rates as Regular Cleaning. Required by guests and paid directly to Mikaela.
                             </p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <Check size={18} className="text-brand-gold mt-1 mr-4 flex-shrink-0" />
                        <div>
                             <strong className="text-sm font-medium uppercase tracking-wider block mb-1">Linen & Towels</strong>
                             <p className="font-light text-brand-charcoal/72 text-sm leading-relaxed">
                                Linen set includes sheet, pillow-case, duvet cover. Towel set includes hand, bath, bathmats, tea, and pool towels.
                             </p>
                        </div>
                    </div>
                </div>
            </div>

             <div className="bg-white border border-brand-charcoal/10 p-12 h-full flex flex-col justify-center">
                <h3 className="text-3xl font-serif text-brand-charcoal mb-8">Optional Extras</h3>
                
                <div className="mb-8 border-l-2 border-brand-gold pl-6">
                    <h4 className="font-serif text-xl text-brand-charcoal mb-2">Deep Cleaning</h4>
                    <p className="font-light text-brand-charcoal/72 text-sm leading-relaxed">
                        Recommended every 6 months and/or after renovation. Prices quoted according to work-scope required by owners.
                    </p>
                </div>
                
                <div className="border-l-2 border-brand-charcoal/20 pl-6">
                    <h4 className="font-serif text-xl text-brand-charcoal mb-2">Mid-Stay Clean</h4>
                    <p className="font-light text-brand-charcoal/72 text-sm leading-relaxed">
                        Optional extra clean during guests' stay. Additional charge to the guest, paid directly to Mikaela.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Rates;
