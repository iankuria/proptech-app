import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'

// const API = 'http://localhost:5555'
const API = 'https://proptech-app.onrender.com'

export default function Home() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [estate, setEstate] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchProperties()
  }, [city, estate])

  function fetchProperties() {
    setLoading(true)
    const params = new URLSearchParams()
    if (city) params.append('city', city)
    if (estate) params.append('estate', estate)

    fetch(`${API}/properties?${params}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch properties')
        return res.json()
      })
      .then(data => { setProperties(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }

  function handleHeroSearch(e) {
    e.preventDefault()
    setEstate(search)
  }

  const filtered = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase()) ||
    p.estate.toLowerCase().includes(search.toLowerCase())
  )

  const cities = [...new Set(properties.map(p => p.city))]
  const estates = [...new Set(properties.map(p => p.estate))]

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-texture" />
        <div className="container hero-content">
          <div className="hero-eyebrow">Premium Property Listings</div>
          <h1>Find Your <em>Perfect</em> Space in Nairobi</h1>
          <p className="hero-sub">
            Browse curated properties from trusted landlords across the city's finest estates.
          </p>
          <form className="search-bar" onSubmit={handleHeroSearch}>
            <input
              type="text"
              placeholder="Search by estate, city or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      {/* Listings */}
      <section style={{ padding: '64px 0 100px' }}>
        <div className="container">
          {/* Section header */}
          <div className="section-header">
            <div>
              <div className="section-label">Available Now</div>
              <h2 className="section-title">Property Listings</h2>
            </div>
            <div className="section-count">
              {!loading && `${filtered.length} propert${filtered.length !== 1 ? 'ies' : 'y'} found`}
            </div>
          </div>

          {/* Filters */}
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search title, city or estate..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select value={city} onChange={e => setCity(e.target.value)}>
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={estate} onChange={e => setEstate(e.target.value)}>
              <option value="">All Estates</option>
              {estates.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            {(city || estate || search) && (
              <button
                onClick={() => { setCity(''); setEstate(''); setSearch('') }}
                style={{ padding: '10px 16px', background: 'none', border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer', color: 'var(--mid)' }}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Error */}
          {error && <div className="error-state">{error}</div>}

          {/* Loading */}
          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <span>Loading listings...</span>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filtered.length === 0 && (
            <div className="empty-state">
              <h3>No properties found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="property-grid">
              {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}

          {/* CTA */}
          {!loading && (
            <div style={{ textAlign: 'center', marginTop: 64 }}>
              <p style={{ color: 'var(--mid)', marginBottom: 16, fontSize: 14 }}>
                Are you a landlord or developer?
              </p>
              <button className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '14px 36px' }} onClick={() => navigate('/add')}>
                List Your Property
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}