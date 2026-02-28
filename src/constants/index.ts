export const ENDPOINTS = {
  // Auth
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",

  // Books
  BOOKS: "/api/books",
  BOOK_DETAIL: (id: number) => `/api/books/${id}`,
  BOOKS_RECOMMEND: "/api/books/recommend",

  // Authors
  AUTHORS: "/api/authors",
  AUTHORS_POPULAR: "/api/authors/popular",
  AUTHOR_BOOKS: (id: number) => `/api/authors/${id}/books`,

  // Categories
  CATEGORIES: "/api/categories",

  // Cart
  CART: "/api/cart",
  CART_ITEMS: "/api/cart/items",
  CART_ITEM: (itemId: number) => `/api/cart/items/${itemId}`,
  CART_CHECKOUT: "/api/cart/checkout",

  // Loans
  LOANS: "/api/loans",
  LOANS_FROM_CART: "/api/loans/from-cart",
  LOANS_MY: "/api/loans/my",
  LOAN_RETURN: (id: number) => `/api/loans/${id}/return`,

  // Me
  ME: "/api/me",
  ME_LOANS: "/api/me/loans",
  ME_REVIEWS: "/api/me/reviews",

  // Reviews
  REVIEWS: "/api/reviews",
  REVIEWS_BOOK: (bookId: number) => `/api/reviews/book/${bookId}`,
  REVIEW: (id: number) => `/api/reviews/${id}`,

  // Admin
  ADMIN_OVERVIEW: "/api/admin/overview",
  ADMIN_BOOKS: "/api/admin/books",
  ADMIN_LOANS: "/api/admin/loans",
  ADMIN_LOAN: (id: number) => `/api/admin/loans/${id}`,
  ADMIN_LOANS_OVERDUE: "/api/admin/loans/overdue",
  ADMIN_USERS: "/api/admin/users",
};

export const QUERY_KEYS = {
  BOOKS: "books",
  BOOK_DETAIL: "bookDetail",
  BOOKS_RECOMMEND: "booksRecommend",
  AUTHORS: "authors",
  AUTHORS_POPULAR: "authorsPopular",
  AUTHOR_BOOKS: "authorBooks",
  CATEGORIES: "categories",
  CART: "cart",
  CART_CHECKOUT: "cartCheckout",
  LOANS_MY: "loansmy",
  ME: "me",
  ME_LOANS: "meLoans",
  ME_REVIEWS: "meReviews",
  REVIEWS_BOOK: "reviewsBook",
  ADMIN_OVERVIEW: "adminOverview",
  ADMIN_BOOKS: "adminBooks",
  ADMIN_LOANS: "adminLoans",
  ADMIN_LOANS_OVERDUE: "adminLoansOverdue",
  ADMIN_USERS: "adminUsers",
};

export const ROUTES = {
  // Auth
  LOGIN: "/login",
  ADMIN_LOGIN: "/login/admin",
  REGISTER: "/register",

  // User
  HOME: "/",
  BOOK_DETAIL: (id: number) => `/books/${id}`,
  CATEGORY: "/category",
  BOOKS_BY_AUTHOR: (id: number) => `/authors/${id}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  PROFILE: "/profile",
  PROFILE_BORROWED: "/profile?tab=borrowed",
  PROFILE_REVIEWS: "/profile?tab=reviews",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_BOOK_EDIT: (id: number) => `/admin/books/${id}/edit`,
  ADMIN_BOOK_PREVIEW: (id: number) => `/admin/books/${id}/preview`,

  // Borrow
  BORROW_SUCCESS: "/borrow-success",

  // Other
  NOT_FOUND: "*",
};
