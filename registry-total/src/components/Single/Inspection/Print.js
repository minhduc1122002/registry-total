import * as React from "react";
import { useRef, useState } from "react";
import "@progress/kendo-theme-material/dist/all.css";
import Sidebar from '../../Menu/Menu';
import Navigation from '../../Navigation/Navigation';

import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { PDFExport } from "@progress/kendo-react-pdf";

import './Print.css';

export default function SingleInspection( { inspection }) {
    const [layoutSelection, setLayoutSelection] = useState({
        text: "A4",
        value: "size-a4"
    });
    
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
            <Sidebar/>
            <div className='inspection'>
                <Navigation/>
                <div className="dashboard-layout">
                    <h4 className="dashboard-title">Inspection</h4>
                    <div className="statistics-line-chart">
                        <div className="content">
                                <div className="box">
                                    <h4>Export PDF</h4>
                                    <Button primary={true} onClick={handleExportWithComponent}>
                                        Export
                                    </Button>
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
                                                        Biển đăng ký : <b>30A-6666</b>
                                                    </p>
                                                    <p className="number">
                                                        (Registration Number)
                                                    </p>
                                                </div>
                                                <div className="inspec-no">
                                                        <p className="regis">
                                                            Số quản lý : <span className="text">123456</span>
                                                        </p>
                                                        <p className="number">
                                                            (Vehicle Inspection No.)
                                                        </p>
                                                    </div>
                                                <div className="cluster">
                                                    <div className="type">
                                                        Loại phương tiện : 
                                                        <span className="ita"> (Type) </span>
                                                        <span className="text">ô tô con</span> 
                                                    </div>
                                                    <div className="type">
                                                        Nhãn hiệu : 
                                                        <span className="ita"> (Mark) </span>
                                                        <span className="text">TOYOTA</span> 
                                                    </div>
                                                    <div className="type">
                                                        Số loại : 
                                                        <span className="ita"> (Model code) </span>
                                                        <span className="text">Vios e</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </PDFExport>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}