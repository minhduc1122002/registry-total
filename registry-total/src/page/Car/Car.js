import React from 'react'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'


export default function Car() {
  return (
    <>
    <div className='container'>
      <Sidebar/>
      <div className='dashboard'>
          <Navigation/>
          
      </div>
    </div>
    </>
  )
}
