'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Cookies from 'js-cookie'

// Define the shape of our form data
interface NoteFormData {
  title: string
  note: string
  externalRefUrl?: string
  projectCardUrl?: string
}

export default function ChilledMonkeyBrains() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>()

  // Auth check
  const sessionToken = Cookies.get('adminSessionToken')
  const isValidSession = useQuery(
    api.auth.validateSession,
    sessionToken ? { sessionToken } : 'skip'
  )

  const createNote = useMutation(api.notes.createNote)

  useEffect(() => {
    if (isValidSession === false) {
      router.push('/admin/login')
    }
  }, [isValidSession, router])

  if (isValidSession === undefined) {
    return <div>Loading...</div>
  }

  if (isValidSession === false) {
    return null
  }

  const onSubmit = async (data: NoteFormData) => {
    console.log('Form submitted with data:', data)
    try {
      const { title, note, externalRefUrl, projectCardUrl } = data
      await createNote({
        title,
        note,
        externalRefUrl: externalRefUrl || '',
        projectCardUrl: projectCardUrl || '',
      })
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
