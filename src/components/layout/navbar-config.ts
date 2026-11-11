import {
  Building2,
  SlidersHorizontal,
  Layers,
  ShieldCheck,
  Compass,
  Users,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon?: LucideIcon
}

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { href: '/buyer/properties', label: 'Katalog Hunian', icon: Building2 },
  { href: '/metrics', label: 'Metrik', icon: Layers },
  { href: '/living-pillars', label: 'Keunggulan', icon: Compass },
  { href: '/architecture', label: 'Koleksi', icon: Building2 },
]

export const getDashboardNavItems = (role: 'buyer' | 'seller' | 'admin'): NavItem[] => {
  switch (role) {
    case 'buyer':
      return [
        { href: '/buyer/properties', label: 'Katalog Hunian', icon: Building2 },
        { href: '/buyer/compare', label: 'Komparasi', icon: SlidersHorizontal },
      ]
    case 'seller':
      return [
        { href: '/seller', label: 'Ringkasan', icon: Layers },
        { href: '/seller/listings', label: 'Kelola Listing', icon: Building2 },
        { href: '/seller/inquiries', label: 'Inquiry Masuk', icon: MessageSquare },
      ]
    case 'admin':
      return [
        { href: '/admin', label: 'Ringkasan', icon: Layers },
        { href: '/admin/approvals', label: 'Kurasi Approval', icon: ShieldCheck },
        { href: '/admin/users', label: 'Kelola Pengguna', icon: Users },
        { href: '/admin/inquiries', label: 'Inquiry Platform', icon: MessageSquare },
      ]
  }
}

export const ROLE_LABELS: Record<'buyer' | 'seller' | 'admin', string> = {
  buyer: 'Buyer Space',
  seller: 'Seller Space',
  admin: 'Admin Control',
}
