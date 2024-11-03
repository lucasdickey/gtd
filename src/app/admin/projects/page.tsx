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
  imageFile?: File;  // New field for file upload
  slug: string;  // URL-friendly version of the title
  content: string;  // Markdown content
  images: string[];  // Array of image URLs for carousel
  imageFiles?: File[];  // New field for multiple file uploads
}

// First, let's define the project type
interface Project {
  _id: string
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

  // Use the existing generateUploadUrl mutation
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);

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

  // Handle single image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Get upload URL from Convex
      const postUrl = await generateUploadUrl();
      
      // Upload the file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (result.ok) {
        const { storageId } = await result.json();
        setFormData(prev => ({ ...prev, imageUrl: storageId }));
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Handle multiple image upload
  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const uploadPromises = files.map(async (file) => {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          body: file,
        });
        
        if (result.ok) {
          const { storageId } = await result.json();
          return storageId;
        }
        return null;
      });

      const storageIds = (await Promise.all(uploadPromises)).filter(Boolean);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...storageIds] }));
    } catch (error) {
      console.error("Upload failed:", error);
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
          <label className="block text-sm font-medium mb-1">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
          />
          {formData.imageUrl && (
            <img 
              src={`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${formData.imageUrl}`}
              alt="Preview" 
              className="mt-2 h-32 object-cover"
            />
          )}
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
          <label className="block text-sm font-medium mb-1">Additional Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesUpload}
            className="w-full p-2 border rounded"
          />
          <div className="mt-2 flex gap-2 flex-wrap">
            {formData.images.map((imageId, index) => (
              <img
                key={index}
                src={`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${imageId}`}
                alt={`Additional ${index + 1}`}
                className="h-32 object-cover"
              />
            ))}
          </div>
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
