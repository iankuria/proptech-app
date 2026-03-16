import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="page">
      {/* Hero */}
      <section className="about-hero">
        <div className="hero-texture" />
        <div className="container about-hero-content">
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'block', width: 32, height: 1, background: 'var(--accent)' }} />
            About PropTech
          </div>
          <h1>A <em>Better</em> Way to Find Property in Nairobi</h1>
          <p>
            PropTech is a centralized property listing platform connecting serious property
            seekers with verified landlords and developers across Nairobi's finest estates.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-card">
              <div className="about-card-num">01</div>
              <h3>Our Mission</h3>
              <p>
                We believe finding a home should be simple, transparent, and stress-free.
                PropTech removes the noise and connects you directly with the right properties
                in the right locations — all in one place.
              </p>
            </div>
            <div className="about-card">
              <div className="about-card-num">02</div>
              <h3>For Property Seekers</h3>
              <p>
                Browse hundreds of verified listings, filter by city and estate, read honest
                reviews from previous tenants, and make informed decisions before you visit.
              </p>
            </div>
            <div className="about-card">
              <div className="about-card-num">03</div>
              <h3>For Landlords</h3>
              <p>
                List your property in minutes, reach thousands of active seekers, and manage
                your listings from a simple, intuitive dashboard. No middlemen, no hidden fees.
              </p>
            </div>
            <div className="about-card">
              <div className="about-card-num">04</div>
              <h3>Built for Nairobi</h3>
              <p>
                From Westlands to Karen, Runda to the CBD — PropTech is purpose-built for
                Nairobi's unique property market, with local knowledge baked into every feature.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', paddingTop: 16 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Get Started</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: 20, color: 'var(--dark)' }}>
              Ready to find your space?
            </h2>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '14px 36px' }} onClick={() => navigate('/')}>
                Browse Listings
              </button>
              <button className="btn-secondary" style={{ display: 'inline-block', width: 'auto', padding: '14px 36px' }} onClick={() => navigate('/add')}>
                List a Property
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}