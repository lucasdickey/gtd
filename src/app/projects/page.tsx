'use client'
import Image from 'next/image'

// Define the Project type
type Project = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  tools: string[];
}

// Add constant projects data
const PROJECTS: Project[] = [
  {
    _id: '1',
    title: 'Project Zero: To One',
    description: 'Vercel. NextJS and Convex config. Deployment. Linting. Ugh. But also logos/icons, fun copywriting, and animations.',
    imageUrl: '/projectOne.jpg',
    tools: ['NextJS', 'Convex','Vercel', 'Tailwind CSS', 'TypeScript','DALL-E','Cursor with Sonnet','ChatGPT with o1','Warp']
  },
  // {
  //   _id: '2',
  //   title: 'Project Two',
  //   description: 'Description for project two goes here.',
  //   imageUrl: '/path/to/image2.jpg',
  //   tools: ['Tool1', 'Tool2'],
  // },
];

export default function Projects() {
  // Replace query with constant
  const projects = PROJECTS;

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
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {project.description}
                  </p>
                  <ul className="grid grid-cols-2 gap-x-4 list-disc list-inside text-gray-600 dark:text-gray-300">
                    {project.tools.map((tool, index) => (
                      <li key={index}>{tool}</li>
                    ))}
                  </ul>
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
