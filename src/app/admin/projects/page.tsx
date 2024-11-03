'use client'
import { useState } from 'react'
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Define the shape of our form data
interface ProjectFormData {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;  // URL-friendly version of the title
  content: string;  // Markdown content
  images: string[];  // Array of image URLs for carousel
}

// First, let's define the project type
interface Project {
  _id: Id<"projects">
  title: string
  description: string
  imageUrl: string
  slug: string
  content: string
  images: string[]
}

export default function AdminProjects() {
  // Fetch all projects from Convex database
  // The '|| []' provides a default empty array if projects is null/undefined
  const projects = useQuery(api.projects.getProjects) || [];

  // Set up mutations (database operations) using Convex hooks
  const createProject = useMutation(api.projects.createProject);  // For adding new projects
  const updateProject = useMutation(api.projects.updateProject);  // For editing existing projects
  const deleteProject = useMutation(api.projects.deleteProject);  // For removing projects

  // State for managing form inputs
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    imageUrl: '',
    slug: '',
    content: '',
    images: [],
  });

  // State to track which project is being edited (null means we're creating a new project)
  const [editingId, setEditingId] = useState<Id<"projects"> | null>(null);

  // Handle form submission for both create and update operations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default form submission behavior
    
    if (editingId) {
      // If we have an editingId, we're updating an existing project
      await updateProject({
        id: editingId,
        ...formData,
      });
      setEditingId(null);  // Clear editing state
    } else {
      // No editingId means we're creating a new project
      await createProject(formData);
    }
    
    // Reset form after submission
    setFormData({ title: '', description: '', imageUrl: '', slug: '', content: '', images: [] });
  };

  // Handle clicking edit button for a project
  const handleEdit = (project: Project) => {
    // Set the editing ID to the selected project
    setEditingId(project._id);
    
    // Populate form with current project data
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      slug: project.slug,
      content: project.content,
      images: project.images,
    });
  };

  // Handle project deletion with confirmation
  const handleDelete = async (id: Id<"projects">) => {
    // Show confirmation dialog before deleting
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject({ id });
    }
  };

  // Render the admin interface
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Projects</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <input
            type="text"
            value={formData.images.join(',')}
            onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',') })}
            className="w-full p-2 border rounded"
            required
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
  );
}
