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
    <section className="py-16 px-0  text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">
          🚀 {t('projects.title')}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={project.titleKey}
              className="relative group overflow-hidden rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-500 shadow-2xl shadow-black/25"
            >
              <ShineBorder
                borderWidth={2}
                duration={8}
                shineColor={["#3b82f6", "#8b5cf6", "#06b6d4"]}
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="relative z-10 p-6 backdrop-blur-sm">
                <div className="overflow-hidden rounded-lg mb-4 ring-1 ring-white/10">
                  <img
                    src={project.image}
                    alt={`Preview de ${t(project.titleKey)}`}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white/90 group-hover:text-white transition-colors duration-300">
                    {t(project.titleKey)}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {t(project.descriptionKey)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span
                        key={tech}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 px-3 py-1 rounded-full text-xs font-medium hover:bg-white/20 hover:text-white transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    {project.type === "web" && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white/90 hover:bg-blue-500/20 hover:border-blue-400/50 hover:text-white transition-all duration-300"
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
                          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white/90 hover:bg-purple-500/20 hover:border-purple-400/50 hover:text-white transition-all duration-300"
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
                          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white/90 hover:bg-red-500/20 hover:border-red-400/50 hover:text-white transition-all duration-300"
                        >
                          <Youtube className="w-4 h-4" />
                          Ver en Youtube
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
