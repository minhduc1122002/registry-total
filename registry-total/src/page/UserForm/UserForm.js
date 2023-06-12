import React from "react";
import { useState, useEffect } from "react";
import CenterForm from '../../components/Form/Center/CenterForm'
import Sidebar from '../../components/Menu/Menu'
import Navigation from '../../components/Navigation/Navigation'
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import { reset } from '../../redux/user';
import Footer from '../../components/Footer/Footer'

export default function Form() {
    const [sideBar, setSideBar] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { message } = useSelector(
        (state) => state.user
    )
    const isSuccess = useSelector(
        (state) => state.user.isSuccess[0]
    )
    const isError = useSelector(
        (state) => state.user.isError[0]
    )
    const isLoading = useSelector(
        (state) => state.user.isLoading[0]
    )

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
            navigate('/center', { replace: true });
        }
        toast.clearWaitingQueue();
    }, [isError, isSuccess, message, dispatch, navigate])

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
            <Footer/>
        </>
    );
}