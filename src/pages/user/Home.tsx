import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import { useRecommendedBooks } from '@/hooks/useBooks'
import { usePopularAuthors } from '@/hooks/useAuthors'
import { ROUTES } from '@/constants'
import HeroBanner from '@/components/user/HeroBanner'
import BookCard from '@/components/common/BookCard'
import AuthorCard from '@/components/user/AuthorCard'

const CATEGORY_ORDER = ['Fiction', 'Non-Fiction', 'Self-Improvement', 'Finance', 'Science', 'Education']

export default function Home() {
  const navigate = useNavigate()
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined)
  const [page, setPage] = useState(1)

  const { data: categories } = useCategories()
  const displayCategories = categories
    ?.filter((cat: { id: number; name: string }) => CATEGORY_ORDER.includes(cat.name))
    .sort((a: { name: string }, b: { name: string }) =>
      CATEGORY_ORDER.indexOf(a.name) - CATEGORY_ORDER.indexOf(b.name)
    )

  const { data: recommended, isFetching } = useRecommendedBooks({
    by: 'rating',
    categoryId: activeCategoryId,
    page,
    limit: 8,
  })
  const { data: popularAuthors } = usePopularAuthors(6)

  const handleCategoryClick = (id: number | undefined) => {
    setActiveCategoryId(id)
    setPage(1)
  }

  const categoryIcons: Record<string, string> = {
    Fiction: '📖',
    'Non-Fiction': '📝',
    'Self-Improvement': '🌱',
    Finance: '💰',
    Science: '🔬',
    Education: '🎓',
  }

  return (
    <div className="space-y-8">
      <HeroBanner />

      {/* Category Grid */}
      <section>
        <div className="grid grid-cols-3 gap-3">
          {displayCategories?.map((cat: { id: number; name: string }) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl shadow-sm transition-all"
              style={{
                backgroundColor: activeCategoryId === cat.id ? 'var(--primary-200)' : 'white',
                border: activeCategoryId === cat.id ? '2px solid var(--primary-300)' : '2px solid transparent',
              }}
            >
              <span className="text-2xl">{categoryIcons[cat.name] ?? '📚'}</span>
              <span className="text-xs font-semibold text-gray-700 text-center">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {activeCategoryId
            ? displayCategories?.find((c: { id: number }) => c.id === activeCategoryId)?.name
            : 'Recommendation'}
        </h2>

        {isFetching ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {recommended?.map((book: any) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => navigate(ROUTES.BOOK_DETAIL(book.id))}
              />
            ))}
          </div>
        )}

        {recommended && recommended.length >= 8 && (
          <button
            onClick={() => setPage(page + 1)}
            className="w-full mt-4 py-3 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: 'var(--primary-200)', color: 'var(--primary-300)' }}
          >
            Load More
          </button>
        )}
      </section>

      {/* Popular Authors */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Authors</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {popularAuthors?.map((author: any) => (
            <AuthorCard
              key={author.id}
              author={author}
              onClick={() => navigate(ROUTES.BOOKS_BY_AUTHOR(author.id))}
            />
          ))}
        </div>
      </section>
    </div>
  )
}