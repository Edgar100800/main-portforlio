import { ui, defaultLang } from './ui';

export const languages = {
  en: 'English',
  es: 'Español',
};

export const showDefaultLang = false;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
}

export function useTranslatedPath(lang: keyof typeof languages) {
  return function translatePath(path: string, l: string = lang) {
    return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`;
  };
}

export function useTranslations(lang: keyof typeof languages) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url).pathname;
  const parts = pathname?.split('/');
  const path = parts.pop() || parts.pop();

  if (path === undefined) {
    return '/';
  }

  const currentLang = getLangFromUrl(url);

  if (currentLang === defaultLang) {
    return path ? `/${path}` : '/';
  }

  return path ? `/${currentLang}/${path}` : `/${currentLang}`;
}

export function getStaticPaths() {
  return Object.keys(languages).map((lang) => ({
    params: { lang },
  }));
}