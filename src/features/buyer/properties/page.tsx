import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { propertyApi } from '@/services/property-api'
import type { Property } from '@/services/property-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true)
        const data = await propertyApi.getProperties()
        setProperties(data.properties)
      } catch (err) {
        console.error('Failed to fetch properties', err)
        setError('Failed to load properties. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPropertyImage = (property: Property) => {
    if (property.images && property.images.length > 0) {
      return property.images[0].url.startsWith('http') 
        ? property.images[0].url 
        : `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}${property.images[0].url}`
    }
    return '/placeholder-property.svg'
  }

  if (isLoading) {
    return (
      <div className="grid place-items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid place-items-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-destructive mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Unable to Load Properties</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Property Listings</h1>
          <p className="text-muted-foreground mt-1">
            Discover {properties.length} available {properties.length === 1 ? 'property' : 'properties'}
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <svg 
            className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-lg font-medium mb-2">No Properties Available</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              There are currently no properties available. Check back later or contact support.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link
              key={property.id}
              to={`/buyer/properties/${property.id}`}
              className="group block"
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                  <img 
                    src={getPropertyImage(property)} 
                    alt={property.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-property.svg';
                    }}
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {formatPrice(property.price)}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1112.829-12.182" />
                      </svg>
                      {property.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4 0h1m-5-4v4m3 0v4" />
                      </svg>
                      {property.bedrooms} bed
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {property.areaSqft} sqft
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full
                      ${property.status === 'available' ? 'bg-green-100 text-green-800' :
                         property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                         property.status === 'sold' ? 'bg-red-100 text-red-800' :
                         'bg-gray-100 text-gray-800'}
                    }`}
                    >
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {property.city}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
