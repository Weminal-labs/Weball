// import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const Layout = () => {
  return (
    <div style={{
      backgroundImage: "url('../public/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      width: "100%",
      height: "100vh",
      overflow: "hidden",

    }}>
      <Header />
      <Outlet></Outlet>
    </div>
  )
}

export default Layout
