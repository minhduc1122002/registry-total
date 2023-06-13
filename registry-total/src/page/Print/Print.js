import * as React from "react";
import { useRef, useState, useEffect } from "react";
import "@progress/kendo-theme-material/dist/all.css";
import Sidebar from '../../components/Menu/Menu';
import Navigation from '../../components/Navigation/Navigation';
import axios from "axios"; 
import { Button } from "@progress/kendo-react-buttons";
import { PDFExport } from "@progress/kendo-react-pdf";
import { useNavigate } from 'react-router-dom'
import './Print.css';
import Footer from '../../components/Footer/Footer'
import Modal from '@mui/material/Modal';

export default function Print() {
    const [sideBar, setSideBar] = useState(false)
    const BASE_URL = "http://localhost:8000/api/";
    const navigate = useNavigate()
    const [layoutSelection, setLayoutSelection] = useState({
        text: "A4",
        value: "size-a4"
    });
    const [inspection, setInspection] = useState()
    const InspectionId = window.location.pathname.split("/")[3]

    const types = [
        {
            name : "Cơ quan",
            code : "agency"
        },
        {
            name : "Cá nhân",
            code : "individual"
        }  
    ]

    const findType = (type) => {
        return types[types.findIndex(c => c['code'] === type)].name
    }

    const purposes = [
        {
            name : "Đi lại cá nhân",
            code : "personal"
        },
        {
            name : "Dịch vụ chở khách",
            code : "passenger_service"
        },
        {
            name : "Dịch vụ vận tải",
            code : "transportation_service"
        }
           
    ]

    const findPurpose = (purpose) => {
        return purposes[purposes.findIndex(c => c['code'] === purpose)].name
    }

    const cities = require('../../address/tinh_tp.json');

    const findCity = (city) => {
        return cities[cities.findIndex(c => c['code'] === city)].name
    }

    useEffect(() => {
        const getInspection = async () => {
            try {
                const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
                const response = await axios.create({
                    baseURL: BASE_URL,
                    headers: { token: `${TOKEN}` },
                }).get(`/form/${InspectionId}`);
                    
                setInspection(response.data);
            } catch {}
        };
        getInspection();
    }, [InspectionId]);
    
    const updatePageLayout = event => {
        setLayoutSelection(event.target.value);
    };
    
    const pdfExportComponent = useRef(null);
    
    const handleExportWithComponent = event => {
        pdfExportComponent.current.save();
    };
    
    return (
    <>
        <div className="container">
            {sideBar &&
                <Modal open={sideBar} onClose={() => setSideBar(false)}>
                    <Sidebar/>
                </Modal>
            }
            <div className="sidebar-container">
                <Sidebar/>
            </div>
            <div className='inspection'>
                <Navigation/>
                <div className="dashboard-layout">
                    <h4 className="dashboard-title">Giấy Đăng Kiểm</h4>
                    {inspection &&
                    <div className="statistics-line-chart">
                        <div className="export-content">
                                <div className="export-box">
                                    <h4>In Giấy Đăng Kiểm</h4>
                                    <div className="button-group">
                                        <button className="button button-back" type="button" onClick={() => navigate(-1)}>Quay lại</button>
                                        <Button primary={true} onClick={handleExportWithComponent}>
                                            In (PDF)
                                        </Button>
                                    </div>
                                </div>
                                <div className="page-container">
                                    <PDFExport ref={pdfExportComponent}>
                                        <div className={`pdf-page ${layoutSelection.value}`}>
                                            <div className="pdf-header">
                                                <span className="company-logo">
                                                    1. CHỦ SỞ HỮU
                                                </span>
                                                <span className="english">(OWNER)</span>
                                            </div>
                                            <div className="pdf-body">
                                                <div className="regis-number">
                                                    <p className="regis">
                                                        Họ và tên : <b>{inspection.car.owner.name}</b>
                                                    </p>
                                                    <p className="number">
                                                        (Full name)
                                                    </p>
                                                </div>
                                                <div className="inspec-no">
                                                        <p className="regis">
                                                            Thông tin liên lạc : <span className="text">{inspection.car.owner.contact}</span>
                                                        </p>
                                                        <p className="number">
                                                            (Contact No.)
                                                        </p>
                                                    </div>
                                                <div className="cluster">
                                                    <div className="type">
                                                        CMT/CCCD : 
                                                        <span className="ita"> (ID) </span>
                                                        <span className="text">{inspection.car.owner.id}</span> 
                                                    </div>
                                                    <div className="type">
                                                        Quyền sở hữu : 
                                                        <span className="ita"> (Type) </span>
                                                        <span className="text">{findType(inspection.car.owner.type)}</span> 
                                                    </div>
                                                    <div className="type">
                                                        Địa chỉ thường trú : 
                                                        <span className="ita"> (Owner address) </span>
                                                        <span className="text">{inspection.car.owner.address}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pdf-header">
                                                <span className="company-logo">
                                                    2. PHƯƠNG TIỆN
                                                </span>
                                                <span className="english">(VEHICLE)</span>
                                            </div>
                                            <div className="pdf-body">
                                                <div className="regis-number">
                                                    <p className="regis">
                                                        Biển đăng ký : <b>{inspection.car.plate_number}</b>
                                                    </p>
                                                    <p className="number">
                                                        (Plate Number)
                                                    </p>
                                                </div>
                                                <div className="inspec-no">
                                                        <p className="regis">
                                                            Số quản lý : <span className="text">{inspection.register_id}</span>
                                                        </p>
                                                        <p className="number">
                                                            (Vehicle Inspection No.)
                                                        </p>
                                                    </div>
                                                <div className="cluster">
                                                    <div className="type">
                                                        Loại phương tiện : 
                                                        <span className="ita"> (Type) </span>
                                                        <span className="text">{inspection.car.type}</span> 
                                                    </div>
                                                    <div className="type">
                                                        Mục đích sử dụng : 
                                                        <span className="ita"> (Purpose) </span>
                                                        <span className="text">{findPurpose(inspection.car.purpose)}</span> 
                                                    </div>
                                                    <div className="type">
                                                        Nhãn hiệu : 
                                                        <span className="ita"> (Mark) </span>
                                                        <span className="text">{inspection.car.manufacturer}</span> 
                                                    </div>
                                                    <div className="type">
                                                        Số loại : 
                                                        <span className="ita"> (Model code) </span>
                                                        <span className="text">{inspection.car.model}</span>
                                                    </div>
                                                    <div className="type">
                                                        Số máy : 
                                                        <span className="ita"> (Engine Number) </span>
                                                        <span className="text">{inspection.car.engine_number}</span>
                                                    </div>
                                                    <div className="type">
                                                        Số khung : 
                                                        <span className="ita"> (Chassis Number) </span>
                                                        <span className="text">{inspection.car.chassis_number}</span>
                                                    </div>
                                                </div>
                                                <div className='footer'>
                                                    <div className='left'>
                                                        <p className="regis">
                                                            Số phiếu kiểm định : {inspection.register_id}
                                                        </p>
                                                        <p className="number">
                                                            (Inspection Report No)
                                                        </p>
                                                        <p className="regis">
                                                            Có hiệu lực đến ngày : <b>{inspection.expired_date}</b>
                                                        </p>
                                                        <p className="number">
                                                            (Valid until)
                                                        </p>
                                                    </div>
                                                    <div className='right'>
                                                        <p className="regis">
                                                            {findCity(inspection.center.city)}, 
                                                            ngày {new Date().getDate()} tháng {new Date().getMonth()+1} năm {new Date().getFullYear()}
                                                        </p>
                                                        <p className="number">
                                                            (Issued on: Day/Month/Year)
                                                        </p>
                                                        <p className="regis">
                                                            <b>ĐƠN VỊ KIỂM ĐỊNH</b>
                                                        </p>
                                                        <p className="regis">
                                                            <b>{inspection.center.id}</b> {inspection.center.address}
                                                        </p>
                                                        <p className="number">
                                                            (INSPECTION CENTER)
                                                        </p>
                                                        <p className="regis">
                                                            <b>{new Date().getDate()}-{new Date().getMonth() + 1}-{new Date().getFullYear()} {new Date().getHours()}:{new Date().getMinutes()}:{new Date().getSeconds()}</b>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </PDFExport>
                                </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
        <Footer />
    </>
  )
}