import { create } from 'zustand'

interface FavoritesState {
  ids: number[]
  compareIds: number[]
  toggle: (id: number) => void
  toggleCompare: (id: number) => void
  clearCompare: () => void
}

const limitCompare = 3
const STORAGE_KEY = 'habitat-favorites'

function loadIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveIds(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
  ids: loadIds(),
  compareIds: [],
  toggle: (id) => set((state) => {
    const next = state.ids.includes(id) ? state.ids.filter((item) => item !== id) : [...state.ids, id]
    saveIds(next)
    return { ids: next }
  }),
  toggleCompare: (id) => set((state) => {
    if (state.compareIds.includes(id)) return { compareIds: state.compareIds.filter((item) => item !== id) }
    if (state.compareIds.length >= limitCompare) return state
    return { compareIds: [...state.compareIds, id] }
  }),
  clearCompare: () => set({ compareIds: [] }),
}))
