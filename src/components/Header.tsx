import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { t } = useTranslation('common');

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/10 ${className}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <a 
              href="/" 
              className="text-white text-xl font-bold hover:text-blue-300 transition-colors duration-200"
            >
              Edgar Chambilla
            </a>
          </div>

          {/* Navigation & Language Selector */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <a 
                href="/" 
                className="text-white hover:text-blue-300 transition-colors duration-200"
              >
                {t('nav.home')}
              </a>
              <a 
                href="/links" 
                className="text-white hover:text-blue-300 transition-colors duration-200"
              >
                {t('nav.links')}
              </a>
            </nav>
            
            {/* Language Selector */}
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;