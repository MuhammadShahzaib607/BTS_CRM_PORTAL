import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MyLeads from './pages/MyLeads'
import AddFollowUp from './pages/AddFollowUp'
import EditFollowUp from './pages/EditFollowUp'
import CreateLead from './pages/CreateLead'
import EditLead from './pages/EditLead'
import Profile from './pages/Profile'
import AllLeads from './pages/AllLeads'
import UsersList from './pages/UsersList'
import PrivateRoutes from './routes/PrivateRoutes'
import AuthRoutes from './routes/AuthRoutes'
import AdminRoutes from './routes/AdminRoutes'
import UserLead from './pages/UserLead'

function App() {



  return (
    <>
      <Routes>
        <Route element={<AuthRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/my-leads" element={<MyLeads />} />
          <Route path="/add-follow-up/:leadId" element={<AddFollowUp />} />
          <Route path="/edit-followup/:leadId/:followupId" element={<EditFollowUp />} />
          <Route path="/create-lead" element={<CreateLead />} />
          <Route path="/edit-lead/:leadId" element={<EditLead />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoutes />}>
          <Route path="/all-leads" element={<AllLeads />} />
        <Route path="/all-users" element={<UsersList />} />
        <Route path="/user-lead/:userId" element={<UserLead />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
