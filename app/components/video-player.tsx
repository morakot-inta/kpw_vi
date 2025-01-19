'use client'

import { useState, useEffect } from 'react'
import { videoIndexer } from "../lib/video-indexer"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VideoPlayerProps {
  videoId: string
  onClose: () => void
}

export function VideoPlayer({ videoId, onClose }: VideoPlayerProps) {
  const [streamingUrl, setStreamingUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStreamingUrl = async () => {
      try {
        const url = await videoIndexer.getVideoStreamingUrl(videoId)
        setStreamingUrl(url)
      } catch (err) {
        console.error('Error fetching streaming URL:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while fetching the video')
      }
    }

    fetchStreamingUrl()
  }, [videoId])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!streamingUrl) {
    return <div>Loading video...</div>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Video Player</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>
        <video src={streamingUrl} controls className="w-full" />
      </div>
    </div>
  )
}

