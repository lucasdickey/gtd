import Image from "next/image";
import type { Metadata } from 'next';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Project One",
    description: "Description for project one",
    imageUrl: "/placeholder.jpg",
  },
  // Add more projects as needed
];

export default function Projects() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-48">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{project.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Projects',
};
