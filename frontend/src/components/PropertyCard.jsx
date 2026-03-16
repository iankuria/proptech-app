import { useNavigate } from 'react-router-dom'

export default function PropertyCard({ property }) {
  const navigate = useNavigate()

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price)

  return (
    <div className="property-card" onClick={() => navigate(`/properties/${property.id}`)}>
      <div className="card-image">
        <img
          src={property.image_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
          alt={property.title}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' }}
        />
        <div className="card-badge">{property.estate}</div>
      </div>
      <div className="card-body">
        <div className="card-location">{property.city} · {property.estate}</div>
        <h3 className="card-title">{property.title}</h3>
        <p className="card-desc">{property.description}</p>
        <div className="card-footer">
          <div className="card-price">
            {formatPrice(property.price)}
            <span>per month</span>
          </div>
          <button className="btn-view">View Details</button>
        </div>
      </div>
    </div>
  )
}