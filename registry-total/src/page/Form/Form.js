import React from "react";
import './Form.css';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import {
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel
} from "@material-ui/core";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {vi} from 'date-fns/locale';
import {TextField} from "@mui/material";

fontawesome.library.add(faCircleCheck);

export default function Form() {
    const cities = require('../../address/tinh_tp.json');
    

    const tree = require('../../address/tree.json');

    const wards = require('../../address/xa-phuong.json');

    const [index, setIndex] = useState("owner");
    const [type, setType] = useState("individual");
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [contact, setContact] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [address, setAddress] = useState("");

    const [carId, setCarId] = useState();
    const [carDate, setCarDate] = useState();
    const [numberPlate, setNumberPlate] = useState();
    const [carPlace, setCarPlace] = useState();
    const [brand, setBrand] = useState();
    const [modelCode, setModelCode] = useState();
    const [carUse, setCarUse] = useState();

    const [registerId, setRegisterId] = useState();
    const [registerDate, setRegisterDate] = useState();
    const [expiredDate, setExpiredDate] = useState();
    const [registerCity, setRegisterCity] = useState();
    const [registerDistrict, setRegisterDistrict] = useState();
    const [registerAddress, setRegisterAddress] = useState();

    useEffect(() => {
        setDistrict("")
        setWard("")
    }, [city])

    useEffect(() => {
        setWard("")
    }, [district])

    useEffect(() => {
        setName("")
        setId("")
        setContact("")
        setCity("")
        setDistrict("")
        setWard("")
        setAddress("")
    }, [type])

    const getDist = (city) => {
        console.log(city.code)
        if (city.code !== undefined) {
            // console.log(tree[city.code]['quan-huyen'])
            return tree[city.code]['quan-huyen']
        }
        else return []
    }

    const getWard = (district) => {
        // console.log(district.parent_code)
        // console.log(district.code)
        if (district.code !== undefined && wards[district.parent_code]['quan-huyen'][district.code]['xa-phuong'].length > 0) {
            // console.log(wards[district.parent_code]['quan-huyen'][district.code]['xa-phuong'])
            return wards[district.parent_code]['quan-huyen'][district.code]['xa-phuong']
        }
        else return []
    }

    const selectStyle = {    
        control: (base, state) => ({
          ...base,
          '&:hover': { borderColor: 'gray' },
          border: '1px solid rgba(0, 0, 0, 0.32)',
          boxShadow: 'none',
      }),
    };

    const carUses = [
        { value: 'personal', label: 'Đi lại cá nhân' },
        { value: 'passenger_service', label: 'Dịch vụ chở khách' },
        { value: 'transportation_service', label: 'Dịch vụ vận tải' }
    ]

    // const changeweekDays = () => {
    //     const weekDays = document.querySelector(".css-i5q14k-MuiDayCalendar-header");
    //     if (weekDays != null) {
    //         for (var i = 0; i < weekDays.childNodes.length; i++) {
    //             if (i < weekDays.childNodes.length - 1) {
    //                 weekDays.childNodes[i].innerHTML = "T" + (i + 2)
    //             }
    //             else {
    //                 weekDays.childNodes[i].innerHTML = "CN"
    //             }
    //         }
    //     }
    // }

    const renderSwitch = (index) => {
        switch(index) {
            case "owner":
                return (
                    <>
                    <div className="navigation">
                    <div className="navigation-element">
                        <span className="element-container">
                            <span className="element-index-container">
                                <svg className="element-index chosen-element" focusable="false" aria-hidden="true">
                                    <circle cx="24" cy="24" r="24"></circle>
                                    <text className="index-text" x="24" y="24" dominantBaseline="central">1</text>
                                </svg>
                            </span>
                            <span className="element-label-container">
                                <span className="element-label chosen-label">Chủ sở hữu</span>
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
                                    <text className="index-text" x="24" y="24" dominantBaseline="central">2</text>
                                </svg>
                            </span>
                            <span className="element-label-container">
                                <span className="element-label">Phương tiện</span>
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
                    <h2 className="form-header">Chủ sở hữu</h2>
                    <form>
                        <div className="row-radio">
                            <div className="label">Loại</div>
                            <RadioGroup 
                                className="radio-container" 
                                defaultValue={"individual"} 
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                row 
                            >
                                <FormControlLabel className="radio" value="agency" control={<Radio color="primary"/>} label={<span className="radio-label">Cơ quan</span>} />
                                <FormControlLabel className="radio" value="individual" control={<Radio color="primary"/>} label={<span className="radio-label">Cá nhân</span>} />
                            </RadioGroup>
                        </div>
                        <div className="row-text">
                            <div className="label">{type == "individual" ? "Họ và tên" : "Tên doanh nghiệp"}</div>
                            <div className="text-input">
                                <input type="text" name="Name" value={name} onChange={(e) => setName(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="row-text">
                            <div className="label">{type == "individual" ? "Số CMT/CCCD hoặc hộ chiếu" : "Mã số doanh nghiệp"}</div>
                            <div className="text-input">
                                <input type="text" name="Id" value={id} onChange={(e) => setId(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="row-text">
                            <div className="label">Số điện thoại</div>
                            <div className="text-input">
                                <input type="text" name="Contact" value={contact} onChange={(e) => setContact(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="label-group">
                            {type == "individual" ? "Địa chỉ thường trú" : "Địa chỉ liên lạc"}
                            <p className="line_blue"></p>
                        </div>
                        
                        <div className="row-select">
                            <div className="label">Tỉnh/Thành phố</div>
                            <div className="select-container">
                                <Select 
                                    id="city" name="City" options={cities}
                                    className="select"
                                    placeholder="Chọn Tỉnh/Thành phố"
                                    value={city}
                                    onChange={setCity}
                                    getOptionLabel={(city) => city.name_with_type}
                                    getOptionValue={(city) => city.code}
                                    styles={selectStyle}
                                />
                            </div>
                        </div>
    
                        <div className="row-select">
                            <div className="label">Quận/Huyện</div>
                            <div className="select-container">
                                <Select
                                    id="district" name="District" options={getDist(city)}
                                    className="select"
                                    placeholder="Chọn Quận/Huyện"
                                    value={district}
                                    onChange={setDistrict}
                                    getOptionLabel={(district) => district.name_with_type}
                                    getOptionValue={(district) => district.code}
                                    noOptionsMessage={() => "Không có lựa chọn nào"}
                                    styles={selectStyle}
                                />
                            </div>
                        </div>
    
                        <div className="row-select">
                            <div className="label">Xã/Phường</div>
                            <div className="select-container">
                                <Select 
                                    id="ward" name="Ward" options={getWard(district)}
                                    className="select"
                                    placeholder="Chọn Xã/Phường"
                                    value={ward}
                                    onChange={setWard}
                                    getOptionLabel={(ward) => ward.name_with_type}
                                    getOptionValue={(ward) => ward.code}
                                    noOptionsMessage={() => "Không có lựa chọn nào"}
                                    styles={selectStyle}
                                />
                            </div>
                        </div>
                        
                        <div className="row-text">
                            <div className="label">Số nhà, phố, tổ dân phố/thôn/đội</div>
                            <div className="text-input">
                                <input type="text" name="Address" value={address} onChange={(e) => setAddress(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="button-container">
                            <button className="button" type="button" onClick={() => setIndex("car")}>Tiếp</button>
                        </div>
                    </form>
                </div>
                </>
                );
            
            case "car":
                return (
                    <>
                    <div className="navigation">
                    <div className="navigation-element">
                        <span className="element-container">
                            <span className="element-index-container">
                                <svg className="element-index passed-element" focusable="false" aria-hidden="true">
                                    <FontAwesomeIcon icon="fa-solid fa-circle-check" />
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
                                    <input type="text" name="carId" value={carId} onChange={(e) => setCarId(e.target.value)}></input>
                                </div>
                            </div>
                            <div className="row-text">
                                <div className="label">Ngày cấp</div>
                                <div className="text-input">
                                    <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                    <DatePicker
                                        value={carDate}
                                        onChange={setCarDate}
                                        disableFuture
                                        format="dd/MM/yyyy"
                                    />
                                    </LocalizationProvider>
                                </div>
                            </div>
                        </div>
                        
                        <div className="row-text">
                            <div className="label">Biển đăng ký</div>
                            <div className="text-input">
                                <input type="text" name="numberPlate" value={numberPlate} onChange={(e) => setNumberPlate(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="row-select">
                            <div className="label">Nơi đăng ký</div>
                            <div className="select-container">
                                <Select 
                                    id="carPlace" name="carPlace" options={cities}
                                    className="select"
                                    placeholder="Chọn Tỉnh/Thành phố"
                                    value={carPlace}
                                    onChange={setCarPlace}
                                    getOptionLabel={(city) => city.name_with_type}
                                    getOptionValue={(city) => city.code}
                                    styles={selectStyle}
                                />
                            </div>
                        </div>
                        <div className="row-text">
                            <div className="label">Hãng sản xuất</div>
                            <div className="text-input">
                                <input type="text" name="brand" value={brand} onChange={(e) => setBrand(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="row-text">
                            <div className="label">Số loại</div>
                            <div className="text-input">
                                <input type="text" name="modelCode" value={modelCode} onChange={(e) => setModelCode(e.target.value)}></input>
                            </div>
                        </div>
                        
                        <div className="row-select">
                            <div className="label">Mục đích sử dụng</div>
                            <div className="select-container">
                                <Select 
                                    id="carUse" name="carUse" options={carUses}
                                    className="select"
                                    placeholder="Chọn mục đích sử dụng"
                                    value={carUse}
                                    onChange={setCarUse}
                                    styles={selectStyle}
                                />
                            </div>
                        </div>
    
                        <div className="button-container">
                            <button className="button button-back" type="button" onClick={() => setIndex("owner")}>Quay lại</button>
                            <button className="button" type="button" onClick={() => setIndex("register")}>Tiếp</button>
                        </div>
                    </form>
                </div>
                </>
                );

            case "car":
                return (
                    <>
                    <div className="navigation">
                    <div className="navigation-element">
                        <span className="element-container">
                            <span className="element-index-container">
                                <svg className="element-index passed-element" focusable="false" aria-hidden="true">
                                    <FontAwesomeIcon icon="fa-solid fa-circle-check" />
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
                                    <input type="text" name="carId" value={carId} onChange={(e) => setCarId(e.target.value)}></input>
                                </div>
                            </div>
                            <div className="row-text">
                                <div className="label">Ngày cấp</div>
                                <div className="text-input">
                                    <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                    <DatePicker
                                        value={carDate}
                                        onChange={setCarDate}
                                        disableFuture
                                        format="dd/MM/yyyy"
                                    />
                                    </LocalizationProvider>
                                </div>
                            </div>
                        </div>
                        
                        <div className="row-text">
                            <div className="label">Biển đăng ký</div>
                            <div className="text-input">
                                <input type="text" name="numberPlate" value={numberPlate} onChange={(e) => setNumberPlate(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="row-select">
                            <div className="label">Nơi đăng ký</div>
                            <div className="select-container">
                                <Select 
                                    id="carPlace" name="carPlace" options={cities}
                                    className="select"
                                    placeholder="Chọn Tỉnh/Thành phố"
                                    value={carPlace}
                                    onChange={setCarPlace}
                                    getOptionLabel={(city) => city.name_with_type}
                                    getOptionValue={(city) => city.code}
                                    styles={selectStyle}
                                />
                            </div>
                        </div>
                        <div className="row-text">
                            <div className="label">Hãng sản xuất</div>
                            <div className="text-input">
                                <input type="text" name="brand" value={brand} onChange={(e) => setBrand(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="row-text">
                            <div className="label">Số loại</div>
                            <div className="text-input">
                                <input type="text" name="modelCode" value={modelCode} onChange={(e) => setModelCode(e.target.value)}></input>
                            </div>
                        </div>
                        
                        <div className="row-select">
                            <div className="label">Mục đích sử dụng</div>
                            <div className="select-container">
                                <Select 
                                    id="carUse" name="carUse" options={carUses}
                                    className="select"
                                    placeholder="Chọn mục đích sử dụng"
                                    value={carUse}
                                    onChange={setCarUse}
                                    styles={selectStyle}
                                />
                            </div>
                        </div>
    
                        <div className="button-container">
                            <button className="button button-back" type="button" onClick={() => setIndex("owner")}>Quay lại</button>
                            <button className="button" type="button" onClick={() => setIndex("register")}>Tiếp</button>
                        </div>
                    </form>
                </div>
                </>
                );

            case "register":
                    return (
                        <>
                        <div className="navigation">
                        <div className="navigation-element">
                            <span className="element-container">
                                <span className="element-index-container">
                                    <svg className="element-index passed-element" focusable="false" aria-hidden="true">
                                        <FontAwesomeIcon icon="fa-solid fa-circle-check" />
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
                                <svg className="element-index passed-element" focusable="false" aria-hidden="true">
                                        <FontAwesomeIcon icon="fa-solid fa-circle-check" />
                                    </svg>
                                </span>
                                <span className="element-label-container">
                                    <span className="element-label passed-label">Phương tiện</span>
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
                                        <text className="index-text" x="24" y="24" dominantBaseline="central">3</text>
                                    </svg>
                                </span>
                                <span className="element-label-container">
                                    <span className="element-label chosen-label">Giấy đăng kiểm</span>
                                </span>
                            </span>                    
                        </div>
                    </div>
        
                    <div className="content">
                        <h2 className="form-header">Giấy đăng kiểm</h2>
                        <form>
                            <div className="row-text">
                                <div className="label">Mã số</div>
                                <div className="text-input">
                                    <input type="text" name="registerId" value={registerId} onChange={(e) => setRegisterId(e.target.value)}></input>
                                </div>
                            </div>
                            <div className="row-text">
                                <div className="label">Ngày cấp</div>
                                <div className="text-input">
                                    <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                    <DatePicker
                                        value={registerDate}
                                        onChange={setRegisterDate}
                                        disableFuture
                                        format="dd/MM/yyyy"
                                    />
                                    </LocalizationProvider>
                                </div>
                            </div>

                            <div className="row-text">
                                <div className="label">Ngày hết hạn</div>
                                <div className="text-input">
                                    <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                    <DatePicker
                                        value={expiredDate}
                                        onChange={setExpiredDate}
                                        disableFuture
                                        format="dd/MM/yyyy"
                                    />
                                    </LocalizationProvider>
                                </div>
                            </div>
                            
                            <div className="label-group">
                                Trung tâm đăng kiểm
                                <p className="line_blue"></p>
                            </div>
                            
                            <div className="row-select">
                                <div className="label">Tỉnh/Thành phố</div>
                                <div className="select-container">
                                    <Select 
                                        id="city" name="City" options={cities}
                                        className="select"
                                        placeholder="Chọn Tỉnh/Thành phố"
                                        value={registerCity}
                                        onChange={setRegisterCity}
                                        getOptionLabel={(city) => city.name_with_type}
                                        getOptionValue={(city) => city.code}
                                        styles={selectStyle}
                                    />
                                </div>
                            </div>
        
                            <div className="row-select">
                                <div className="label">Quận/Huyện</div>
                                <div className="select-container">
                                    <Select
                                        id="district" name="District" options={getDist(city)}
                                        className="select"
                                        placeholder="Chọn Quận/Huyện"
                                        value={registerDistrict}
                                        onChange={setRegisterDistrict}
                                        getOptionLabel={(district) => district.name_with_type}
                                        getOptionValue={(district) => district.code}
                                        noOptionsMessage={() => "Không có lựa chọn nào"}
                                        styles={selectStyle}
                                    />
                                </div>
                            </div>
                            
                            <div className="row-text">
                                <div className="label">Số nhà, phố, tổ dân phố/thôn/đội</div>
                                <div className="text-input">
                                    <input type="text" name="registerAddress" value={registerAddress} onChange={(e) => setRegisterAddress(e.target.value)}></input>
                                </div>
                            </div>
            
                            <div className="button-container">
                                <button className="button button-back" type="button" onClick={() => setIndex("car")}>Quay lại</button>
                                <button className="button" type="button" onClick={() => setIndex("register")}>Đăng ký</button>
                            </div>
                        </form>
                    </div>
                    </>
                    );
        }
    }
    
    return (
        <div className="form-container">
            {renderSwitch(index)}
        </div>
    );
}