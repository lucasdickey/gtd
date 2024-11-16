'use client'

import { useForm } from 'react-hook-form'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

// Define the shape of our form data
interface NoteFormData {
  title: string
  note: string
  externalRefUrl?: string
  projectCardUrl?: string
}

export default function ChilledMonkeyBrains() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>()
  const createNote = useMutation(api.notes.createNote)

  const onSubmit = async (data: NoteFormData) => {
    console.log('Form submitted with data:', data)
    try {
      await createNote(data)
      console.log('Note saved successfully')
      reset()
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen px-4 md:px-8 py-4">
      <h1 className="text-3xl font-bold mb-4">Chilled Monkey Brains</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 space-y-4 w-full max-w-lg"
      >
        <div className="flex flex-col items-center">
          <div className="brains-input-wrapper">
            <textarea
              {...register('note', { required: true })}
              className={`w-full max-w-lg h-40 border rounded p-2 ${errors.note ? 'border-red-500' : ''}`}
              placeholder="Enter your note here"
            />
            {errors.note && <p className="text-red-500">Note is required.</p>}
          </div>

          <div className="brains-input-wrapper">
            <input
              {...register('title', { required: true })}
              className={`w-full max-w-lg border rounded p-2 ${errors.title ? 'border-red-500' : ''} py-2`}
              placeholder="Enter title here"
            />
            {errors.title && <p className="text-red-500">Title is required.</p>}
          </div>

          <div className="brains-input-wrapper">
            <input
              {...register('externalRefUrl')}
              className="w-full max-w-lg border rounded p-2 py-2"
              placeholder="Enter external reference URL (optional)"
            />
          </div>

          <div className="brains-input-wrapper">
            <input
              {...register('projectCardUrl')}
              className="w-full max-w-lg border rounded p-2 py-2"
              placeholder="Enter project card URL (optional)"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Note
          </button>
        </div>
      </form>
    </div>
  )
}
