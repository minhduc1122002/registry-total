import React from "react";
import './Form.css';
import { useState, useEffect } from "react";
import InspectionForm from '../../components/Form/Inspection/InspectionForm'
import CarForm from '../../components/Form/Car/CarForm'
import OwnerForm from '../../components/Form/Owner/OwnerForm'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import { useDispatch, useSelector } from 'react-redux';
import { addInspection, reset } from '../../redux/inspection';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import Modal from '@mui/material/Modal';
import Footer from '../../components/Footer/Footer'

export default function Form() {
    const [sideBar, setSideBar] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { message } = useSelector(
        (state) => state.inspection
    )
    const isSuccess = useSelector(
        (state) => state.inspection.isSuccess[0]
    )
    const isError = useSelector(
        (state) => state.inspection.isError[0]
    )
    const isLoading = useSelector(
        (state) => state.inspection.isLoading[0]
    )
    const user = useSelector((state) => state.auth.user);

    const [index, setIndex] = useState("owner");
    const [type, setType] = useState("individual");
    const [name, setName] = useState();
    const [id, setId] = useState();
    const [contact, setContact] = useState();
    const [city, setCity] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();
    const [address, setAddress] = useState();

    const [carId, setCarId] = useState();
    const [carDate, setCarDate] = useState();
    const [numberPlate, setNumberPlate] = useState();
    const [carPlace, setCarPlace] = useState();
    const [brand, setBrand] = useState();
    const [carType, setCarType] = useState();
    const [modelCode, setModelCode] = useState();
    const [carUse, setCarUse] = useState();
    const [engine_number, setEngineNumber] = useState();
    const [chassis_number, setChassisNumber] = useState();

    const [registerId, setRegisterId] = useState();
    const [registerDate, setRegisterDate] = useState();
    const [expiredDate, setExpiredDate] = useState();
    const [registerCity, setRegisterCity] = useState(user.center.city);
    const [registerDistrict, setRegisterDistrict] = useState(user.center.district);
    const [registerAddress, setRegisterAddress] = useState(user.center.address);
    
    useEffect(() => {
        setName()
        setId()
        setContact()
        setCity()
        setDistrict()
        setWard()
        setAddress()
    }, [type])

    useEffect(() => {
        setDistrict()
        setWard()
    }, [city])

    useEffect(() => {
        setWard()
    }, [district])

    useEffect(() => {
        if (isError) {
            toast.error(message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                onClose: () => {
                  dispatch(reset())
                }
            })
        }
        if (isSuccess) {
            dispatch(reset())
            navigate('/inspections', { replace: true });
        }
        toast.clearWaitingQueue();
    }, [isError, isSuccess, message, dispatch, navigate])

    const formatDate = (d) => {
        if (!d) {
            return ''
        }
        return d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2)
    }
    const handleAdd = (e) => {
        e.preventDefault()
        if (!registerId || !registerDate || !expiredDate || !registerCity || !registerDistrict || !registerAddress) {
            return toast.error('Hãy nhập đầy đủ các trường', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            })
        }
        
        const center = {
            "id": user.center.id,
            "address": registerAddress,
            "city": registerCity,
            "district": registerDistrict
        }
        
        dispatch(addInspection({
            "car": {
                "registration_id": carId,
                "registration_place": carPlace,
                "registration_date": formatDate(carDate),
                "plate_number": numberPlate,
                "purpose": carUse?.value,
                "type": carType,
                "manufacturer": brand,
                "model": modelCode,
                "engine_number": engine_number,
                "chassis_number": chassis_number,
                "owner": {
                    "id": id,
                    "type": type,
                    "name": name,
                    "address": address,
                    "contact": contact,
                    "ward": ward?.code,
                    "district": district?.code,
                    "city": city?.code
                }
            },
            "register_id": registerId,
            "register_date": formatDate(registerDate),
            "expired_date": formatDate(expiredDate),
            "center": center
        }))
    }
    console.log({
        "car": {
            "registration_id": carId,
            "registration_place": carPlace,
            "registration_date": formatDate(carDate),
            "plate_number": numberPlate,
            "purpose": carUse?.value,
            "type": carType,
            "manufacturer": brand,
            "model": modelCode,
            "engine_number": engine_number,
            "chassis_number": chassis_number,
            "owner": {
                "id": id,
                "type": type,
                "name": name,
                "address": address,
                "contact": contact,
                "ward": ward?.code,
                "district": district?.code,
                "city": city?.code
            }
        },
        "register_id": registerId,
        "register_date": formatDate(registerDate),
        "expired_date": formatDate(expiredDate),
        "center": {
            "id": user.center.id,
            "address": registerAddress,
            "city": registerCity,
            "district": registerDistrict
        }
    })
    const renderSwitch = (index) => {
        switch(index) {
            case "owner":
                return (
                    <OwnerForm props={{index, setIndex, type, setType, name, setName, id, setId, contact, setContact, city, setCity,
                        district, setDistrict, ward, setWard, address, setAddress}}/>
                );
            
            case "car":
                return (
                    <CarForm props={{index, setIndex, carId, setCarId, carDate, setCarDate, numberPlate, setNumberPlate, carPlace, setCarPlace,
                        brand, setBrand, modelCode, setModelCode, carUse, setCarUse, carType, setCarType, engine_number, setEngineNumber, chassis_number, setChassisNumber}}/>
                );

            case "register":
                return (
                    <InspectionForm props={{index, setIndex, registerId, setRegisterId, registerDate, setRegisterDate, expiredDate, setExpiredDate, registerCity,
                        setRegisterCity, registerDistrict, setRegisterDistrict, registerAddress, setRegisterAddress, handleAdd}}/>
                );
        }
    }
    
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
                    {renderSwitch(index)}
                </div>
            </div>
            <Footer/>
        </>
    );
}