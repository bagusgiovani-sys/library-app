export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  profilePhoto: string | null
  role: 'ADMIN' | 'USER'
  createdAt: string
}

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  profilePhoto?: string
}