import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star } from 'lucide-react'
import { useBookDetail } from '@/hooks/useBooks'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14}
          fill={i <= rating ? 'var(--accent-yellow)' : 'transparent'}
          color={i <= rating ? 'var(--accent-yellow)' : '#d1d5db'}
        />
      ))}
    </div>
  )
}

export default function BookPreview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: bookData, isLoading } = useBookDetail(Number(id))
  const book = bookData?.data

  if (isLoading) return (
    <div className="space-y-4 animate-pulse px-4 pt-4">
      <div className="h-72 bg-gray-100 rounded-2xl" />
      <div className="h-6 bg-gray-100 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
    </div>
  )

  if (!book) return <div className="text-center py-20 text-gray-400">Book not found</div>

  return (
    <div className="pb-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Preview Book</h1>
      </div>

      {/* Cover */}
      <div className="px-4">
        <div className="w-full max-w-[200px] mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-gray-100">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl"
              style={{ backgroundColor: 'var(--primary-200)' }}>📚</div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 space-y-2">
        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full border border-gray-300 text-gray-600">
          {book.category?.name}
        </span>
        <h2 className="text-2xl font-bold text-gray-900">{book.title}</h2>
        <p className="text-sm text-gray-500">{book.author?.name}</p>
        <div className="flex items-center gap-1">
          <Star size={16} fill="var(--accent-yellow)" color="var(--accent-yellow)" />
          <span className="text-sm font-bold text-gray-800">{book.rating?.toFixed(1)}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
          {[
            { label: 'Page', value: book.totalPages ?? '—' },
            { label: 'Rating', value: book.reviewCount ?? '—' },
            { label: 'Reviews', value: book.reviewCount ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center py-3">
              <span className="text-lg font-bold text-gray-900">{value}</span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="pt-2">
          <h3 className="text-base font-bold text-gray-900 mb-1">Description</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{book.description}</p>
        </div>
      </div>
    </div>
  )
}