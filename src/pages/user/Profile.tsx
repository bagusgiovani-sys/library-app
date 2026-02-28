import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Star, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import type { RootState } from '@/store/index'
import { useMe, useUpdateProfile, useMyLoansProfile, useMyReviews } from '@/hooks/useMe'
import { useCreateReview, useDeleteReview } from '@/hooks/useReviews'
import { ROUTES } from '@/constants'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate, formatDateTime } from '@/lib/utils'

type Tab = 'profile' | 'borrowed' | 'reviews'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={16}
          fill={i <= rating ? 'var(--accent-yellow)' : 'transparent'}
          color={i <= rating ? 'var(--accent-yellow)' : '#d1d5db'}
        />
      ))}
    </div>
  )
}

// ─── Review Modal ────────────────────────────────────────────────
function ReviewModal({ bookId, onClose }: { bookId: number; onClose: () => void }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const { mutate: createReview, isPending } = useCreateReview()

  const handleSend = () => {
    if (rating === 0) { toast.error('Please give a rating'); return }
    if (!comment.trim()) { toast.error('Please write a comment'); return }
    createReview(
      { bookId, star: rating, comment },
      {
        onSuccess: () => { toast.success('Review submitted!'); onClose() },
        onError: () => toast.error('Failed to submit review'),
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-3xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Give Review</h3>
          <button onClick={onClose} className="text-gray-400"><X size={20} /></button>
        </div>

        {/* Star Rating */}
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-gray-700">Give Rating</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(i)}
              >
                <Star
                  size={36}
                  fill={(hovered || rating) >= i ? 'var(--accent-yellow)' : '#e5e7eb'}
                  color={(hovered || rating) >= i ? 'var(--accent-yellow)' : '#e5e7eb'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please share your thoughts about this book"
          rows={5}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-blue-400 resize-none"
        />

        {/* Send */}
        <Button
          onClick={handleSend}
          disabled={isPending}
          className="w-full rounded-full py-6 font-semibold text-white"
          style={{ backgroundColor: 'var(--primary-300)' }}
        >
          {isPending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}

// ─── Profile Tab ────────────────────────────────────────────────
function ProfileTab() {
  const { user } = useSelector((state: RootState) => state.auth)
  const { data: meData } = useMe()
  const me = meData?.data?.user ?? user

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={me?.profilePhoto ?? ''} />
          <AvatarFallback style={{ backgroundColor: 'var(--primary-200)', color: 'var(--primary-300)' }}>
            {me?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {[
          { label: 'Name', value: me?.name },
          { label: 'Email', value: me?.email },
          { label: 'Nomor Handphone', value: me?.phone ?? '-' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-400">{label}</span>
            <span className="text-sm font-semibold text-gray-900">{value}</span>
          </div>
        ))}

        <Button
          className="w-full rounded-full py-6 font-semibold text-white"
          style={{ backgroundColor: 'var(--primary-300)' }}
        >
          Update Profile
        </Button>
      </div>
    </div>
  )
}

// ─── Borrowed List Tab ───────────────────────────────────────────
function BorrowedTab() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'BORROWED' | 'LATE' | 'RETURNED' | undefined>(undefined)
  const [reviewBookId, setReviewBookId] = useState<number | null>(null)

  const { data: loansData } = useMyLoansProfile({ status, limit: 20 })
  const loans = loansData?.data?.loans ?? []

  const statusFilters = [
    { label: 'All', value: undefined },
    { label: 'Active', value: 'BORROWED' as const },
    { label: 'Returned', value: 'RETURNED' as const },
    { label: 'Overdue', value: 'LATE' as const },
  ]

  const statusColor: Record<string, string> = {
    BORROWED: 'var(--accent-green)',
    RETURNED: '#6b7280',
    LATE: 'var(--accent-red)',
  }

  const filtered = loans.filter((loan: any) =>
    loan.book?.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Borrowed List</h1>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3 border border-gray-200">
        <Search size={16} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search book"
          className="flex-1 text-sm bg-transparent outline-none text-gray-700"
        />
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setStatus(value)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all"
            style={{
              backgroundColor: status === value ? 'var(--primary-200)' : 'white',
              borderColor: status === value ? 'var(--primary-300)' : '#e5e7eb',
              color: status === value ? 'var(--primary-300)' : '#374151',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loans */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No loans found</p>
        ) : (
          filtered.map((loan: any) => (
            <div key={loan.id} className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="text-sm font-bold" style={{ color: statusColor[loan.status] }}>
                    {loan.status === 'BORROWED' ? 'Active' : loan.status === 'LATE' ? 'Overdue' : 'Returned'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Due Date</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent-red)' }}>
                    {formatDate(loan.dueAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {loan.book?.coverImage ? (
                    <img src={loan.book.coverImage} alt={loan.book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: 'var(--primary-200)' }}>📚</div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-300 text-gray-500">
                    {loan.book?.category?.name}
                  </span>
                  <p className="text-sm font-bold text-gray-900">{loan.book?.title}</p>
                  <p className="text-xs text-gray-500">{loan.book?.author?.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(loan.borrowedAt)} · Duration {loan.durationDays} Days
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setReviewBookId(loan.book?.id)}
                className="w-full rounded-full py-5 font-semibold text-white"
                style={{ backgroundColor: 'var(--primary-300)' }}
              >
                Give Review
              </Button>
            </div>
          ))
        )}
      </div>

      {reviewBookId && (
        <ReviewModal bookId={reviewBookId} onClose={() => setReviewBookId(null)} />
      )}
    </div>
  )
}

// ─── Reviews Tab ─────────────────────────────────────────────────
function ReviewsTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { data: reviewsData } = useMyReviews({ q: search })
  const reviews = reviewsData?.data?.reviews ?? []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>

      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3 border border-gray-200">
        <Search size={16} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search book"
          className="flex-1 text-sm bg-transparent outline-none text-gray-700"
        />
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No reviews yet</p>
        ) : (
          reviews.map((review: any) => (
            <div key={review.id} className="space-y-3 border-b border-gray-100 pb-6">
              <p className="text-sm text-gray-400">{formatDateTime(review.createdAt)}</p>
              <div
                className="flex gap-3 cursor-pointer"
                onClick={() => navigate(ROUTES.BOOK_DETAIL(review.book?.id))}
              >
                <div className="w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {review.book?.coverImage ? (
                    <img src={review.book.coverImage} alt={review.book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl"
                      style={{ backgroundColor: 'var(--primary-200)' }}>📚</div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-300 text-gray-500">
                    {review.book?.category?.name}
                  </span>
                  <p className="text-sm font-bold text-gray-900">{review.book?.title}</p>
                  <p className="text-xs text-gray-500">{review.book?.author?.name}</p>
                </div>
              </div>
              <StarRating rating={review.star ?? review.rating} />
              <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Main Profile Page ───────────────────────────────────────────
export default function ProfilePage() {
  const location = useLocation()

  const getInitialTab = (): Tab => {
    if (location.pathname.includes('borrowed')) return 'borrowed'
    if (location.pathname.includes('reviews')) return 'reviews'
    return 'profile'
  }

  const [activeTab, setActiveTab] = useState<Tab>(getInitialTab)

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'borrowed', label: 'Borrowed List' },
    { key: 'reviews', label: 'Reviews' },
  ]

  return (
    <div className="px-4 pt-4 pb-10 space-y-4">
      <div className="flex bg-gray-100 rounded-full p-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="flex-1 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeTab === key ? 'white' : 'transparent',
              color: activeTab === key ? 'var(--primary-300)' : '#6b7280',
              boxShadow: activeTab === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && <ProfileTab />}
      {activeTab === 'borrowed' && <BorrowedTab />}
      {activeTab === 'reviews' && <ReviewsTab />}
    </div>
  )
}