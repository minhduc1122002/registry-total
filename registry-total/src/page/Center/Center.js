import React from 'react'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import { useEffect, useState } from "react";
import { getUserList } from '../../redux/user'
import { useDispatch, useSelector } from 'react-redux'
import CenterLayout from '../../layout/Center/CenterLayout'
import Modal from '@mui/material/Modal';
import { ToastContainer, toast } from 'react-toastify'

export default function Car() {
    const dispatch = useDispatch()
    const users = useSelector(state => state.user.users)
    const [sideBar, setSideBar] = useState(false)
    
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
                <CenterLayout centers={users}/>
            </div>
        </div>
      </>
    )
}