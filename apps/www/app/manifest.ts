import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ora UI',
    short_name: 'Ora UI',
    icons: [
      { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { src: '/icon-mask.png', type: 'image/png', sizes: '512x512', purpose: 'maskable' },
      { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    theme_color: '#111111',
    background_color: '#111111',
    display: 'standalone',
  };
}
