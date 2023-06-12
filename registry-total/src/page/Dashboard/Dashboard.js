import React from 'react'
import { useState } from 'react'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import DashboardLayout from '../../layout/Dashboard/DashboardLayout'
import './Dashboard.css'
import Modal from '@mui/material/Modal';
import Footer from '../../components/Footer/Footer'

export default function Dashboard() {
  const [sideBar, setSideBar] = useState(false)
  return (
    <>
      <div className='container'>
        {sideBar &&
        <Modal open={sideBar} onClose={() => setSideBar(false)}>
          <Sidebar/>
        </Modal>
        
        }
        <div className="sidebar-container">
          <Sidebar/>
        </div>
        <div className='main-content'>

            <Navigation sideBar={sideBar} setSideBar={setSideBar}/>
            <DashboardLayout/>
        </div>
      </div>
      <Footer/>
    </>
  )
}
