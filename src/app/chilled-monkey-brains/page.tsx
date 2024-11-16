'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createNote } from '../../convex/_generated/chilledmonkeybrains' // Adjust the import path as necessary

export default function ChilledMonkeyBrains() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (data) => {
    try {
      await createNote(data) // Use the new mutation
      setSuccessMessage('Note saved successfully!')
      setErrorMessage('')
      reset()
    } catch (error) {
      console.error('Error saving note:', error)
      setErrorMessage('Failed to save note. Please try again.')
      setSuccessMessage('')
    }
  }

  return (
    <div className="container mx-auto px-8 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-4">Chilled Monkey Brains</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <input
          {...register('title', { required: true })}
          className={`w-full border rounded p-2 ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Enter title here"
        />
        {errors.title && <p className="text-red-500">Title is required.</p>}

        <textarea
          {...register('note', { required: true })}
          className={`w-full h-40 border rounded p-2 ${errors.note ? 'border-red-500' : ''}`}
          placeholder="Enter your note here"
        />
        {errors.note && <p className="text-red-500">Note is required.</p>}

        <input
          {...register('externalRefUrl')}
          className="w-full border rounded p-2"
          placeholder="Enter external reference URL (optional)"
        />

        <input
          {...register('projectCardUrl')}
          className="w-full border rounded p-2"
          placeholder="Enter project card URL (optional)"
        />

        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Note
        </button>
      </form>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  )
}
