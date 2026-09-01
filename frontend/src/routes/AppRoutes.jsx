import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import CreateGroup from '../pages/CreateGroup/CreateGroup'
import GroupPage from '../pages/GroupPage/GroupPage'
import Availability from '../pages/Availability/Availability'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-group" element={<CreateGroup />} />
      <Route path="/group/:groupId" element={<GroupPage />} />
      <Route
        path="/group/:groupId/availability"
        element={<Availability />}
      />
    </Routes>
  )
}

export default AppRoutes