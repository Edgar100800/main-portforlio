import React from 'react';
import { useTranslation } from 'react-i18next';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { ProfileImage } from '@/components/ProfileImage';
import { profile, socialLinks as rawSocialLinks } from '@/lib/links-data.ts';
import { Instagram, Linkedin, Github } from 'lucide-react';
import ProjectsSection from '@/components/ProjectsSection';

const MainContent: React.FC = () => {
  const { t } = useTranslation('common');

  // Find social links dynamically
  const linkedinLink = rawSocialLinks.find(link => link.icon === 'linkedin');
  const githubLink = rawSocialLinks.find(link => link.icon === 'github');
  const instagramLink = rawSocialLinks.find(link => link.icon === 'instagram');

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
        {/* Mobile: Image on top, Desktop: Image on left */}
        <div className="w-full md:w-2/5">
          <ProfileImage 
            src="/profile.webp" 
            alt="Edgar Chambilla" 
            className="w-full aspect-square max-w-[500px] mx-auto"
          />
        </div>
        
        {/* Content */}
        <div className="w-full md:w-3/5 text-white">
          <div className="mb-6">
            <p className="text-xl mb-2">{t('home.greeting')}</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{t('home.name')}</h1>
            <SparklesText 
              colors={{ first: "#9E7AFF", second: "#FE8BBB" }}
              className="text-3xl md:text-5xl mb-6 text-fuchsia-200"
            >
              {t('home.role')}
            </SparklesText>
          </div>
          
          <div className="space-y-4 mb-8">
            <p 
              className="text-xl"
              dangerouslySetInnerHTML={{ __html: t('home.description') }}
            />
            <p className="text-lg">
              {t('home.additional')}
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex flex-col md:flex-row gap-4">
            {linkedinLink && (
              <a 
                href={linkedinLink.href}
                className="inline-flex items-center justify-center bg-black/20 hover:bg-black/30 text-white rounded-lg px-6 py-3 transition-colors w-full md:w-auto"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                {t('home.buttons.linkedin')}
              </a>
            )}
            {githubLink && (
              <a 
                href={githubLink.href} 
                className="inline-flex items-center justify-center bg-black/20 hover:bg-black/30 text-white rounded-lg px-6 py-3 transition-colors w-full md:w-auto"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 mr-2" />
                {t('home.buttons.github')}
              </a>
            )}
            {instagramLink && (
              <a 
                href={instagramLink.href} 
                className="inline-flex items-center justify-center bg-black/20 hover:bg-black/30 text-white rounded-lg px-6 py-3 transition-colors w-full md:w-auto"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-4 h-4 mr-2" />
                {t('home.buttons.instagram')}
              </a>
            )}
          </div>
        </div>
      </div>
      <ProjectsSection />
    </div>
  );
};

export default MainContent;