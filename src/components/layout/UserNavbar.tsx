import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, LogOut, User, BookOpen } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import { useLogout } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { ROUTES } from '@/constants'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import logo from '@/assets/images/logo.svg'

export default function UserNavbar() {
  const navigate = useNavigate()
  const logout = useLogout()
  const { user } = useSelector((state: RootState) => state.auth)
  const { data: cart } = useCart()

  return (
    <nav
      className="sticky top-0 z-50 w-full px-5 py-4 flex items-center justify-between"
      style={{ backgroundColor: 'var(--primary-100)' }}
    >
      <Link to={ROUTES.HOME} className="flex items-center gap-2">
        <img src={logo} alt="Booky" className="w-8 h-8" />
        <span className="hidden sm:block text-lg font-bold" style={{ color: 'var(--primary-300)' }}>
          Booky
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/search')} className="text-gray-600">
          <Search size={22} />
        </button>

        <Link to={ROUTES.CART} className="relative text-gray-600">
          <ShoppingBag size={22} />
          {cart?.itemCount > 0 && (
            <span
              className="absolute -top-2 -right-2 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
              style={{ backgroundColor: 'var(--accent-red)' }}
            >
              {cart.itemCount}
            </span>
          )}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-none">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profilePhoto ?? ''} />
                <AvatarFallback style={{ backgroundColor: 'var(--primary-200)', color: 'var(--primary-300)' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)}>
              <User size={16} className="mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE_BORROWED)}>
              <BookOpen size={16} className="mr-2" />
              Borrowed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE_REVIEWS)}>
              <BookOpen size={16} className="mr-2" />
              Reviews
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={logout}
              style={{ color: 'var(--accent-red)' }}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}