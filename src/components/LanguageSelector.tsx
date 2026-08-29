import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const languages = [
    { code: 'es', name: t('header.spanish'), flag: '🇪🇸' },
    { code: 'en', name: t('header.english'), flag: '🇺🇸' }
  ];

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      setIsOpen(false);
      
      // Store the selected language in localStorage
      localStorage.setItem('language', languageCode);
      
      // Update the URL to reflect the language change
      const currentPath = window.location.pathname;
      const pathWithoutLang = currentPath.replace(/^\/(es|en)/, '');
      const newPath = languageCode === 'es' ? pathWithoutLang || '/' : `/${languageCode}${pathWithoutLang || '/'}`;
      
      window.history.pushState(null, '', newPath);
      window.location.reload();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 mr-2" />
        <span className="mr-1">{getCurrentLanguage().flag}</span>
        <span className="mr-2">{getCurrentLanguage().name}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="liquid-glass absolute right-0 z-20 mt-2 w-48 origin-top-right divide-y divide-white/10 rounded-md text-white shadow-lg focus:outline-none">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`${
                    currentLanguage === language.code
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  } group flex items-center w-full px-4 py-2 text-sm transition-colors duration-150`}
                >
                  <span className="mr-3 text-lg">{language.flag}</span>
                  <span className="flex-1 text-left">{language.name}</span>
                  {currentLanguage === language.code && (
                    <div className="ml-2 h-2 w-2 rounded-full bg-cyan-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
