import { createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  id: number
  bookId: number
  book: {
    id: number
    title: string
    coverImage: string | null
    author: {
      id: number
      name: string
    }
    category: {
      id: number
      name: string
    }
  }
}

interface CartState {
  items: CartItem[]
  itemCount: number
}

const initialState: CartState = {
  items: [],
  itemCount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<{ items: CartItem[]; itemCount: number }>) => {
      state.items = action.payload.items
      state.itemCount = action.payload.itemCount
    },
    clearCart: (state) => {
      state.items = []
      state.itemCount = 0
    },
  },
})

export const { setCart, clearCart } = cartSlice.actions
export default cartSlice.reducer