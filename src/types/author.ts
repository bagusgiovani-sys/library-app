export interface Author {
  id: number
  name: string
  bio: string | null
}

export interface PopularAuthor extends Author {
  bookCount: number
  accumulatedScore: number
}