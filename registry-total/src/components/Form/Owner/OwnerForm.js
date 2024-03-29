import React from 'react'
import Select from "react-select";
import {
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@material-ui/core";
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';

export default function OwnerForm( {props} ) {
    const {index, setIndex, type, setType, name, setName, id, setId, contact, setContact, city, setCity,
        district, setDistrict, ward, setWard, address, setAddress} = props
    const navigate = useNavigate()
    const cities = require('../../../address/tinh_tp.json');
    const tree = require('../../../address/tree.json');
    const wards = require('../../../address/xa-phuong.json');

    const selectStyle = {    
        control: (base, state) => ({
            ...base,
            '&:hover': { borderColor: 'gray' },
            border: '1px solid rgba(0, 0, 0, 0.32)',
            boxShadow: 'none',
            width: '100%'
        }),
    };
    
    const getDist = (city) => {
        if (city && city.code) {
            // console.log(tree[city.code]['quan-huyen'])
            return tree[city.code]['quan-huyen']
        }
        else return []
    }

    const getWard = (district) => {
        if (district && district.code && wards[district.parent_code]['quan-huyen'][district.code]['xa-phuong'].length > 0) {
            return wards[district.parent_code]['quan-huyen'][district.code]['xa-phuong']
        }
        else return []
    }
    const handleNext = (e) => {
        e.preventDefault()
        console.log(id)
        if (!type || !name || !id || !contact || !city || !district || !ward || !address) {
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
        if (type === 'individual' && id.length !== 12 && id.length !== 8) {
            return toast.error('Số CMT/CCCD, hộ chiếu không hợp lệ', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            })
        }
        if (contact.length !== 10 && contact.length !== 11) {
            return toast.error('Số điện thoại không hợp lệ', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            })
        } else {
            setIndex("car")
        }
    }

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
                            defaultValue={'individual'} 
                            onChange={(e) => setType(e.target.value)}
                            row 
                        >
                            <FormControlLabel className="radio" value="agency" control={<Radio color="primary"/>} label={<span className="radio-label">Cơ quan</span>} />
                            <FormControlLabel className="radio" value="individual" control={<Radio color="primary"/>} label={<span className="radio-label">Cá nhân</span>} />
                        </RadioGroup>
                    </div>
                    <div className="row-text">
                        <div className="label">{type === "individual" ? "Họ và tên" : "Tên doanh nghiệp"}</div>
                        <div className="text-input">
                            <input type="text" name="Name" defaultValue={name} onChange={(e) => setName(e.target.value)}></input>
                        </div>
                    </div>
                    <div className="row-text">
                        <div className="label">{type === "individual" ? "Số CMT/CCCD hoặc hộ chiếu" : "Mã số doanh nghiệp"}</div>
                        <div className="text-input">
                            <input type="text" name="Id" defaultValue={id} onChange={(e) => setId(e.target.value)}></input>
                        </div>
                    </div>
                    <div className="row-text">
                        <div className="label">Số điện thoại</div>
                        <div className="text-input">
                            <input type="text" name="Contact" defaultValue={contact} onChange={(e) => setContact(e.target.value)}></input>
                        </div>
                    </div>
                    <div className="label-group">
                        {type === "individual" ? "Địa chỉ thường trú" : "Địa chỉ liên lạc"}
                        <p className="line_blue"></p>
                    </div>
                        
                    <div className="row-select">
                        <div className="label">Tỉnh/Thành phố</div>
                        <div className="select-container">
                            <Select 
                                id="city" name="City" options={cities}
                                className="select"
                                placeholder="Chọn Tỉnh/Thành phố"
                                defaultValue={city ? city : ''}
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
                                defaultValue={district ? district : ''}
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
                                defaultValue={ward ? ward : ''}
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
                            <input type="text" name="Address" defaultValue={address} onChange={(e) => setAddress(e.target.value)}></input>
                        </div>
                    </div>
                    <div className="button-container">
                        <button className="button button-back" type="button" onClick={() => navigate('/inspections')}>Quay lại</button>
                        <button className="button" type="button" onClick={handleNext}>Tiếp</button>
                    </div>
                </form>
            </div>
        </>
    )
}