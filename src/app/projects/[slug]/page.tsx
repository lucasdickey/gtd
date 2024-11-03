'use client'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from 'next/image';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = useQuery(api.projects.getProjectBySlug, { slug: params.slug });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{project.title}</h1>
      
      {/* Image Carousel */}
      <div className="relative h-96 mb-8">
        <Image
          src={project.images[currentImageIndex]}
          alt={`${project.title} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute bottom-4 right-4 space-x-2">
          {project.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Markdown Content */}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{project.content}</ReactMarkdown>
      </div>
    </div>
  );
}
