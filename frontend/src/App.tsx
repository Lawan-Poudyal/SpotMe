import './App.css'
import {Route, Routes, Navigate} from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { PageNotFound } from './pages/PageNotFound'
import Dashboard from './pages/Dashboard'
import HomePage from './pages/HomePage'
function App() {

  return (
     <Routes>
	<Route path="/dashboard" element={<Dashboard/>}>
	    <Route index element={<Navigate to="home"/>}/>
	    <Route path="home" element={<HomePage/>}/>
	</Route>
	<Route path="/login" element={<LoginPage loggedIn={true}/>}/>
	<Route path="/signup" element={<LoginPage loggedIn={false}/>}/>
	<Route path="/" element={<Navigate to="/dashboard" replace/>}/>
	<Route path="*" element={<PageNotFound/>}/>
     </Routes> 
  )
}

export default App
