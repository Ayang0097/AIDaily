import React from 'react'

export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-16 bg-gray-200 rounded"></div>
        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="flex gap-2 mb-2">
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-1 mb-3">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <div className="h-7 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-7 w-16 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="px-4 py-4 space-y-3">
      <NewsCardSkeleton />
      <NewsCardSkeleton />
      <NewsCardSkeleton />
    </div>
  )
}
