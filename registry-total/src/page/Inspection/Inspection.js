import React from 'react'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import InspectionLayout from '../../layout/Inspection/InspectionLayout'
import './Inspection.css'
import SingleInspection from '../../components/Single/Inspection/SingleInspection'
import { useState, useEffect } from "react";
import { getInspectionList } from '../../redux/inspection'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import Modal from '@mui/material/Modal';
import Footer from '../../components/Footer/Footer'

export default function Inspection() {
    const [sideBar, setSideBar] = useState(false)
    const dispatch = useDispatch()
    const inspections = useSelector(state => state.inspection.inspections)
    
    useEffect(() => {
        dispatch(getInspectionList())
    }, [dispatch]);

    const InspectionId = window.location.pathname.split("/")[2]
    
    const inspection = inspections.find((inspection) => inspection.register_id === InspectionId)
    
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
                {inspection ? <SingleInspection inspection={inspection}/> : <InspectionLayout inspections={inspections}/>}
            </div>
        </div>
        <Footer/>
      </>
    )
}