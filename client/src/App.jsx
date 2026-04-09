import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MyLeads from './pages/MyLeads'
import AddFollowUp from './pages/AddFollowUp'
import EditFollowUp from './pages/EditFollowUp'
import CreateLead from './pages/CreateLead'
import EditLead from './pages/editLead'
import Profile from './pages/Profile'
import AllLeads from './pages/AllLeads'
import UsersList from './pages/UsersList'

function App() {



  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<Signup />}/>

      <Route path="/" element={<Home />}/>
      <Route path="/my-leads" element={<MyLeads />}/>
      <Route path="/add-follow-up/:leadId" element={<AddFollowUp />}/>
      <Route path="/edit-followup/:leadId/:followupId" element={<EditFollowUp />}/>
      <Route path="/create-lead" element={<CreateLead />}/>
      <Route path="/edit-lead/:leadId" element={<EditLead />}/>
      <Route path="/profile" element={<Profile />}/>

      <Route path="/all-leads" element={<AllLeads />}/>
      <Route path="/all-users" element={<UsersList />}/>
    </Routes>
    </>
  )
}

export default App
