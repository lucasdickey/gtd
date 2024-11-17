// components/TwitterShareButton.tsx
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

interface TwitterShareButtonProps {
  projectId: Id<'projects'>
  projectUrl: string
}

export default function TwitterShareButton({
  projectId,
  projectUrl,
}: TwitterShareButtonProps) {
  const summary = useQuery(api.summaries.getProjectSummary, { projectId })

  const handleShare = () => {
    const text = summary?.summary || '' // Use generated summary if available
    const url = projectUrl

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank')
  }

  return (
    <button
      onClick={handleShare}
      className="bg-[#1DA1F2] text-white px-4 py-2 rounded-full hover:bg-[#1a8cd8] transition-colors"
    >
      Share on Twitter
    </button>
  )
}
