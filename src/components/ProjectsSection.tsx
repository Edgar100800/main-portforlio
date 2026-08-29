import { ShineBorder } from "@/components/magicui/shine-border";
import { Button } from "@/components/ui/button";
import { Github, Link, Youtube } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface Project {
  titleKey: string;
  descriptionKey: string;
  tech: string[];
  type: "web" | "github" | "youtube";
  link?: string;
  github?: string;
  youtube?: string;
  image: string;
}

const projects: Project[] = [
  {
    titleKey: "projects.asciiCamera.title",
    descriptionKey: "projects.asciiCamera.description",
    tech: ["Next.js", "Tailwind", "Shadcn"],
    type: "web",
    github: "https://github.com/edgarchambilla/ascii-camera",
    link: "https://www.edgarchambilla.com/ascii-camera",
    image: "/projects/ascii-camera.avif",
  },
  {
    titleKey: "projects.bebetter.title",
    descriptionKey: "projects.bebetter.description",
    tech: ["Next.js", "Tailwind", "Shadcn", "Supabase", "Vercel"],
    type: "web",
    link: "https://bebetter-sooty.vercel.app/",
    image: "/projects/bebetter.avif",
  },
  {
    titleKey: "projects.tunutri.title",
    descriptionKey: "projects.tunutri.description",
    tech: ["Next.js", "Tailwind", "Shadcn", "Supabase", "Vercel"],
    type: "web",
    link: "https://tunutri.app/",
    image: "/projects/tunutri.avif",
  },
  {
    titleKey: "projects.xplora.title",
    descriptionKey: "projects.xplora.description",
    tech: ["Next.js", "Tailwind", "Shadcn", "Supabase", "Vercel"],
    type: "web",
    link: "https://xplora.chat/",
    image: "/projects/xplora.avif",
  },
];

export default function ProjectsSection() {
  const { t } = useTranslation('common');

  return (
    <section id="projects" className="scroll-mt-24 px-0 pb-8 pt-24 text-white sm:pt-32" aria-labelledby="projects-title">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-3 sm:mb-14">
          <h2 id="projects-title" className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
            {t('projects.title')}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-blue-50/75 sm:text-lg">
            {t('projects.subtitle')}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.titleKey}
              className="liquid-glass group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1"
            >
              {index === 0 && (
                <ShineBorder
                  borderWidth={1}
                  duration={10}
                  shineColor={["#93c5fd", "#c4b5fd"]}
                  className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
              <div className="relative z-10 p-4 sm:p-6">
                <div className="mb-5 aspect-[16/10] overflow-hidden rounded-lg ring-1 ring-white/15">
                  <img
                    src={project.image}
                    alt={t('projects.preview', { title: t(project.titleKey) })}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-blue-100 sm:text-2xl">
                    {t(project.titleKey)}
                  </h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-blue-50/80 sm:text-base">
                    {t(project.descriptionKey)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/75 backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {project.type === "web" && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 border-white/20 bg-transparent text-white shadow-none hover:bg-white/10 hover:text-white focus-visible:ring-white/80"
                        >
                          <Link className="w-4 h-4" />
                          {t('projects.viewProject')}
                        </Button>
                      </a>
                    )}
                    {project.type === "github" && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 border-white/20 bg-transparent text-white shadow-none hover:bg-white/10 hover:text-white focus-visible:ring-white/80"
                        >
                          <Github className="w-4 h-4" />
                          {t('projects.viewCode')}
                        </Button>
                      </a>
                    )}
                    {project.youtube && (
                      <a
                        href={project.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 border-white/20 bg-transparent text-white shadow-none hover:bg-white/10 hover:text-white focus-visible:ring-white/80"
                        >
                          <Youtube className="w-4 h-4" />
                          Ver en Youtube
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
