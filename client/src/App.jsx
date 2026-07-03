import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import Profile from './pages/Profile'
import { Toaster } from "react-hot-toast"
import { toastConfig } from './lib/utils'
import { useAuth } from '../context/AuthContext'
import bgImage from "./assets/bgImage.svg"

const App = () => {
  const { authUser, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1a1a1a] text-white">
        <div className="text-center">
          <p className="text-xl font-semibold animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-cover'
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to={"/login"} />} />
      </Routes>
      <Toaster {...toastConfig} />
    </div>
  )
}

export default App