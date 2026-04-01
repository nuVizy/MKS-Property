import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Bath, BedDouble, Building2, MapPin, Star } from 'lucide-react';

interface PropertyIndexEntry {
  id: string;
  slug: string;
  imageCount: number;
  folder: string;
  sourceUrl?: string | null;
  title?: string;
  description?: string;
  listingName?: string | null;
  coverImageFilename?: string | null;
  propertyType?: string | null;
  location?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  rating?: number | null;
}

interface PropertyImage {
  filename: string;
  url: string;
}

interface PropertyMetadata {
  id: string;
  slug: string;
  sourceUrl?: string | null;
  imageCount: number;
  title?: string;
  description?: string;
  listingName?: string | null;
  coverImageFilename?: string | null;
  propertyType?: string | null;
  location?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  rating?: number | null;
  images: PropertyImage[];
}

interface PropertyCardData extends PropertyMetadata {
  coverImage: string;
  displayName: string;
  typeLabel: string;
  location: string;
  kicker: string;
  bedrooms: number | null;
  bathrooms: number | null;
  rating: number | null;
}

interface PropertySummaryFields {
  slug: string;
  title?: string;
  propertyType?: string | null;
  location?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  rating?: number | null;
}

const typeLabelMap: Record<string, string> = {
  'rental-unit': 'Apartment',
  townhouse: 'Townhouse',
  home: 'Home',
  villa: 'Villa',
};

const featuredPropertyOrder = [
  '1647039751747111667',
  '1652142126294309314',
  '1646228597064946481',
];

const featuredPropertyRank = new Map(featuredPropertyOrder.map((id, index) => [id, index]));

const titleCase = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const toTypeKey = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-');

const parsePropertyDetails = (property: PropertySummaryFields) => {
  const { slug, title: listingTitle, propertyType, location: storedLocation } = property;
  const segments = slug.split('-');
  const inIndex = segments.indexOf('in');
  const introMatch = listingTitle?.match(/^([^·]+?)\s+in\s+([^·]+)/i);
  const titleTypeKey = introMatch?.[1] ? toTypeKey(introMatch[1]) : null;
  const typeKey = (propertyType ? toTypeKey(propertyType) : null) || titleTypeKey || (inIndex > 0 ? segments.slice(0, inIndex).join('-') : 'rental-unit');
  const trailing = inIndex > -1 ? segments.slice(inIndex + 1) : segments;

  const statStart = trailing.findIndex(
    (segment) =>
      segment === 'new' ||
      /^\d+br$/.test(segment) ||
      /^\d+beds?$/.test(segment) ||
      /^\d+(?:-\d+)?bath$/.test(segment),
  );

  const locationSegments = statStart === -1 ? trailing : trailing.slice(0, statStart);
  const locationFromSlug = titleCase(locationSegments.join('-') || 'Paphos');
  const locationFromTitle = introMatch?.[2]?.trim() ?? null;
  const location = storedLocation || locationFromTitle || locationFromSlug;

  const bedroomsMatch = listingTitle?.match(/(\d+)\s+bedrooms?/i) || slug.match(/(\d+)br/);
  const bathroomsMatch = listingTitle?.match(/(\d+(?:\.\d+)?)\s+bathrooms?/i) || slug.match(/(\d+(?:-\d+)?)bath/);
  const ratingMatch = listingTitle?.match(/★(\d+(?:\.\d+)?)/i) || slug.match(/-(\d)-(\d{1,2})$/);

  const bedrooms =
    property.bedrooms !== null && property.bedrooms !== undefined
      ? property.bedrooms
      : bedroomsMatch
        ? Number(bedroomsMatch[1])
        : null;
  const bathrooms =
    property.bathrooms !== null && property.bathrooms !== undefined
      ? property.bathrooms
      : bathroomsMatch
        ? Number(bathroomsMatch[1].replace('-', '.'))
        : null;
  const rating =
    property.rating !== null && property.rating !== undefined
      ? property.rating
      : ratingMatch
        ? ratingMatch[0].includes('★')
          ? Number(ratingMatch[1])
          : Number(`${ratingMatch[1]}.${ratingMatch[2]}`)
        : null;
  const typeLabel = typeLabelMap[typeKey] || titleCase(typeKey);

  return {
    typeLabel,
    location,
    kicker: `${location} ${typeLabel}`,
    bedrooms,
    bathrooms,
    rating,
  };
};

