import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { PopularAuthor } from '@/types/author'

interface AuthorCardProps {
  author: PopularAuthor
  onClick: () => void
}

export default function AuthorCard({ author, onClick }: AuthorCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 min-w-[80px]"
    >
      <Avatar className="w-16 h-16">
        <AvatarImage src="" />
        <AvatarFallback
          className="text-lg font-bold"
          style={{ backgroundColor: 'var(--primary-200)', color: 'var(--primary-300)' }}
        >
          {author.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <p className="text-xs font-semibold text-gray-700 text-center w-20 line-clamp-2">
        {author.name}
      </p>
    </button>
  )
}