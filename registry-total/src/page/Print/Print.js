import * as React from "react";
import { useRef, useState, useEffect } from "react";
import "@progress/kendo-theme-material/dist/all.css";
import Sidebar from '../../components/Menu/Menu';
import Navigation from '../../components/Navigation/Navigation';
import axios from "axios"; 
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { PDFExport } from "@progress/kendo-react-pdf";
import { useNavigate } from 'react-router-dom'
import './Print.css';

export default function Print() {
    const BASE_URL = "http://localhost:8000/api/";
    const navigate = useNavigate()
    const [layoutSelection, setLayoutSelection] = useState({
        text: "A4",
        value: "size-a4"
    });
    const [inspection, setInspection] = useState()
    const InspectionId = window.location.pathname.split("/")[3]

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
    console.log(inspection)
    return (
    <>
        <div className="container">
            <Sidebar/>
            <div className='inspection'>
                <Navigation/>
                <div className="dashboard-layout">
                    <h4 className="dashboard-title">Inspection</h4>
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
                                                    1. PHƯƠNG TIỆN
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
                                                            Mã Đăng Kiểm : <span className="text">{inspection.register_id}</span>
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
                                                        Hãng sản xuất : 
                                                        <span className="ita"> (Manufacturer) </span>
                                                        <span className="text">{inspection.car.manufacturer}</span> 
                                                    </div>
                                                    <div className="type">
                                                        Số loại : 
                                                        <span className="ita"> (Model code) </span>
                                                        <span className="text">{inspection.car.model}</span>
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
    </>
  )
}