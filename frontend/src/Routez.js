import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import CreateGig from './components/CreateGig'
import UserDashboard from './components/UserDashboard'
import Register from './components/Register'
import Login from './components/Login'
import Chat from './components/Chat'
import GigInfo from './components/GigInfo'
import FilteredGigs from './components/FilteredGigs'
import UserProfile from './components/UserProfile'


export default function Routez() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/search/:searchQuery' element={<FilteredGigs/>}/>
        <Route path='/create-ad' element={<CreateGig/>}/>
        <Route path='/user-dashboard' element={<UserDashboard/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/adinfo/:id/:userid' element={<GigInfo/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/user-profile/:user_id' element={<UserProfile/>}/>
      </Routes>
    </div>
  )
}
