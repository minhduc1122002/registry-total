import React from "react";
import { useState, useEffect } from "react";
import CenterForm from '../../components/Form/Center/CenterForm'
import { ToastContainer } from 'react-toastify'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import Modal from '@mui/material/Modal';

export default function Form() {
    const [sideBar, setSideBar] = useState(false)
    
    return (
        <>
            <ToastContainer limit={1} />
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
                    <CenterForm />
                </div>
            </div>
        </>
    );
}