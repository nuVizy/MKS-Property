import React from 'react';

import { OptimizedImage } from '@/components/ui/optimized-image';

const Services: React.FC = () => {
  const servicePillars = [
    'Owner-first planning',
    'Guest-ready presentation',
    'Transparent coordination',
  ];

  const services = [
    {
      number: '01',
      title: 'Reservations & Hosting',
      description:
        'Seamless management of booking platforms. We handle all guest communications, inquiries, and logistics, ensuring high occupancy rates and 5-star reviews.',
    },
    {
      number: '02',
      title: 'Cleaning & Preparation',
      description:
        'Rigorous cleaning standards. Every clean is inspected before arrival to ensure the property is immaculate. Includes laundry, linen management, and welcome packs.',
    },
    {
      number: '03',
      title: 'Property Management',
      description:
        'Proactive maintenance and transparent communication. We act as the intermediate for payments and services, ensuring your investment remains in pristine condition.',
    },
    {
      number: '04',
      title: 'Structure & Logistics',
      description:
        'All cleaning takes place before new guests arrive. Welcome packs are provided via a petty cash fund agreed upon with the owner.',
    },
  ];

  return (
    <div className="page-shell bg-white">
      <div className="site-frame page-header fade-in-up">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] xl:items-end">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-serif mb-10 text-brand-charcoal leading-none">
              Comprehensive <br />
              <span className="italic text-brand-charcoal/55">Solutions</span>
            </h1>
            <p className="font-light text-brand-charcoal/72 text-lg leading-relaxed max-w-2xl">
              We offer a full suite of boutique services tailored to elevate your property&apos;s
              potential, ensure immaculate presentation, and deliver unforgettable guest
              experiences.
            </p>
          </div>

          <aside className="border border-brand-charcoal/10 bg-white p-8 md:p-10">
            <div className="space-y-4">
              {servicePillars.map((pillar) => (
                <div key={pillar} className="border-t border-brand-charcoal/10 pt-5 first:border-t-0 first:pt-0">
                  <p className="text-base font-light text-brand-charcoal">{pillar}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div className="page-stack">
        <section className="site-frame pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-14 md:gap-20 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-serif text-brand-charcoal leading-tight mb-8">
                Accessorising & Design
              </h2>
              <div className="w-16 h-[1px] bg-brand-gold/70 mb-8"></div>
              <p className="font-light text-brand-charcoal/72 leading-loose mb-10">
                Understanding the owner&apos;s needs is the cornerstone of the design process. By
                listening closely to your vision and priorities, we translate your ideas into a
                finished space that feels both functional and elevated.
              </p>
              <ul className="grid gap-4 sm:grid-cols-3">
                {['Personalized Consultation', 'Functional Styling', 'Lifestyle Integration'].map((item) => (
                  <li
                    key={item}
                    className="border-t border-brand-charcoal/10 pt-4 text-sm font-light text-brand-charcoal/72 uppercase tracking-[0.18em]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-1 lg:order-2 relative pl-0 md:pl-8">
              <div className="absolute -inset-4 bg-brand-charcoal/8 z-0 transform translate-x-4 translate-y-4"></div>
              <OptimizedImage
                src="https://picsum.photos/id/48/800/1000"
                alt="Interior Design"
                width={800}
                height={1000}
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="w-full h-[460px] md:h-[620px] object-cover relative z-10 shadow-[0_24px_60px_rgba(6,63,71,0.12)]"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="site-frame">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end mb-16 md:mb-20">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-7">
                  Operational care with a boutique standard.
                </h2>
                <p className="font-light text-brand-charcoal/72 leading-relaxed text-lg">
                  A cleaner, more structured overview of the services shaping day-to-day property
                  performance and guest experience.
                </p>
              </div>

              <div className="border-t border-brand-charcoal/10 pt-6">
                <p className="font-light text-brand-charcoal/72 leading-relaxed">
                  Structured support, clear communication, and a presentation standard that feels
                  boutique from check-in to turnover.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="group bg-white border border-brand-charcoal/10 p-8 md:p-10 lg:p-12 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(6,63,71,0.08)] hover:border-brand-gold/25"
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-end justify-between gap-6 mb-12">
                      <span className="text-[11px] tracking-[0.35em] uppercase text-brand-charcoal/45 font-medium">
                        Service {service.number}
                      </span>
                      <div className="w-16 h-[1px] bg-brand-gold/60 group-hover:w-24 transition-all duration-500"></div>
                    </div>

                    <h3 className="text-3xl md:text-[2rem] leading-tight font-serif text-brand-charcoal mb-6">
                      {service.title}
                    </h3>

                    <p className="font-light text-brand-charcoal/72 leading-loose text-[15px]">
                      {service.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
