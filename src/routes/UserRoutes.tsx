import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import { ROUTES } from '@/constants'
import UserLayout from '@/components/layout/UserLayout'
import Home from '@/pages/user/Home'
import BookDetail from '@/pages/user/BookDetail'
import Category from '@/pages/user/Category'
import BooksByAuthor from '@/pages/user/BooksByAuthor'
import Cart from '@/pages/user/Cart'
import Checkout from '@/pages/user/Checkout'
import Profile from '@/pages/user/Profile'

export default function UserRoutes() {
  const { token } = useSelector((state: RootState) => state.auth)

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return (
    <UserLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="books/:id" element={<BookDetail />} />
        <Route path="category" element={<Category />} />
        <Route path="authors/:id" element={<BooksByAuthor />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </UserLayout>
  )
}