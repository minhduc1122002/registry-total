import React from 'react'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import { useEffect } from "react";
import { getCarList } from '../../redux/car'
import { useDispatch, useSelector } from 'react-redux'
import CarLayout from '../../layout/Car/CarLayout'

export default function Car() {
    const dispatch = useDispatch()
    const cars = useSelector(state => state.car.cars)
    
    useEffect(() => {
        dispatch(getCarList())
    }, [dispatch]);
    
    return (
      <>
      <div className='container'>
        <Sidebar/>
        <div className='dashboard'>
            <Navigation/>
            <CarLayout cars={cars}/>
        </div>
      </div>
      </>
    )
}
