import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  className?: string;
  basePath?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '', basePath = '' }) => {
  const { t } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const homeHref = basePath || '/';
  const linksHref = `${basePath}/links` || '/links';

  return (
    <header className={`liquid-glass fixed top-0 left-0 right-0 z-50 rounded-none border-x-0 border-t-0 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <a 
              href={homeHref}
              className="text-white text-lg sm:text-xl font-semibold tracking-tight hover:text-blue-200 transition-colors duration-200"
            >
              Edgar Chambilla
            </a>
          </div>

          {/* Navigation & Language Selector */}
          <div className="flex items-center gap-3 sm:gap-4">
            <nav className="hidden md:flex items-center gap-6" aria-label={t('header.navigation')}>
              <a 
                href={`${homeHref}#projects`}
                className="text-sm text-white/85 hover:text-white transition-colors duration-200"
              >
                {t('nav.projects')}
              </a>
              <a
                href="/blog"
                className="text-sm text-white/85 hover:text-white transition-colors duration-200"
              >
                {t('nav.blog')}
              </a>
              <a 
                href={linksHref}
                className="text-sm text-white/85 hover:text-white transition-colors duration-200"
              >
                {t('nav.links')}
              </a>
            </nav>

            {/* Language Selector */}
            <LanguageSelector />

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/20 bg-transparent text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:hidden"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav id="mobile-navigation" className="mt-3 border-t border-white/10 p-2 md:hidden" aria-label={t('header.navigation')}>
            <div className="flex flex-col gap-1">
              <a href={`${homeHref}#projects`} onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-3 text-white/90 transition-colors hover:bg-white/10">
                {t('nav.projects')}
              </a>
              <a href="/blog" onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-3 text-white/90 transition-colors hover:bg-white/10">
                {t('nav.blog')}
              </a>
              <a href={linksHref} onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-3 text-white/90 transition-colors hover:bg-white/10">
                {t('nav.links')}
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
