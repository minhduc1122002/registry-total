import React from 'react'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import { useEffect, useState } from "react";
import { getCarList } from '../../redux/car'
import { useDispatch, useSelector } from 'react-redux'
import CenterLayout from '../../layout/Center/CenterLayout'
import Modal from '@mui/material/Modal';

export default function Car() {
    // const dispatch = useDispatch()
    // const cars = useSelector(state => state.car.cars)
    // const [sideBar, setSideBar] = useState(false)
    // useEffect(() => {
    //     dispatch(getCarList())
    // }, [dispatch]);
    const [sideBar, setSideBar] = useState(false)
    const centers = []
    
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
                <CenterLayout centers={centers}/>
            </div>
        </div>
      </>
    )
}