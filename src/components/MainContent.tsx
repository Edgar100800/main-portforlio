import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ProfileImage } from '@/components/ProfileImage';
import { socialLinks as rawSocialLinks } from '@/lib/links-data.ts';
import { Instagram, Linkedin, Github } from 'lucide-react';
import ProjectsSection from '@/components/ProjectsSection';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { LetterReveal } from '@/components/magicui/letter-reveal';
import { WaveText } from '@/components/magicui/wave-text';
import InstagramReels from '@/components/InstagramReels';

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
            <p className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.16em] text-blue-100/80">
              <span className="hero-wave" aria-hidden="true">👋</span><WaveText text={t('home.greeting')} />
            </p>
            <h1 id="intro-title" className="max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
              <SparklesText><LetterReveal text={t('home.name')} /></SparklesText>
            </h1>
            <p className="hero-role mt-5 max-w-2xl text-2xl font-medium leading-tight text-white/90 sm:text-3xl lg:text-4xl">
              <Trans
                i18nKey="home.role"
                t={t}
                components={{ ai: <span className="voxel-word voxel-word-yellow" />, creative: <span className="voxel-word voxel-word-sky" /> }}
              />
            </p>
          </div>
          
          <div className="mb-8 max-w-2xl space-y-3">
            <p 
              className="hero-keywords text-lg leading-relaxed text-white/95 sm:text-xl"
              dangerouslySetInnerHTML={{ __html: t('home.description') }}
            />
            <p className="text-base leading-relaxed text-blue-50/80 sm:text-lg">
              {t('home.additional')}
            </p>
          </div>

          <div className="mb-8 flex overflow-visible flex-col gap-3 sm:flex-row">
              <a href="#projects" className="hero-glow-control hero-glow-action liquid-glass inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 font-semibold text-white ring-1 ring-white/15 transition-all hover:-translate-y-0.5 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {t('home.buttons.projects')}
            </a>
            {linkedinLink && (
              <a href={linkedinLink.href} target="_blank" rel="noopener noreferrer" className="hero-glow-control hero-glow-action liquid-glass inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {t('home.buttons.contact')}
              </a>
            )}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 overflow-visible" aria-label={t('home.socialLinks')}>
            {linkedinLink && (
              <a 
                href={linkedinLink.href}
                aria-label="LinkedIn"
                className="social-aura social-aura-linkedin hero-glow-control hero-glow-social liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-full text-white/85 transition-all hover:-translate-y-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
                className="social-aura social-aura-github hero-glow-control hero-glow-social liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-full text-white/85 transition-all hover:-translate-y-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
                className="social-aura social-aura-instagram hero-glow-control hero-glow-social liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-full text-white/85 transition-all hover:-translate-y-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
      <InstagramReels />
    </div>
  );
};

export default MainContent;
