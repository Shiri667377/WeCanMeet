import './Home.css'
import { Link } from 'react-router-dom'
import { FiPlusCircle, FiShare2, FiUsers } from 'react-icons/fi'

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <p className="eyebrow">Simple group scheduling</p>

        <h1>
          Find a time that
          <span> works for everyone.</span>
        </h1>

        <p className="hero-description">
          Create a group, share the link, collect everyone's availability,
          and find the best time to meet.
        </p>

        <div className="hero-actions">
          <Link to="/create-group" className="primary-button">
            <FiPlusCircle className="button-icon" />
            Create a group
          </Link>
          <button className="secondary-button">Join a group</button>
        </div>
      </section>
      <section id="how-it-works" className="steps">
        <div className="step-card">
          <div className="step-title">
            <FiPlusCircle className="step-icon" />
            <h3>Create</h3>
          </div>

          <p>Set up your group and meeting preferences.</p>
        </div>

        <div className="step-arrow">→</div>

        <div className="step-card">
          <div className="step-title">
            <FiShare2 className="step-icon" />
            <h3>Share</h3>
          </div>

          <p>Send one simple link to everyone.</p>
        </div>

        <div className="step-arrow">→</div>

        <div className="step-card">
          <div className="step-title">
            <FiUsers className="step-icon" />
            <h3>Meet</h3>
          </div>

          <p>See the times that work best for the group.</p>
        </div>
      </section>
    </main>
  )
}

export default Home