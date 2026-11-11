import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { propertyApi, type Property } from '@/services/property-api'
import { useFavoritesStore } from '@/stores/favorites-store'

import { HeroSection, MetricBanner, BentoFeatures, FeaturedProperties, ClosingCTA } from './components'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)

const propertyImage = (property: Property) => {
  const image = property.images[0]?.url
  if (!image) {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
  }
  return image.startsWith('http') ? image : 'http://localhost:3001' + image
}

const ROUTE_SECTION_MAP: Record<string, string[]> = {
  '/metrics': ['metrics'],
  '/living-pillars': ['living-pillars', 'bento'],
  '/bento': ['living-pillars', 'bento'],
  '/architecture': ['architecture'],
}

export default function LandingPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedType, setSelectedType] = useState<string>('all')
  const [locationQuery, setLocationQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const { ids: favoriteIds, toggle: toggleFavorite, compareIds, toggleCompare } = useFavoritesStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const targetIds = ROUTE_SECTION_MAP[location.pathname]
    if (targetIds && targetIds.length > 0) {
      const scrollTimeout = setTimeout(() => {
        for (const id of targetIds) {
          const target = document.getElementById(id)
          if (target) {
            const yOffset = -90
            const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
            break
          }
        }
      }, 100)
      return () => clearTimeout(scrollTimeout)
    }
  }, [location.pathname, properties])

  useEffect(() => {
    propertyApi
      .getProperties()
      .then((data) => setProperties(data.properties))
      .catch(() => setProperties([]))
  }, [])

  const filteredProperties = properties.filter((p) => {
    // Landing publik hanya menampilkan properti yang sudah 'available'
    if (p.status !== 'available') return false

    const matchType = selectedType === 'all' || p.propertyType.toLowerCase() === selectedType.toLowerCase()
    const matchLocation =
      !locationQuery ||
      p.title.toLowerCase().includes(locationQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(locationQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(locationQuery.toLowerCase())
    const matchCity = !selectedCity || p.city.toLowerCase() === selectedCity.toLowerCase()
    return matchType && matchLocation && matchCity
  })

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/buyer/properties?search=${encodeURIComponent(locationQuery)}&city=${encodeURIComponent(selectedCity)}`)
  }

  return (
    <div className="bg-canvas min-h-screen text-dark font-sans selection:bg-accent selection:text-dark overflow-x-hidden">
      <HeroSection
        locationQuery={locationQuery}
        selectedCity={selectedCity}
        onLocationChange={setLocationQuery}
        onCityChange={setSelectedCity}
        onSearch={handleHeroSearch}
      />
      <MetricBanner />
      <BentoFeatures />
      <FeaturedProperties
        properties={filteredProperties}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        favoriteIds={favoriteIds}
        compareIds={compareIds}
        onToggleFavorite={toggleFavorite}
        onToggleCompare={toggleCompare}
        formatPrice={formatPrice}
        propertyImage={propertyImage}
      />
      <ClosingCTA />
    </div>
  )
}