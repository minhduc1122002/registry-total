import React from 'react'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import { useEffect, useState } from "react";
import { getUserList } from '../../redux/user'
import { useDispatch, useSelector } from 'react-redux'
import CenterLayout from '../../layout/Center/CenterLayout'
import Modal from '@mui/material/Modal';
import { ToastContainer, toast } from 'react-toastify'
import Footer from '../../components/Footer/Footer'
import SingleCenter from '../../components/Single/Center/SingleCenter';

export default function Center() {
    const dispatch = useDispatch()
    const users = useSelector(state => state.user.users)
    const [sideBar, setSideBar] = useState(false)
    const username = window.location.pathname.split("/")[2]
    const user = users.find((user) => user.username === username)
    console.log(user)
    useEffect(() => {
        dispatch(getUserList())
    }, [dispatch]);
    
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
                
                {user ?
                <>
                <div style={{display:'flex'}}>
                    
                    <h4 className="dashboard-title">TTDK {user.center.id}</h4>
                </div>
            
                <div className="statistics-line-chart" style={{paddingBottom: '20px', paddingTop: '20px'}}> 
                    <SingleCenter user={user}/>
                </div>
                </> 
                : 
                <CenterLayout centers={users}/>}
            </div>
        </div>
        <Footer/>
      </>
    )
}