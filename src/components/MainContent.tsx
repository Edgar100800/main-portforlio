import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileImage } from '@/components/ProfileImage';
import { socialLinks as rawSocialLinks } from '@/lib/links-data.ts';
import { Instagram, Linkedin, Github } from 'lucide-react';
import ProjectsSection from '@/components/ProjectsSection';

const MainContent: React.FC = () => {
  const { t } = useTranslation('common');

  // Find social links dynamically
  const linkedinLink = rawSocialLinks.find(link => link.icon === 'linkedin');
  const githubLink = rawSocialLinks.find(link => link.icon === 'github');
  const instagramLink = rawSocialLinks.find(link => link.icon === 'instagram');

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
      {/* Profile Section */}
      <section className="grid items-center gap-10 md:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)] md:gap-14 lg:gap-20" aria-labelledby="intro-title">
        {/* Mobile: Image on top, Desktop: Image on left */}
        <div className="hero-entrance-visual w-full">
          <ProfileImage 
            src="/profile.webp" 
            alt="Edgar Chambilla" 
            className="mx-auto aspect-square w-full max-w-[440px]"
          />
        </div>
        
        {/* Content */}
        <div className="hero-entrance-copy w-full text-white">
          <div className="mb-7">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-blue-100/80">{t('home.greeting')}</p>
            <h1 id="intro-title" className="max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:text-7xl">{t('home.name')}</h1>
            <p className="mt-5 max-w-2xl text-2xl font-medium leading-tight text-fuchsia-100 sm:text-3xl lg:text-4xl">
              {t('home.role')}
            </p>
          </div>
          
          <div className="mb-8 max-w-2xl space-y-3">
            <p 
              className="text-lg leading-relaxed text-white/95 sm:text-xl"
              dangerouslySetInnerHTML={{ __html: t('home.description') }}
            />
            <p className="text-base leading-relaxed text-blue-50/80 sm:text-lg">
              {t('home.additional')}
            </p>
          </div>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
              <a href="#projects" className="inline-flex min-h-11 items-center justify-center rounded-md bg-white px-5 py-3 font-semibold text-indigo-950 transition-all hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900">
              {t('home.buttons.projects')}
            </a>
            {linkedinLink && (
              <a href={linkedinLink.href} target="_blank" rel="noopener noreferrer" className="liquid-glass inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {t('home.buttons.contact')}
              </a>
            )}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4" aria-label={t('home.socialLinks')}>
            {linkedinLink && (
              <a 
                href={linkedinLink.href}
                aria-label="LinkedIn"
                className="liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-full text-white/85 transition-all hover:-translate-y-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {githubLink && (
              <a 
                href={githubLink.href} 
                aria-label="GitHub"
                className="liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-full text-white/85 transition-all hover:-translate-y-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {instagramLink && (
              <a 
                href={instagramLink.href} 
                aria-label="Instagram"
                className="liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-full text-white/85 transition-all hover:-translate-y-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </section>
      <ProjectsSection />
    </div>
  );
};

export default MainContent;
