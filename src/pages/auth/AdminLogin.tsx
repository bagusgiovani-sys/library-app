import { useState } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { useLogin } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logo from '@/assets/images/Logo.svg'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(
      { email, password },
      {
        onSuccess: () => toast.success('Welcome, Admin!'),
        onError: () => toast.error('Wrong email or password'),
      }
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:justify-center px-6 pt-16 md:pt-0"
      style={{ backgroundColor: 'var(--primary-100)' }}>
      
      {/* Card wrapper for PC */}
      <div className="w-full max-w-sm md:bg-white md:rounded-3xl md:shadow-lg md:p-10">
        <div className="flex items-center gap-2 mb-12">
          <img src={logo} alt="Booky" className="w-8 h-8" />
          <span className="text-xl font-bold" style={{ color: 'var(--primary-300)' }}>Booky</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Login</h1>
        <p className="text-sm mb-8" style={{ color: '#888' }}>Sign in to manage the library system.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl bg-white border-0 shadow-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl bg-white border-0 shadow-sm pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--primary-300)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl font-semibold mt-2 border-0"
            style={{ backgroundColor: 'var(--primary-300)', color: 'white' }}
          >
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  )
}