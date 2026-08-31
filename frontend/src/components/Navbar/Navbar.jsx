import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        WeCanMeet
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <a href="#how-it-works">How it works</a>
      </div>
    </nav>
  )
}

export default Navbar