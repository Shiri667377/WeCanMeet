import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import CreateGroup from '../pages/CreateGroup/CreateGroup'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-group" element={<CreateGroup />} />
    </Routes>
  )
}

export default AppRoutes