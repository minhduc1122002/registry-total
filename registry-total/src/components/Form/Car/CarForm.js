import React from 'react'
import Select from "react-select";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { vi } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify'

export default function CarForm( {props} ) {
    const {index, setIndex, carId, setCarId, carDate, setCarDate, numberPlate, setNumberPlate, carPlace, setCarPlace,
        brand, setBrand, modelCode, setModelCode, carUse, setCarUse, carType, setCarType, engine_number, setEngineNumber, chassis_number, setChassisNumber} = props

    const selectStyle = {    
        control: (base, state) => ({
            ...base,
            '&:hover': { borderColor: 'gray' },
            border: '1px solid rgba(0, 0, 0, 0.32)',
            boxShadow: 'none',
            width: '100%'
        }),
    };
    
    const carUses = [
        { value: 'personal', label: 'Đi lại cá nhân' },
        { value: 'passenger_service', label: 'Dịch vụ chở khách' },
        { value: 'transportation_service', label: 'Dịch vụ vận tải' }
    ]
    
    const handleNext = (e) => {
        e.preventDefault()
        if (!carId || !carDate || !numberPlate || !carPlace || !brand || !modelCode || !carUse || !carType || !engine_number || !chassis_number || !setChassisNumber) {
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
        if (carId.length !== 6) {
            return toast.error('Mã số không hợp lệ', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            })
        }
        if (numberPlate.length !== 10) {
            return toast.error('Biển số xe không hợp lệ', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            })
        } else {
            setIndex("register")
        }
    }

    return (
        <>
            <div className="navigation">
                <div className="navigation-element">
                    <span className="element-container">
                        <span className="element-index-container">
                            <svg className="element-index passed-element" focusable="false" aria-hidden="true">
                                <FontAwesomeIcon icon={faCircleCheck} />
                            </svg>
                        </span>
                        <span className="element-label-container">
                            <span className="element-label passed-label">Chủ sở hữu</span>
                        </span>
                    </span>
                </div>
    
                <div className="navigation-element">
                    <div className="navigation-line-container">
                        <span className="navigation-line"></span>
                    </div>
                    <span className="element-container">
                        <span className="element-index-container">
                            <svg className="element-index chosen-element" focusable="false" aria-hidden="true">
                                 <circle cx="24" cy="24" r="24"></circle>
                                <text className="index-text" x="24" y="24" dominantBaseline="central">2</text>
                            </svg>
                        </span>
                        <span className="element-label-container">
                            <span className="element-label chosen-label">Phương tiện</span>
                        </span>
                    </span>                    
                </div>
    
                <div className="navigation-element">
                    <div className="navigation-line-container">
                        <span className="navigation-line"></span>
                    </div>
                    <span className="element-container">
                        <span className="element-index-container">
                            <svg className="element-index" focusable="false" aria-hidden="true">
                                <circle cx="24" cy="24" r="24"></circle>
                                <text className="index-text" x="24" y="24" dominantBaseline="central">3</text>
                            </svg>
                        </span>
                        <span className="element-label-container">
                            <span className="element-label">Giấy đăng kiểm</span>
                        </span>
                    </span>                    
                </div>
            </div>
            <div className="content">
                <h2 className="form-header">Phương tiện</h2>
                <form>
                    <div className="group">
                        <div className="label-group">
                            Giấy chứng nhận đăng ký xe
                            <p className="line_blue"></p>
                        </div>
                        <div className="row-text">
                            <div className="label">Mã số</div>
                            <div className="text-input">
                                <input type="text" name="carId" defaultValue={carId} onChange={(e) => setCarId(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="row-text">
                            <div className="label">Ngày cấp</div>
                            <div className="text-input">
                                <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                <DatePicker
                                    defaultValue={carDate}
                                    onChange={setCarDate}
                                    disableFuture
                                    format="dd/MM/yyyy"
                                    className='date-picker-width'
                                />
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row-select">
                        <div className="label">Nơi đăng ký</div>
                        <div className="text-input">
                            <input type="text" name="brand" defaultValue={carPlace} onChange={(e) => setCarPlace(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="row-text">
                        <div className="label">Biển đăng ký</div>
                        <div className="text-input">
                            <input type="text" name="numberPlate" defaultValue={numberPlate} onChange={(e) => setNumberPlate(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="row-text">
                        <div className="label">Loại phương tiện</div>
                        <div className="text-input">
                            <input type="text" name="modelCode" defaultValue={carType} onChange={(e) => setCarType(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="row-text">
                        <div className="label">Hãng sản xuất</div>
                        <div className="text-input">
                            <input type="text" name="brand" defaultValue={brand} onChange={(e) => setBrand(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="row-text">
                        <div className="label">Số loại</div>
                        <div className="text-input">
                            <input type="text" name="modelCode" defaultValue={modelCode} onChange={(e) => setModelCode(e.target.value)}></input>
                        </div>
                    </div>
                        
                    <div className="row-select">
                        <div className="label">Mục đích sử dụng</div>
                        <div className="select-container">
                            <Select 
                                id="carUse" name="carUse" options={carUses}
                                className="select"
                                placeholder="Chọn mục đích sử dụng"
                                defaultValue={carUse}
                                onChange={setCarUse}
                                styles={selectStyle}
                            />
                        </div>
                    </div>

                    <div className="row-text">
                        <div className="label">Số Máy</div>
                        <div className="text-input">
                            <input type="text" name="modelCode" defaultValue={engine_number} onChange={(e) => setEngineNumber(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="row-text">
                        <div className="label">Số Khung</div>
                        <div className="text-input">
                            <input type="text" name="modelCode" defaultValue={chassis_number} onChange={(e) => setChassisNumber(e.target.value)}></input>
                        </div>
                    </div>
    
                    <div className="button-container">
                        <button className="button button-back" type="button" onClick={() => setIndex("owner")}>Quay lại</button>
                        <button className="button" type="button" onClick={handleNext}>Tiếp</button>
                    </div>
                </form>
            </div>
        </>
    )
}