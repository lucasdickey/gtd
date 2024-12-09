'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Cookies from 'js-cookie'

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
    try {
      const { title, note, externalRefUrl, projectCardUrl } = data
      await createNote({
        title,
        note,
        externalRefUrl: externalRefUrl || '',
        projectCardUrl: projectCardUrl || '',
      })
      reset()
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="relative mb-12">
            <div className="absolute inset-0 -skew-y-2 bg-tan-200/50 transform -z-10" />
            <h1 className="text-4xl font-bold pt-4">Chilled Monkey Brains</h1>
          </div>

          <div className="max-w-2xl mx-auto mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note
                  </label>
                  <textarea
                    {...register('note', { required: true })}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md ${
                      errors.note ? 'border-red-500' : ''
                    }`}
                    rows={6}
                    placeholder="Enter your note here"
                  />
                  {errors.note && (
                    <p className="mt-1 text-sm text-red-600">
                      Note is required.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    {...register('title', { required: true })}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md ${
                      errors.title ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter title here"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      Title is required.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    External Reference URL
                  </label>
                  <input
                    {...register('externalRefUrl')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter external reference URL (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Card URL
                  </label>
                  <input
                    {...register('projectCardUrl')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter project card URL (optional)"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Note
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
