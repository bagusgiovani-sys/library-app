import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, MoreVertical } from 'lucide-react'
import { toast } from 'sonner'
import { useAdminLoans, useAdminUsers, useAdminBooks, useDeleteBook } from '@/hooks/useAdmin'
import { ROUTES } from '@/constants'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateTime } from '@/lib/utils'

type Tab = 'borrowed' | 'user' | 'books'

// ─── Borrowed List Tab ───────────────────────────────────────────
function BorrowedTab() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'returned' | 'overdue' | undefined>(undefined)
  const { data: loansData } = useAdminLoans({ status, q: search })
  const loans = loansData?.data?.loans ?? []

  const statusFilters: { label: string; value: 'all' | 'active' | 'returned' | 'overdue' | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Active', value: 'active' },
    { label: 'Returned', value: 'returned' },
    { label: 'Overdue', value: 'overdue' },
  ]

  const statusColor: Record<string, string> = {
    BORROWED: 'var(--accent-green)',
    RETURNED: '#6b7280',
    LATE: 'var(--accent-red)',
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Borrowed List</h1>

      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3 border border-gray-200">
        <Search size={16} className="text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search" className="flex-1 text-sm bg-transparent outline-none text-gray-700" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map(({ label, value }) => (
          <button key={label} onClick={() => setStatus(value)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all"
            style={{
              backgroundColor: status === value ? 'var(--primary-200)' : 'white',
              borderColor: status === value ? 'var(--primary-300)' : '#e5e7eb',
              color: status === value ? 'var(--primary-300)' : '#374151',
            }}>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loans.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No loans found</p>
        ) : loans.map((loan: any) => (
          <div key={loan.id} className="bg-white rounded-2xl p-4 shadow-sm space-y-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-sm font-bold" style={{ color: statusColor[loan.status] }}>
                  {loan.status === 'BORROWED' ? 'Active' : loan.status === 'LATE' ? 'Overdue' : 'Returned'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Due Date</span>
                <span className="text-sm font-bold px-2 py-0.5 rounded-md"
                  style={{ color: 'var(--accent-red)', backgroundColor: '#fff0f0' }}>
                  {formatDate(loan.dueAt)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
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

            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400">borrower's name</p>
              <p className="text-sm font-bold text-gray-900">{loan.user?.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── User Tab ────────────────────────────────────────────────────
function UserTab() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10
  const { data: usersData } = useAdminUsers({ q: search, page, limit })
  const users = usersData?.data?.users ?? []
  const meta = usersData?.data

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">User</h1>

      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3 border border-gray-200">
        <Search size={16} className="text-gray-400" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search user" className="flex-1 text-sm bg-transparent outline-none text-gray-700" />
      </div>

      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No users found</p>
        ) : users.map((user: any, index: number) => (
          <div key={user.id} className="space-y-2 border-b border-gray-100 pb-4">
            {[
              { label: 'No', value: (page - 1) * limit + index + 1 },
              { label: 'Name', value: user.name },
              { label: 'Email', value: user.email },
              { label: 'Nomor Handphone', value: user.phone ?? '-' },
              { label: 'Created at', value: formatDateTime(user.createdAt) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {meta?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="flex items-center gap-1 text-sm text-gray-500 disabled:opacity-40">
            ‹ Previous
          </button>
          {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className="w-8 h-8 rounded-full text-sm font-semibold transition-all"
              style={{
                backgroundColor: page === p ? 'var(--primary-300)' : 'transparent',
                color: page === p ? 'white' : '#374151',
              }}>
              {p}
            </button>
          ))}
          {meta.totalPages > 5 && <span className="text-gray-400">...</span>}
          <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages}
            className="flex items-center gap-1 text-sm text-gray-500 disabled:opacity-40">
            Next ›
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Book List Tab ───────────────────────────────────────────────
function BookListTab() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'available' | 'borrowed' | 'returned' | undefined>(undefined)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const { data: booksData } = useAdminBooks({ q: search, status })
  const { mutate: deleteBook } = useDeleteBook()
  const books = booksData?.data?.books ?? []

  const statusFilters: { label: string; value: 'all' | 'available' | 'borrowed' | 'returned' | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Available', value: 'available' },
    { label: 'Borrowed', value: 'borrowed' },
    { label: 'Returned', value: 'returned' },
  ]

  const handleDelete = (id: number) => {
    if (!confirm('Delete this book?')) return
    deleteBook(id, {
      onSuccess: () => toast.success('Book deleted'),
      onError: () => toast.error('Failed to delete book'),
    })
    setOpenMenuId(null)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Book List</h1>

      <Button onClick={() => navigate('/admin/books/new')}
        className="w-full rounded-full py-6 font-semibold text-white"
        style={{ backgroundColor: 'var(--primary-300)' }}>
        Add Book
      </Button>

      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3 border border-gray-200">
        <Search size={16} className="text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search book" className="flex-1 text-sm bg-transparent outline-none text-gray-700" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map(({ label, value }) => (
          <button key={label} onClick={() => setStatus(value)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all"
            style={{
              backgroundColor: status === value ? 'var(--primary-200)' : 'white',
              borderColor: status === value ? 'var(--primary-300)' : '#e5e7eb',
              color: status === value ? 'var(--primary-300)' : '#374151',
            }}>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {books.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No books found</p>
        ) : books.map((book: any) => (
          <div key={book.id} className="flex items-start gap-3 py-4 border-b border-gray-100 relative">
            <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: 'var(--primary-200)' }}>📚</div>
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-300 text-gray-500">
                {book.category?.name}
              </span>
              <p className="text-sm font-bold text-gray-900">{book.title}</p>
              <p className="text-xs text-gray-500">{book.author?.name}</p>
              <div className="flex items-center gap-1">
                <Star size={12} fill="var(--accent-yellow)" color="var(--accent-yellow)" />
                <span className="text-xs font-semibold text-gray-700">{book.rating?.toFixed(1)}</span>
              </div>
            </div>

            <div className="relative">
              <button onClick={() => setOpenMenuId(openMenuId === book.id ? null : book.id)}
                className="p-1 text-gray-400">
                <MoreVertical size={18} />
              </button>
              {openMenuId === book.id && (
                <div className="absolute right-0 top-8 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-10 w-32">
                  <button onClick={() => { navigate(ROUTES.ADMIN_BOOK_PREVIEW(book.id)); setOpenMenuId(null) }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Preview
                  </button>
                  <button onClick={() => { navigate(ROUTES.ADMIN_BOOK_EDIT(book.id)); setOpenMenuId(null) }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(book.id)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    style={{ color: 'var(--accent-red)' }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('borrowed')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'borrowed', label: 'Borrowed List' },
    { key: 'user', label: 'User' },
    { key: 'books', label: 'Book List' },
  ]

  return (
    <div className="px-4 pt-4 pb-10 space-y-4">
      <div className="flex bg-gray-100 rounded-full p-1">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className="flex-1 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeTab === key ? 'white' : 'transparent',
              color: activeTab === key ? 'var(--primary-300)' : '#6b7280',
              boxShadow: activeTab === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'borrowed' && <BorrowedTab />}
      {activeTab === 'user' && <UserTab />}
      {activeTab === 'books' && <BookListTab />}
    </div>
  )
}