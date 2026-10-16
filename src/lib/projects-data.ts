export interface PortfolioProject {
  id: string;
  image: string;
  logo?: string;
  wideLogo?: boolean;
  /** Spans the full grid width as the gallery's lead piece. */
  featured?: boolean;
  tech: string[];
  demo?: string;
  github?: string;
}

// Private repositories stay private: a project can be explored without a code link.
export const projects: PortfolioProject[] = [
  { id: 'cubits', image: '/projects/cubits.webp', logo: '/projects/logos/cubits.svg', wideLogo: true, featured: true, tech: ['ESP32-S3', 'C++', 'Preact', 'WebAssembly'] },
  { id: 'partydeck', image: '/projects/partydeck.webp', logo: '/projects/logos/partydeck.png', tech: ['Next.js', 'Socket.IO', 'PostgreSQL'], demo: 'https://web-production-2f98f.up.railway.app/' },
  { id: 'particlewall', image: '/projects/particlewall.webp', logo: '/projects/logos/particlewall.png', tech: ['Swift', 'Metal', 'Rust', 'wgpu'], github: 'https://github.com/Edgar100800/live-wallpaper' },
  { id: 'creax', image: '/projects/creax.webp', logo: '/projects/logos/creax.svg', tech: ['Next.js', 'Drizzle', 'Gemini'], demo: 'https://ecommerce-rho-rosy-33.vercel.app/' },
  { id: 'xplora', image: '/projects/xplora.avif', logo: '/projects/logos/xplora.png', tech: ['TanStack Start', 'ElysiaJS', 'PostgreSQL'], demo: 'https://xplora.edgarchambilla.com/' },
  { id: 'photoguide', image: '/projects/photoguide.webp', logo: '/projects/logos/photoguide-ios.png', tech: ['SwiftUI', 'AVFoundation', 'Next.js'], demo: 'https://photoguide.click/' },
  { id: 'tunutri', image: '/projects/tunutri.avif', logo: '/projects/logos/tunutri.png', tech: [], demo: 'https://tunutri.app/' },
  { id: 'sinlimites', image: '/projects/sinlimites.webp', logo: '/projects/logos/sinlimites.png', tech: ['Astro', 'Cloudflare', 'PostgreSQL'], demo: 'https://sinlimites360.org.pe/' },
  { id: 'minimart', image: '/projects/minimart.webp', tech: ['React', 'Three.js', 'Zustand'], demo: 'https://minimart-lab.pages.dev/', github: 'https://github.com/Edgar100800/MarketGame' },
  { id: 'bebetter', image: '/projects/bebetter.avif', logo: '/projects/logos/bebetter.png', tech: [], demo: 'https://www.bebetter.lifestyle' },
  { id: 'asciiCamera', image: '/projects/ascii-camera.avif', tech: ['React', 'Canvas', 'Web APIs'], demo: '/ascii-camera' },
];
