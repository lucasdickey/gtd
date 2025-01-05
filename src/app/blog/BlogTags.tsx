'use client'

import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

interface BlogTagsProps {
  blogId: Id<'blogs'>
}

const categoryColors = {
  technical: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  topic: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  language:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  general: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
}

export default function BlogTags({ blogId }: BlogTagsProps) {
  const tags = useQuery(api.tagAssociations.getTagsForBlog, { blogId })

  // Return null if tags is undefined (still loading)
  if (tags === undefined) return null

  // If there are no tags, render an empty div to maintain layout
  if (tags.length === 0) {
    return <div className="mt-2" />
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag) => (
        <span
          key={tag._id}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            categoryColors[tag.category as keyof typeof categoryColors] ||
            categoryColors.general
          }`}
          title={`Confidence: ${Math.round(tag.confidence * 100)}%`}
        >
          {tag.name}
        </span>
      ))}
    </div>
  )
}
