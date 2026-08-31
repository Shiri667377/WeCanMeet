import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        WeCanMeet
      </NavLink>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Home
        </NavLink>

        <a href="#how-it-works" className="nav-link">
          How it works
        </a>
      </div>
    </nav>
  )
}

export default Navbar