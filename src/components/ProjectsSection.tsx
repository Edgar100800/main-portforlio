import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Link, Youtube } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tech: string[];
  type: "web" | "github" | "youtube";
  link?: string;
  github?: string;
  youtube?: string;
  image: string;
}

const projects: Project[] = [
  // {
  //   title: "Ascii-Camera",
  //   description:
  //     "App de Realidad Aumentada para museos. Escanea QR y accede a contenido multimedia.",
  //   tech: ["Next.js", "Supabase", "PWA"],
  //   link: "https://github.com/edgarchambilla/qr-museum-app",
  //   image: "/profile.webp",
  // },
  {
    title: "Ascii-Camera",
    description: "App que transforma tus imágenes en ASCII art.",
    tech: ["Next.js", "Tailwind", "Shadcn"],
    type: "web",
    github: "https://github.com/edgarchambilla/ascii-camera",
    link: "https://www.edgarchambilla.com/ascii-camera",
    image: "/ascii-camera.avif",
  },
  // {
  //   title: "Startup Portfolio",
  //   description: "Mi portafolio personal usando Astro, Tailwind y Magic UI.",
  //   tech: ["Astro", "Tailwind", "Magic UI"],
  //   link: "https://edgarchambilla.com",
  //   image: "/profile.webp",
  // },
];

export default function ProjectsSection() {
  return (
    <section className="py-16 px-0  text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">
          🚀 Mis Proyectos
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Card
              key={project.title}
              className="hover:scale-105 p-1 gap-2 transition-transform duration-300 shadow-xl bg-white text-black"
            >
              <img
                src={project.image}
                alt={`Preview de ${project.title}`}
                className="w-full h-48 object-cover rounded-md "
              />
              <CardContent className="p-2">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-sm mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, i) => (
                    <span
                      key={tech}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.type === "web" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Link className="w-4 h-4" />
                        Ver en web
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
                        className="flex items-center gap-2"
                      >
                        <Github className="w-4 h-4" />
                        Ver en GitHub
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
                        className="flex items-center gap-2"
                      >
                        <Youtube className="w-4 h-4" />
                        Ver en Youtube
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
