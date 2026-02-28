import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return dayjs(date).format('D MMMM YYYY')
}

export function formatDateTime(date: string) {
  return dayjs(date).format('D MMMM YYYY, HH:mm')
}

export function formatDueDate(date: string) {
  return dayjs(date).format('DD MMM YYYY')
}

export function formatRelativeTime(date: string) {
  const diff = dayjs().diff(dayjs(date), 'day')
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return formatDate(date)
}