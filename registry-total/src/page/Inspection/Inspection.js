import React from 'react'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import InspectionLayout from '../../layout/Inspection/InspectionLayout'
import './Inspection.css'
import SingleInspection from '../../components/Single/Inspection/SingleInspection'
import { useSelector } from 'react-redux';

export default function Inspection() {
    const InspectionId = window.location.pathname.split("/")[2]
    
    const inspection = useSelector((state) =>
      state.inspection.inspections.find((inspection) => inspection.register_id === InspectionId)
    );

    return (
      <div className='container'>
        <Sidebar/>
        <div className='inspection'>
            <Navigation/>
            {InspectionId ? <SingleInspection inspection={inspection}/> : <InspectionLayout/>}
        </div>
      </div>
    )
}