'use client'
import Image from 'next/image'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Projects() {
  const projects = useQuery(api.projects.getProjects) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-6">
        {/* Left white space */}
        <div className="col-span-2" />

        {/* Center column with projects */}
        <div className="col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
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

        {/* Right white space */}
        <div className="col-span-2" />
      </div>
    </div>
  )
}
