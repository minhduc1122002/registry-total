import React from 'react'
import Sidebar from '../../components/Menu/Menu'
import './Car.css'

export default function Car() {
  return (
    <div className='container'>
      <Sidebar/>
      <div className='car'>
          <p>Car</p>
      </div>
    </div>
  )
}