import React from 'react';

import { OptimizedImage } from '@/components/ui/optimized-image';

const About: React.FC = () => {
  return (
    <div className="page-shell fade-in pt-10 md:pt-14">
      <div className="site-frame">
        <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-12 md:gap-16 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="w-full">
            <OptimizedImage
              src="/kaela/mikaela.jpg"
              alt="Mikaela Founder"
              priority
              width={900}
              height={1200}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="w-full h-[460px] md:h-[620px] object-cover"
            />
          </div>

          {/* Text Side */}
          <div className="w-full max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-serif text-brand-charcoal mb-10 leading-tight">Mikaela, Founder & Manager</h1>

            <div className="space-y-6 text-brand-charcoal/72 font-light leading-relaxed">
              <p>
                I am a dedicated and experienced property manager committed to excellence. With a strong background in
                managing diverse property portfolios, I bring a hands-on, detail-oriented approach to every project.
              </p>
              <p>
                I pride myself on <span className="text-brand-charcoal font-medium">transparent communication</span>,
                proactive maintenance, and innovative solutions that maximize property value and enhance tenant satisfaction.
              </p>
              <p>
                My goal is to create seamless, stress-free management experiences, ensuring your property is always in the
                best hands. Whether dealing with complex logistics or fine-tuning the aesthetics of a space, my focus remains
                unwavering: perfection for the owner and the guest.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
