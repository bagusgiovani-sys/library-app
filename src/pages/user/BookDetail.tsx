import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, ChevronRight, X } from 'lucide-react'
import { toast } from 'sonner'
import { useBookDetail, useRecommendedBooks } from '@/hooks/useBooks'
import { useBookReviews } from '@/hooks/useReviews'
import { useAddToCart } from '@/hooks/useCart'
import { useBorrowBook } from '@/hooks/useLoans'
import { ROUTES } from '@/constants'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import BookCard from '@/components/common/BookCard'
import { formatDateTime } from '@/lib/utils'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          fill={i <= rating ? 'var(--accent-yellow)' : 'transparent'}
          color={i <= rating ? 'var(--accent-yellow)' : '#d1d5db'}
        />
      ))}
    </div>
  )
}

function BorrowModal({
  onClose,
  onConfirm,
  isPending,
}: {
  onClose: () => void
  onConfirm: (days: number) => void
  isPending: boolean
}) {
  const [selectedDays, setSelectedDays] = useState<number>(3)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-t-3xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Borrow Duration</h3>
          <button onClick={onClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-500">How many days would you like to borrow this book?</p>

        <div className="flex gap-3">
          {[3, 5, 10].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedDays(days)}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold border-2 transition-all"
              style={{
                backgroundColor: selectedDays === days ? 'var(--primary-200)' : 'white',
                borderColor: selectedDays === days ? 'var(--primary-300)' : '#e5e7eb',
                color: selectedDays === days ? 'var(--primary-300)' : '#374151',
              }}
            >
              {days} Days
            </button>
          ))}
        </div>

        <button
          onClick={() => onConfirm(selectedDays)}
          disabled={isPending}
          className="w-full py-3 rounded-full text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary-300)' }}
        >
          {isPending ? 'Borrowing...' : 'Confirm Borrow'}
        </button>
      </div>
    </div>
  )
}

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const bookId = Number(id)
  const [reviewPage, setReviewPage] = useState(1)
  const [showBorrowModal, setShowBorrowModal] = useState(false)

  const { data: bookData, isLoading } = useBookDetail(bookId)
  const { data: reviewsData } = useBookReviews(bookId, { page: reviewPage, limit: 5 })
  const { data: relatedBooks } = useRecommendedBooks({ categoryId: bookData?.data?.categoryId, limit: 4 })
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart()
  const { mutate: borrowBook, isPending: isBorrowing } = useBorrowBook()

  const book = bookData?.data
  const reviews = book?.reviews ?? []
  // reviews embedded in book response

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse px-4 pt-4">
        <div className="h-72 bg-gray-100 rounded-2xl" />
        <div className="h-6 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
      </div>
    )
  }

  if (!book) return <div className="text-center py-20 text-gray-400">Book not found</div>

  const handleAddToCart = () => {
    addToCart(bookId, {
      onSuccess: () => toast.success('Added to cart'),
      onError: () => toast.error('Failed to add to cart'),
    })
  }

  const handleBorrowConfirm = (days: number) => {
    borrowBook(
      { bookId, days },
      {
        onSuccess: () => {
          toast.success('Book borrowed successfully!')
          setShowBorrowModal(false)
        },
        onError: () => toast.error('Failed to borrow book'),
      }
    )
  }

  return (
    <div className="pb-28 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm px-4 pt-4">
        <Link to={ROUTES.HOME} className="text-gray-400">Home</Link>
        <ChevronRight size={14} className="text-gray-400" />
        <Link to={`/category?categoryId=${book.categoryId}`} className="text-gray-400">Category</Link>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="font-semibold text-gray-700 truncate max-w-[140px]">{book.title}</span>
      </nav>

      {/* Cover Image */}
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

      {/* Book Info */}
      <div className="px-4 space-y-2">
        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full border border-gray-300 text-gray-600">
          {book.category?.name}
        </span>
        <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
        <button
          onClick={() => navigate(ROUTES.BOOKS_BY_AUTHOR(book.authorId))}
          className="text-sm text-gray-500"
        >
          {book.author?.name}
        </button>
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
          <h2 className="text-base font-bold text-gray-900 mb-1">Description</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{book.description}</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="px-4 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Review</h2>
          <div className="flex items-center gap-2 mt-1">
            <Star size={16} fill="var(--accent-yellow)" color="var(--accent-yellow)" />
            <span className="text-sm font-semibold text-gray-700">
              {book.rating?.toFixed(1)} ({book.reviewCount} Ulasan)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review.id} className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.user?.profilePhoto ?? ''} />
                  <AvatarFallback style={{ backgroundColor: 'var(--primary-200)', color: 'var(--primary-300)' }}>
                    {review.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{review.user?.name}</p>
                  <p className="text-xs text-gray-400">{formatDateTime(review.createdAt)}</p>
                </div>
              </div>
              <StarRating rating={review.star} />
              <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>

        {false && (
          <button
            onClick={() => setReviewPage(reviewPage + 1)}
            className="w-full py-3 rounded-full text-sm font-semibold border border-gray-200 text-gray-700 bg-white"
          >
            Load More
          </button>
        )}
      </div>

      {/* Related Books */}
      {relatedBooks && relatedBooks.length > 0 && (
        <div className="px-4 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Related Books</h2>
          <div className="grid grid-cols-2 gap-4">
            {relatedBooks.filter((b: any) => b.id !== bookId).slice(0, 4).map((b: any) => (
              <BookCard
                key={b.id}
                book={b}
                onClick={() => navigate(ROUTES.BOOK_DETAIL(b.id))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-white border-t border-gray-100 flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="flex-1 py-3 rounded-full text-sm font-semibold border-2 text-gray-800 bg-white transition-opacity disabled:opacity-50"
          style={{ borderColor: 'var(--primary-300)' }}
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
        <button
          onClick={() => setShowBorrowModal(true)}
          className="flex-1 py-3 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--primary-300)' }}
        >
          Borrow Book
        </button>
      </div>

      {/* Borrow Modal */}
      {showBorrowModal && (
        <BorrowModal
          onClose={() => setShowBorrowModal(false)}
          onConfirm={handleBorrowConfirm}
          isPending={isBorrowing}
        />
      )}
    </div>
  )
}