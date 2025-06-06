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
        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors duration-200"
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
          <div className="absolute right-0 z-20 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`${
                    currentLanguage === language.code
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  } group flex items-center w-full px-4 py-2 text-sm transition-colors duration-150`}
                >
                  <span className="mr-3 text-lg">{language.flag}</span>
                  <span className="flex-1 text-left">{language.name}</span>
                  {currentLanguage === language.code && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
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