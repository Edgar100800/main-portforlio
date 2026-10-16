import { Instagram, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { socialLinks } from '@/lib/links-data';
import data from '@/data/instagram-reels.json';

interface Reel {
  id: string;
  permalink: string;
  caption: string;
  timestamp: string;
  thumbnail: string;
}

const reels = data.reels as Reel[];
const profile = socialLinks.find((link) => link.icon === 'instagram');
const handle = profile ? `@${new URL(profile.href).pathname.replaceAll('/', '')}` : '';

/** Latest reels, synced into the repo by .github/workflows/sync-instagram.yml. */
export default function InstagramReels() {
  const { t, i18n } = useTranslation('common');
  if (reels.length === 0) return null;

  const date = new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <section id="reels" className="reels-section scroll-mt-24 pb-8 pt-20 text-white sm:pt-28" aria-labelledby="reels-title">
      <div className="mx-auto max-w-6xl">
        <div className="project-heading">
          <div>
            <h2 id="reels-title" className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">{t('reels.title')}</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-blue-50/85 sm:text-lg">{t('reels.subtitle')}</p>
          </div>
          {profile && <a className="project-glass-button liquid-glass reels-follow" href={profile.href} target="_blank" rel="noopener noreferrer">
            <Instagram size={17} aria-hidden="true" />{t('reels.follow', { handle })}
            <span className="sr-only"> {t('projects.newTab')}</span>
          </a>}
        </div>

        <ul className="reels-grid">
          {reels.map((reel) => {
            const caption = reel.caption.split('\n')[0] || t('reels.untitled');
            return (
              <li key={reel.id}>
                <a className="reel-card liquid-glass" href={reel.permalink} target="_blank" rel="noopener noreferrer">
                  <div className="reel-thumb">
                    <img src={reel.thumbnail} alt="" width="540" height="960" loading="lazy" decoding="async" />
                    <span className="reel-play liquid-glass" aria-hidden="true"><Play size={18} fill="currentColor" /></span>
                  </div>
                  <div className="reel-meta">
                    <p className="reel-caption">{caption}</p>
                    <time className="reel-date" dateTime={reel.timestamp}>{date.format(new Date(reel.timestamp))}</time>
                  </div>
                  <span className="sr-only"> {t('reels.watch')} {t('projects.newTab')}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
