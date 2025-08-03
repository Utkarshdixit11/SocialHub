import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import "./home.css"
import { assets } from "../../../assets/assets.js";

const home = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()
    const [active, setActive] = useState(() => {
        const path = location.pathname
        if (path === '/home') return 'home'
        if (path === '/post') return 'post'
        return 'home'
    })

    const handleActive = (event) => {
        const name = event.target.name;
        setActive(name)
        if (name === 'home') {
            navigate('/home')
        } else if (name === 'post') {
            navigate('/post')
        } else if (name === 'profile') {
            navigate('/profile')
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

  return (
    <div className='home'>
        <div className='dashboard'>
            <h3>Dashboard</h3>
            <p>Welcome, {user?.name || 'User'}!</p>
            <img src={assets.profile} alt="" className='profilepic'></img>
            <p className='list'>
                <button onClick={handleActive} className={active === "home" ? "active" : ""} name="home">Home</button>
                <button onClick={handleActive} className={active === "profile" ? "active" : ""} name="profile">Profile</button>
                <button onClick={handleActive} className={active === "post" ? "active" : ""} name="post">Post</button>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </p>
        </div>
    </div>
  )
}

export default home
