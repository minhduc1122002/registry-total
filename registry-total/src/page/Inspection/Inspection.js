import React from 'react'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import InspectionLayout from '../../layout/Inspection/InspectionLayout'
import './Inspection.css'
import SingleInspection from '../../components/Single/Inspection/SingleInspection'
import { useEffect } from "react";
import { getInspectionList } from '../../redux/inspection'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'

export default function Inspection() {
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
        <Sidebar/>
        <div className='inspection'>
            <Navigation/>
            {inspection ? <SingleInspection inspection={inspection}/> : <InspectionLayout inspections={inspections}/>}
        </div>
      </div>
      </>
    )
}