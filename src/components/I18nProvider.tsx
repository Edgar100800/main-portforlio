import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        // Detect language from URL or localStorage
        const pathLanguage = window.location.pathname.startsWith('/en') ? 'en' : 'es';
        const storedLanguage = localStorage.getItem('language');
        const languageToUse = storedLanguage || pathLanguage;

        // Change language if necessary
        if (i18n.language !== languageToUse) {
          await i18n.changeLanguage(languageToUse);
        }

        setIsReady(true);
      } catch (error) {
        console.error('Error initializing i18n:', error);
        setIsReady(true); // Still show content even if translation fails
      }
    };

    initializeI18n();
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};

export default I18nProvider;