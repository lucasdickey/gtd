'use client'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { FileUploader } from '@/components/FileUploader'
import Image from 'next/image'
import MarkdownEditor from '@/components/MarkdownEditor'

// Define the shape of our form data
interface ProjectFormData {
  title: string
  description: string
  imageUrl: string
  content: string
  images: string[]
  tools: string[]
  publishedAt: Date
  projectUrl?: string
  projectUrlText?: string
}

// Project type definition
interface Project {
  _id: Id<'projects'>
  title: string
  description: string
  imageUrl: string
  slug: string
  content: string
  images: string[]
  tools: string[]
  publishedAt: Date
  projectUrl?: string
  projectUrlText?: string
}

// Type for project as stored in database
interface DbProject {
  _id: Id<'projects'>
  _creationTime: number
  title: string
  description: string
  imageUrl: string
  slug: string
  content: string
  images: string[]
  tools?: string[]
  publishedAt: number
  projectUrl?: string
  projectUrlText?: string
}

export const dynamic = 'force-dynamic'

export default function AdminProjects() {
  // Fetch and map projects from Convex database
  const dbProjects = useQuery(api.projects.getAllProjects) || []
  const projects: Project[] = (dbProjects as DbProject[]).map((dbProject) => ({
    ...dbProject,
    publishedAt: new Date(dbProject.publishedAt), // Convert number to Date
    tools: dbProject.tools || [], // Ensure tools exists
  }))

  // Set up mutations (database operations) using Convex hooks
  const createProject = useMutation(api.projects.createProject) // For adding new projects
  const updateProject = useMutation(api.projects.updateProject) // For editing existing projects
  const deleteProject = useMutation(api.projects.deleteProject) // For removing projects

  // State for managing form inputs
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    imageUrl: '',
    content: '',
    images: [],
    tools: [],
    publishedAt: new Date(),
    projectUrl: '',
    projectUrlText: '',
  })

  // State to track which project is being edited (null means we're creating a new project)
  const [editingId, setEditingId] = useState<Id<'projects'> | null>(null)

  // Handle form submission for both create and update operations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // More specific validation
      const missingFields = []
      if (!formData.title?.trim()) missingFields.push('Title')
      if (!formData.description?.trim()) missingFields.push('Description')
      if (!formData.content?.trim() && !formData.content?.includes('<'))
        missingFields.push('Content')

      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in the following required fields: ${missingFields.join(', ')}`
        )
      }

      // Ensure imageUrl is set
      if (!formData.imageUrl) {
        formData.imageUrl = '/projectOne.jpg' // Default image
      }

      // Ensure tools is an array
      const tools = Array.isArray(formData.tools) ? formData.tools : []

      const projectData = {
        ...formData,
        publishedAt: formData.publishedAt.getTime(),
        tools,
        images: formData.images || [],
      }

      if (editingId) {
        await updateProject({
          id: editingId,
          ...projectData,
        })
        setEditingId(null)
      } else {
        await createProject(projectData)
      }

      // Reset form after submission
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        content: '',
        images: [],
        tools: [],
        publishedAt: new Date(),
        projectUrl: '',
        projectUrlText: '',
      })
    } catch (error) {
      console.error('Error saving project:', error)
      alert(
        `Failed to save project: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Handle clicking edit button for a project
  const handleEdit = (project: Project) => {
    // Set the editing ID to the selected project
    setEditingId(project._id)

    // Populate form with current project data
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      content: project.content,
      images: project.images,
      tools: project.tools || [],
      publishedAt: new Date(project.publishedAt),
      projectUrl: project.projectUrl || '',
      projectUrlText: project.projectUrlText || '',
    })
  }

  // Handle project deletion with confirmation
  const handleDelete = async (id: Id<'projects'>) => {
    // Show confirmation dialog before deleting
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject({ id })
    }
  }

  // Render the admin interface
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Projects</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            id="project-title"
            name="project-title"
            value={formData.title}
            onChange={(e) => {
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <MarkdownEditor
            content={formData.content}
            onChange={(markdown) => {
              setFormData((prev) => ({
                ...prev,
                content: markdown || '',
              }))
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Tools (One per line)
          </label>
          <textarea
            value={formData.tools.join('\n')}
            onChange={(e) =>
              setFormData({
                ...formData,
                tools: e.target.value
                  .split('\n')
                  .filter((tool) => tool.trim() !== ''),
              })
            }
            className="w-full p-2 border rounded h-48 font-mono"
            placeholder="NextJS for front-end framework&#10;Convex for back-end and database&#10;Vercel for deployments"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <div className="space-y-4">
            <FileUploader
              projectId={editingId || 'general'}
              onUploadComplete={(result) => {
                setFormData({
                  ...formData,
                  images: [...formData.images, result.fileUrl],
                  imageUrl: formData.imageUrl || result.fileUrl,
                })
              }}
              onError={(error) => {
                console.error('Upload error:', error)
                alert('Failed to upload image: ' + error.message)
              }}
              allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxSizeMB={5}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={imageUrl}
                    alt={`Project image ${index + 1}`}
                    width={200}
                    height={200}
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images.filter(
                        (_, i) => i !== index
                      )
                      setFormData({ ...formData, images: newImages })
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Published Date
            </label>
            <input
              type="datetime-local"
              value={formData.publishedAt.toISOString().slice(0, 16)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  publishedAt: new Date(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Project URL
            </label>
            <input
              type="url"
              value={formData.projectUrl || ''}
              onChange={(e) =>
                setFormData({ ...formData, projectUrl: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="https://example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Project URL Text
          </label>
          <input
            type="text"
            value={formData.projectUrlText || ''}
            onChange={(e) =>
              setFormData({ ...formData, projectUrlText: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="View Project Demo"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? 'Update Project' : 'Add Project'}
        </button>
      </form>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{project.title}</h3>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(project)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
