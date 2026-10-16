import { ArrowDown, ArrowUpRight, Github, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { projects } from '@/lib/projects-data';
import { ProjectDetails } from './ProjectDetails';
import { ParticleWallPreview } from './ParticleWallPreview';

export default function ProjectsSection() {
  const { t } = useTranslation('common');

  return (
    <section id="projects" className="project-section scroll-mt-24 pb-8 pt-24 text-white sm:pt-32" aria-labelledby="projects-title">
      <div className="mx-auto max-w-6xl">
        <div className="project-heading">
          <div>
            <h2 id="projects-title" className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">{t('projects.title')}</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-blue-50/85 sm:text-lg">{t('projects.subtitle')}</p>
          </div>
          <p className="project-explore-hint"><ArrowDown size={16} aria-hidden="true" />{t('projects.exploreHint')}</p>
        </div>

        <div className="project-grid">
          {projects.map((project) => {
            const key = `projects.${project.id}`;
            const highlights = t(`${key}.highlights`, { returnObjects: true }) as string[];

            return (
              <article key={project.id} className="project-card liquid-glass" aria-labelledby={`project-${project.id}`}>
                <div className={`project-preview project-preview-${project.id}`}>
                  <img src={project.image} alt={t('projects.preview', { title: t(`${key}.title`) })} width="1200" height="750" loading="lazy" decoding="async" />
                  {project.id === 'particlewall' && <ParticleWallPreview />}
                </div>

                <div className="project-card-content">
                  <div className="project-identity">
                    <div className="min-w-0">
                      <h3 id={`project-${project.id}`} className="project-name">{t(`${key}.title`)}</h3>
                      <p className="project-category">{t(`${key}.category`)}</p>
                    </div>
                    {project.logo && <img className={`project-logo${project.wideLogo ? ' project-logo-wide' : ''}`} src={project.logo} alt={t('projects.logo', { title: t(`${key}.title`) })} width={project.wideLogo ? 120 : 44} height={project.wideLogo ? 30 : 44} loading="lazy" />}
                  </div>

                  <p className="project-description">{t(`${key}.description`)}</p>

                  <ProjectDetails summary={<>
                      <span className="project-details-closed">{t('projects.learnMore')}</span>
                      <span className="project-details-open">{t('projects.showLess')}</span>
                      <span className="sr-only">: {t(`${key}.title`)}</span>
                      <Plus size={18} aria-hidden="true" />
                    </>}>
                    <div className="project-details-body">
                      <p className="project-details-lead">{t(`${key}.overview`)}</p>
                      <h4>{t('projects.insideProject')}</h4>
                      <ul>{highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                      {project.tech.length > 0 && <>
                        <h4>{t('projects.technologies')}</h4>
                        <ul className="project-tech" aria-label={t('projects.technologies')}>{project.tech.map((tech) => <li key={tech}>{tech}</li>)}</ul>
                      </>}
                      <p className="project-context">{t(`${key}.context`)}</p>
                    </div>
                  </ProjectDetails>

                  {(project.demo || project.github) && <div className="project-actions">
                    {project.demo && <a className="project-link project-glass-button liquid-glass" href={project.demo} target={project.demo.startsWith('https:') ? '_blank' : undefined} rel={project.demo.startsWith('https:') ? 'noopener noreferrer' : undefined}>
                      {t(`${key}.cta`)}<ArrowUpRight size={17} aria-hidden="true" />
                      <span className="sr-only">: {t(`${key}.title`)}</span>
                    </a>}
                    {project.github && <a className="project-code-link project-glass-button liquid-glass" href={project.github} target="_blank" rel="noopener noreferrer"><Github size={17} aria-hidden="true" />{t('projects.viewCode')}<span className="sr-only">: {t(`${key}.title`)}</span></a>}
                  </div>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
