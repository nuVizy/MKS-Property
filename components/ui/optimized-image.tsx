import * as React from 'react';

import { cn } from '@/lib/utils';

export type OptimizedImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  priority?: boolean;
};

export function OptimizedImage({
  alt,
  className,
  decoding,
  fetchPriority,
  loading,
  priority = false,
  sizes,
  ...props
}: OptimizedImageProps) {
  return (
    <img
      alt={alt}
      className={cn(className)}
      decoding={decoding ?? (priority ? 'sync' : 'async')}
      fetchPriority={fetchPriority ?? (priority ? 'high' : 'auto')}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      sizes={sizes ?? '100vw'}
      {...props}
    />
  );
}
