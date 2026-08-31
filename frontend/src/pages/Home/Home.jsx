import './Home.css'
import { Link } from 'react-router-dom'

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
            Create a group
          </Link>
          <button className="secondary-button">Join a group</button>
        </div>
      </section>

      <section className="steps">
        <div className="step-card">
          <span>01</span>
          <h3>Create</h3>
          <p>Set up your group and meeting preferences.</p>
        </div>

        <div className="step-card">
          <span>02</span>
          <h3>Share</h3>
          <p>Send one simple link to everyone.</p>
        </div>

        <div className="step-card">
          <span>03</span>
          <h3>Meet</h3>
          <p>See the times that work best for the group.</p>
        </div>
      </section>
    </main>
  )
}

export default Home