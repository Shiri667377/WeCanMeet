import Navbar from './components/Navbar/Navbar'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <AppRoutes />
    </div>
  )
}

export default App