import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
];

// TODO(csp): CSP com nonce via proxy.ts na Fase 12. Sem nonce só sairia uma política com
// `unsafe-inline`, que o Next exige para os scripts de hidratação — não vale o falso conforto.
const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    // A API recusa upload acima de 10 MB. A folga cobre o overhead do envelope multipart:
    // estourar o limite aqui trunca o corpo em silêncio, em vez de devolver erro.
    proxyClientMaxBodySize: '12mb',
  },

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
