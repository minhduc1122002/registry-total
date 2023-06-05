import React from 'react'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import DashboardLayout from '../../layout/Dashboard/DashboardLayout'
import './Dashboard.css'

export default function Dashboard() {
  return (
    <>
    <div className='container'>
      <Sidebar/>
      <div className='dashboard'>
          <Navigation/>
          <DashboardLayout/>
      </div>
    </div>
    </>
  )
}
