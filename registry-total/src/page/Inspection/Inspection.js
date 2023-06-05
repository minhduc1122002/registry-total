import React from 'react'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import InspectionLayout from '../../layout/Inspection/InspectionLayout'
import './Inspection.css'

export default function Inspection() {
  return (
    <div className='container'>
      <Sidebar/>
      <div className='inspection'>
          <Navigation/>
          <InspectionLayout/>
      </div>
    </div>
  )
}