import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

// const API = 'http://localhost:5555'
const API = 'https://proptech-app.onrender.com'

const ReviewSchema = Yup.object({
  reviewer_name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Your name is required'),
  rating: Yup.number()
    .typeError('Rating must be a number')
    .integer('Rating must be a whole number')
    .min(1, 'Minimum rating is 1')
    .max(5, 'Maximum rating is 5')
    .required('Rating is required'),
  comment: Yup.string()
    .min(10, 'Comment must be at least 10 characters')
    .required('Comment is required'),
})

const formatPrice = (price) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price)

const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating)

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  useEffect(() => {
    fetch(`${API}/properties/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Property not found')
        return res.json()
      })
      .then(data => { setProperty(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [id])

  function handleReviewSubmit(values, { setSubmitting, resetForm, setStatus }) {
    fetch(`${API}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, rating: Number(values.rating), property_id: Number(id) }),
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) { setStatus({ error: data.error || 'Failed to submit review' }); return }
        setProperty(prev => ({ ...prev, reviews: [...prev.reviews, data] }))
        setReviewSuccess(true)
        resetForm()
        setTimeout(() => setReviewSuccess(false), 4000)
      })
      .catch(() => setStatus({ error: 'Network error. Please try again.' }))
      .finally(() => setSubmitting(false))
  }

  if (loading) return (
    <div className="page">
      <div className="container">
        <div className="loading-state" style={{ paddingTop: 100 }}>
          <div className="spinner" />
          <span>Loading property...</span>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="page">
      <div className="container" style={{ paddingTop: 60 }}>
        <div className="error-state">{error}</div>
        <button className="btn-secondary" onClick={() => navigate('/')} style={{ display: 'inline-block', width: 'auto', padding: '12px 24px' }}>
          ← Back to Listings
        </button>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="container property-detail">
        <button className="detail-back" onClick={() => navigate(-1)}>
          ← Back to Listings
        </button>

        <div className="detail-grid">
          {/* Left: main content */}
          <div>
            <div className="detail-image">
              <img
                src={property.image_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                alt={property.title}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' }}
              />
            </div>

            <div style={{ marginTop: 36 }}>
              <div className="detail-meta-row">
                <span className="detail-estate">{property.estate}</span>
                <span style={{ color: 'var(--light)', fontSize: 11 }}>·</span>
                <span className="detail-city">{property.city}</span>
              </div>
              <h1 className="detail-title">{property.title}</h1>
              <div className="detail-price">
                {formatPrice(property.price)} <small>/ month</small>
              </div>
              <p className="detail-desc">{property.description}</p>
            </div>

            {/* Reviews */}
            <div className="reviews-section">
              <h2>Reviews ({property.reviews?.length || 0})</h2>

              {property.reviews?.length === 0 && (
                <p style={{ color: 'var(--light)', fontSize: 14, marginBottom: 32 }}>
                  No reviews yet. Be the first to leave one below.
                </p>
              )}

              <div className="reviews-list">
                {property.reviews?.map(r => (
                  <div key={r.id} className="review-item">
                    <div className="review-header">
                      <span className="review-author">{r.reviewer_name}</span>
                      <span className="review-stars">{renderStars(r.rating)}</span>
                    </div>
                    <p className="review-comment">{r.comment}</p>
                  </div>
                ))}
              </div>

              {/* Review form */}
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: 32 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 24, color: 'var(--dark)' }}>
                  Leave a Review
                </h3>

                {reviewSuccess && <div className="success-state">Your review has been submitted. Thank you!</div>}

                <Formik
                  initialValues={{ reviewer_name: '', rating: '', comment: '' }}
                  validationSchema={ReviewSchema}
                  onSubmit={handleReviewSubmit}
                >
                  {({ isSubmitting, status, errors, touched }) => (
                    <Form>
                      {status?.error && <div className="error-state">{status.error}</div>}

                      <div className="form-row" style={{ marginBottom: 20 }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Your Name</label>
                          <Field
                            name="reviewer_name"
                            className={`form-input ${errors.reviewer_name && touched.reviewer_name ? 'error' : ''}`}
                            placeholder="e.g. Jane Doe"
                          />
                          <ErrorMessage name="reviewer_name" component="div" className="form-error" />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Rating (1–5)</label>
                          <Field
                            name="rating"
                            type="number"
                            min="1"
                            max="5"
                            className={`form-input ${errors.rating && touched.rating ? 'error' : ''}`}
                            placeholder="e.g. 4"
                          />
                          <ErrorMessage name="rating" component="div" className="form-error" />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Comment</label>
                        <Field
                          as="textarea"
                          name="comment"
                          className={`form-textarea ${errors.comment && touched.comment ? 'error' : ''}`}
                          placeholder="Share your experience with this property..."
                          style={{ minHeight: 100 }}
                        />
                        <ErrorMessage name="comment" component="div" className="form-error" />
                      </div>

                      <button type="submit" className="form-submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="sidebar-card">
              <h3>Listed By</h3>
              {property.landlord && (
                <div className="landlord-info">
                  <div className="landlord-avatar">
                    {property.landlord.name.charAt(0)}
                  </div>
                  <div>
                    <div className="landlord-name">{property.landlord.name}</div>
                    <div className="landlord-label">Verified Landlord</div>
                  </div>
                </div>
              )}
              <div className="divider" />
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: 4 }}>Monthly Rent</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--dark)' }}>
                  {formatPrice(property.price)}
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: 4 }}>Location</div>
                <div style={{ fontSize: 14, color: 'var(--charcoal)' }}>{property.estate}, {property.city}</div>
              </div>
              <button className="btn-primary">Contact Landlord</button>
              <button className="btn-secondary" onClick={() => navigate('/')}>Browse More Properties</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}