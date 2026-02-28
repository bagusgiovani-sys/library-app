import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { useRegister } from '@/hooks/useAuth'
import { ROUTES } from '@/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logo from '@/assets/images/Logo.svg'

export default function Register() {
  const navigate = useNavigate()
  const { mutate: register, isPending } = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    register(
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      },
      {
        onSuccess: () => {
          toast.success('Account created! Please login.')
          navigate(ROUTES.LOGIN)
        },
        onError: () => toast.error('Registration failed. Try again.'),
      }
    )
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-16 pb-10" style={{ backgroundColor: 'var(--primary-100)' }}>
      <div className="flex items-center gap-2 mb-12">
        <img src={logo} alt="Booky" className="w-8 h-8" />
        <span className="text-xl font-bold" style={{ color: 'var(--primary-300)' }}>Booky</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">Create Account</h1>
      <p className="text-sm mb-8" style={{ color: '#888' }}>Fill in your details to get started.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 font-semibold">Name</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="h-12 rounded-xl bg-white border-0 shadow-sm"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="h-12 rounded-xl bg-white border-0 shadow-sm"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-700 font-semibold">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="h-12 rounded-xl bg-white border-0 shadow-sm"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              className="h-12 rounded-xl bg-white border-0 shadow-sm pr-12"
              placeholder="Enter your password"
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              className="h-12 rounded-xl bg-white border-0 shadow-sm pr-12"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--primary-300)' }}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-xl font-semibold mt-2 border-0"
          style={{ backgroundColor: 'var(--primary-300)', color: 'white' }}
        >
          {isPending ? 'Creating account...' : 'Register'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold" style={{ color: 'var(--primary-300)' }}>
          Login
        </Link>
      </p>
    </div>
  )
}