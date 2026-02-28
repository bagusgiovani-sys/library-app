import { createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  searchQuery: string
  activeFilter: string
  activeTab: string
}

const initialState: UIState = {
  searchQuery: '',
  activeFilter: 'all',
  activeTab: '',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setActiveFilter: (state, action: PayloadAction<string>) => {
      state.activeFilter = action.payload
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload
    },
  },
})

export const { setSearchQuery, setActiveFilter, setActiveTab } = uiSlice.actions
export default uiSlice.reducer