const formatCount = (value: number | null, label: string) => {
  if (value === null) {
    return null;
  }
  return `${value} ${label}${value === 1 ? '' : 's'}`;
};

const formatBathrooms = (value: number | null) => {
  if (value === null) {
    return null;
  }
  return `${value} bath${value === 1 ? '' : 's'}`;
};

const toPublicUrl = (folder: string, filename: string) => {
  const normalized = folder.replace(/^public\//, '');
  return `/${normalized}/${filename}`;
};

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProperties = async () => {
      try {
        const response = await fetch('/airbnb/properties/index.json');
        if (!response.ok) {
          throw new Error('Failed to load properties index');
        }

        const index = (await response.json()) as PropertyIndexEntry[];
        const metadataList = await Promise.all(
          index.map(async (entry) => {
            let metadata: PropertyMetadata | null = null;

            if (!entry.sourceUrl) {
              try {
                const metadataResponse = await fetch(
                  `${entry.folder.replace(/^public/, '')}/metadata.json`,
                );

                if (metadataResponse.ok) {
                  metadata = (await metadataResponse.json()) as PropertyMetadata;
                }
              } catch {
                metadata = null;
              }
            }

            const summary = metadata ?? entry;
            const details = parsePropertyDetails(summary);
            const firstImage =
              summary.coverImageFilename ||
              entry.coverImageFilename ||
              metadata?.images[0]?.filename ||
              '01.jpeg';
            const listingName =
              metadata?.listingName?.trim() ||
              entry.listingName?.trim() ||
              entry.description?.trim() ||
              metadata?.description?.trim() ||
              entry.title?.trim() ||
              metadata?.title?.trim() ||
              details.kicker;

            return {
              ...entry,
              ...metadata,
              ...details,
              sourceUrl: entry.sourceUrl ?? metadata?.sourceUrl ?? null,
              displayName: listingName,
              coverImage: toPublicUrl(entry.folder, firstImage),
            };
          }),
        );

        metadataList.sort((a, b) => {
          const featuredRankA = featuredPropertyRank.get(a.id) ?? Number.POSITIVE_INFINITY;
          const featuredRankB = featuredPropertyRank.get(b.id) ?? Number.POSITIVE_INFINITY;
          if (featuredRankA !== featuredRankB) {
            return featuredRankA - featuredRankB;
          }

          const bedroomDelta = (b.bedrooms ?? 0) - (a.bedrooms ?? 0);
          if (bedroomDelta !== 0) {
            return bedroomDelta;
          }
          return b.imageCount - a.imageCount;
        });

        if (!cancelled) {
          setProperties(metadataList);
          setLoading(false);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(caughtError instanceof Error ? caughtError.message : 'Failed to load properties');
          setLoading(false);
        }
      }
    };

    loadProperties();

    return () => {
      cancelled = true;
    };
  }, []);

  const locationCount = new Set(properties.map((property) => property.location)).size;

  return (
    <div className="page-shell bg-white">
      <section className="site-frame page-header">
        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-10 items-end">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-serif text-brand-charcoal leading-none mb-8">
              Properties <span className="italic text-brand-charcoal/55">Under Management</span>
            </h1>
            <p className="font-light text-brand-charcoal/72 text-lg leading-relaxed max-w-2xl">
              A dedicated overview of the current managed portfolio, synced from Airbnb and stored locally. Each card keeps the existing MKS visual language while surfacing the live listing name, layout, and location.
            </p>
          </div>

          <div className="bg-white border border-brand-charcoal/10 px-8 py-10 md:px-10">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-brand-charcoal/45 mb-3">Properties</p>
                <p className="text-4xl font-serif text-brand-charcoal">{properties.length || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-brand-charcoal/45 mb-3">Locations</p>
                <p className="text-4xl font-serif text-brand-charcoal">{locationCount || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-frame">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white border border-brand-charcoal/10 overflow-hidden animate-pulse">
                <div className="h-72 bg-brand-charcoal/10"></div>
                <div className="p-8 space-y-4">
                  <div className="h-3 bg-brand-charcoal/10 w-1/3"></div>
                  <div className="h-8 bg-brand-charcoal/10 w-2/3"></div>
                  <div className="h-4 bg-brand-charcoal/10 w-full"></div>
                  <div className="h-4 bg-brand-charcoal/10 w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white border border-brand-charcoal/15 px-8 py-10 text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-charcoal/55 mb-4">Unable To Load</p>
            <p className="text-lg font-light text-brand-charcoal/72">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {properties.map((property) => {
              const specs = [
                formatCount(property.bedrooms, 'bedroom'),
                formatBathrooms(property.bathrooms),
              ].filter(Boolean);
              const isFeatured = featuredPropertyRank.has(property.id);

              return (
                <article
                  key={property.id}
                  className="group bg-white border border-brand-charcoal/10 overflow-hidden hover:border-brand-gold/30 hover:shadow-[0_24px_60px_rgba(6,63,71,0.08)] transition-all duration-500"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={property.coverImage}
                      alt={property.displayName}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/65 via-brand-charcoal/12 to-transparent"></div>

                    <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                      {isFeatured ? (
                        <span className="bg-brand-gold px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-white">
                          Recently Added
                        </span>
                      ) : null}
                      <span className="bg-white/90 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-brand-charcoal">
                        {property.typeLabel}
                      </span>
                      <span className="bg-brand-charcoal/80 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-white">
                        {property.location}
                      </span>
                    </div>

                    <div className="absolute left-6 right-6 bottom-6 flex items-end justify-between gap-6 text-white">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-white/75 mb-3 max-w-[18rem] leading-relaxed">
                          {property.kicker}
                        </p>
                        <h2 className="text-3xl font-serif leading-tight">{property.displayName}</h2>
                      </div>
                      {property.rating !== null ? (
                        <div className="flex items-center bg-white/15 backdrop-blur-sm px-3 py-2 text-sm">
                          <Star size={14} className="mr-2 text-brand-gold fill-brand-gold" />
                          {property.rating.toFixed(2)}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-light text-brand-charcoal/72 mb-6">
                      <span className="inline-flex items-center">
                        <MapPin size={16} className="mr-2 text-brand-gold" />
                        {property.location}
                      </span>
                      <span className="inline-flex items-center">
                        <Building2 size={16} className="mr-2 text-brand-gold" />
                        {property.typeLabel}
                      </span>
                    </div>

                    <p className="font-light text-brand-charcoal/72 leading-relaxed mb-8 min-h-[3rem]">
                      {specs.length ? specs.join(' • ') : 'Full property details are available on Airbnb.'}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <div className="border border-brand-charcoal/10 px-4 py-4 text-center">
                        <BedDouble size={16} className="mx-auto mb-3 text-brand-gold" />
                        <p className="text-[10px] uppercase tracking-[0.22em] text-brand-charcoal/45 mb-2">Bedrooms</p>
                        <p className="font-serif text-2xl text-brand-charcoal">{property.bedrooms ?? '—'}</p>
                      </div>
                      <div className="border border-brand-charcoal/10 px-4 py-4 text-center">
                        <Bath size={16} className="mx-auto mb-3 text-brand-gold" />
                        <p className="text-[10px] uppercase tracking-[0.22em] text-brand-charcoal/45 mb-2">Baths</p>
                        <p className="font-serif text-2xl text-brand-charcoal">{property.bathrooms ?? '—'}</p>
                      </div>
                    </div>

                    {property.sourceUrl ? (
                      <a
                        href={property.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs uppercase tracking-widest-plus border-b border-brand-gold pb-2 hover:text-brand-gold transition-colors"
                      >
                        Open Airbnb Listing
                        <ArrowUpRight size={14} className="ml-2" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center text-xs uppercase tracking-widest-plus text-brand-charcoal/55">
                        Airbnb link available on request
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Properties;
