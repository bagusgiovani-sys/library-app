import UserNavbar from '@/components/layout/UserNavbar'
import UserFooter from './UserFooter'
import { User } from 'lucide-react'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--primary-100)' }}>
      <UserNavbar />
      <main className="max-w-screen-xl mx-auto px-4 pb-10">
        {children}
      </main>
      <UserFooter />
    </div>
  )
}