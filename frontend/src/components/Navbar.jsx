import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          Prop<span>Tech</span>
        </NavLink>
        <ul className="navbar-links">
          <li><NavLink to="/" end>Listings</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li>
            <NavLink to="/add" className="navbar-cta">
              List a Property
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}