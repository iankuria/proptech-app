import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const API = 'http://localhost:5555'

const PropertySchema = Yup.object({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be 100 characters or fewer')
    .required('Title is required'),

  description: Yup.string()
    .min(20, 'Description must be at least 20 characters')
    .required('Description is required'),

  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be a positive number')
    .required('Price is required'),

  city: Yup.string()
    .min(2, 'City must be at least 2 characters')
    .required('City is required'),

  estate: Yup.string()
    .min(2, 'Estate must be at least 2 characters')
    .required('Estate is required'),

  image_url: Yup.string()
    .url('Must be a valid URL (e.g. https://...)')
    .nullable(),

  landlord_id: Yup.number()
    .typeError('Please select a landlord')
    .required('Please select a landlord'),
})

export default function AddProperty() {
  const navigate = useNavigate()
  const [landlords, setLandlords] = useState([])
  const [loadingLandlords, setLoadingLandlords] = useState(true)

  useEffect(() => {
    fetch(`${API}/landlords`)
      .then(res => res.json())
      .then(data => { setLandlords(data); setLoadingLandlords(false) })
      .catch(() => setLoadingLandlords(false))
  }, [])

  function handleSubmit(values, { setSubmitting, setStatus }) {
    const payload = { ...values, price: Number(values.price), landlord_id: Number(values.landlord_id) }

    fetch(`${API}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) { setStatus({ error: data.error || 'Failed to create listing.' }); return }
        navigate(`/properties/${data.id}`)
      })
      .catch(() => setStatus({ error: 'Network error. Please try again.' }))
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="page">
      <div className="container form-page">
        <div className="form-header">
          <div className="section-label">List a Property</div>
          <h1>Add Your Listing</h1>
          <p>Fill in the details below to list your property on PropTech. All fields marked as required must be completed.</p>
        </div>

        <div className="form-layout">
          {/* Form */}
          <Formik
            initialValues={{
              title: '',
              description: '',
              price: '',
              city: '',
              estate: '',
              image_url: '',
              landlord_id: '',
            }}
            validationSchema={PropertySchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status, errors, touched }) => (
              <Form>
                <div className="form-card">
                  {status?.error && <div className="error-state">{status.error}</div>}

                  {/* Title */}
                  <div className="form-group">
                    <label className="form-label">Property Title *</label>
                    <Field
                      name="title"
                      className={`form-input ${errors.title && touched.title ? 'error' : ''}`}
                      placeholder="e.g. Modern 3-Bedroom Apartment in Westlands"
                    />
                    <ErrorMessage name="title" component="div" className="form-error" />
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <Field
                      as="textarea"
                      name="description"
                      className={`form-textarea ${errors.description && touched.description ? 'error' : ''}`}
                      placeholder="Describe the property — size, features, nearby amenities..."
                    />
                    <ErrorMessage name="description" component="div" className="form-error" />
                  </div>

                  {/* Price + Landlord */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Monthly Rent (KES) *</label>
                      <Field
                        name="price"
                        type="number"
                        className={`form-input ${errors.price && touched.price ? 'error' : ''}`}
                        placeholder="e.g. 85000"
                      />
                      <ErrorMessage name="price" component="div" className="form-error" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Landlord *</label>
                      <Field
                        as="select"
                        name="landlord_id"
                        className={`form-select ${errors.landlord_id && touched.landlord_id ? 'error' : ''}`}
                        disabled={loadingLandlords}
                      >
                        <option value="">
                          {loadingLandlords ? 'Loading...' : 'Select a landlord'}
                        </option>
                        {landlords.map(l => (
                          <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="landlord_id" component="div" className="form-error" />
                    </div>
                  </div>

                  {/* City + Estate */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <Field
                        name="city"
                        className={`form-input ${errors.city && touched.city ? 'error' : ''}`}
                        placeholder="e.g. Nairobi"
                      />
                      <ErrorMessage name="city" component="div" className="form-error" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Estate *</label>
                      <Field
                        name="estate"
                        className={`form-input ${errors.estate && touched.estate ? 'error' : ''}`}
                        placeholder="e.g. Westlands"
                      />
                      <ErrorMessage name="estate" component="div" className="form-error" />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="form-group">
                    <label className="form-label">Image URL <span style={{ color: 'var(--light)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                    <Field
                      name="image_url"
                      className={`form-input ${errors.image_url && touched.image_url ? 'error' : ''}`}
                      placeholder="https://example.com/image.jpg"
                    />
                    <ErrorMessage name="image_url" component="div" className="form-error" />
                  </div>

                  <button type="submit" className="form-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting Listing...' : 'Publish Property Listing'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Tips sidebar */}
          <div className="form-tips">
            <div className="tip-card">
              <h3>Listing Tips</h3>
              <ul className="tip-list">
                <li>Use a clear, descriptive title that mentions the property type and location.</li>
                <li>Include the number of bedrooms, bathrooms, and key amenities in your description.</li>
                <li>Set a competitive price — check similar listings in your estate.</li>
                <li>A high-quality image significantly increases enquiry rates.</li>
                <li>Make sure the estate and city are accurate so seekers can find your listing.</li>
              </ul>
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: 28 }}>
              <div className="section-label" style={{ marginBottom: 12 }}>Not a landlord yet?</div>
              <p style={{ fontSize: 13, color: 'var(--mid)', lineHeight: 1.7, marginBottom: 16 }}>
                To list a property, you need to be registered as a landlord. Contact our support team to get set up.
              </p>
              <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, letterSpacing: '0.06em' }}>
                support@proptech.co.ke
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}