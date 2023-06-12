import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {vi} from 'date-fns/locale';
import { useDispatch, useSelector } from 'react-redux';

export default function InspectionForm( {props} ) {
    const {index, setIndex, registerId, setRegisterId, registerDate, setRegisterDate, expiredDate, setExpiredDate, registerCity,
        setRegisterCity, registerDistrict, setRegisterDistrict, registerAddress, setRegisterAddress, handleAdd} = props

    const tree = require('../../../address/tree.json');
    const cities = require('../../../address/tinh_tp.json');
    const findCity = (city) => {
        return cities[cities.findIndex(c => c['code'] === city)]
    }
    const findDist = (dist, city_code) => {
        const dists = tree[city_code]['quan-huyen']
        return dists[dists.findIndex(d => d['code'] === dist)]
    }

    const isSuccess = useSelector(
        (state) => state.inspection.isSuccess[0]
    )
    const isError = useSelector(
        (state) => state.inspection.isError[0]
    )
    const isLoading = useSelector(
        (state) => state.inspection.isLoading[0]
    )
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
        if (city.code !== undefined) {
            
            return tree[city.code]['quan-huyen']
        }
        else return []
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
                            <svg className="element-index passed-element" focusable="false" aria-hidden="true">
                                <FontAwesomeIcon icon={faCircleCheck} />
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
                                defaultValue={registerDate}
                                onChange={setRegisterDate}
                                disableFuture
                                format="dd/MM/yyyy"
                                className='date-picker-width'
                            />
                            </LocalizationProvider>
                        </div>
                    </div>

                    <div className="row-text">
                        <div className="label">Ngày hết hạn</div>
                        <div className="text-input">
                            <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns} adapterLocale={vi}>
                            <DatePicker
                                defaultValue={expiredDate}
                                onChange={setExpiredDate}
                                format="dd/MM/yyyy"
                                className='date-picker-width'
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
                                defaultValue={findCity(registerCity)}
                                getOptionLabel={(city) => city.name_with_type}
                                getOptionValue={(city) => city.code}
                                styles={selectStyle}
                                isDisabled={true}
                            />
                        </div>
                    </div>

                    <div className="row-select">
                        <div className="label">Quận/Huyện</div>
                        <div className="select-container">
                            <Select
                                id="district" name="District" options={getDist(registerCity)}
                                className="select"
                                placeholder={registerDistrict}
                                defaultValue={findDist(registerDistrict, registerCity)}
                                getOptionLabel={(district) => district.name_with_type}
                                getOptionValue={(district) => district.code}
                                noOptionsMessage={() => "Không có lựa chọn nào"}
                                styles={selectStyle}
                                isDisabled={true}
                            />
                        </div>
                    </div>
                    
                    <div className="row-text">
                        <div className="label">Số nhà, phố, tổ dân phố/thôn/đội</div>
                        <div className="text-input">
                            <input type="text" name="registerAddress" defaultValue={registerAddress} disabled={true} onChange={(e) => setRegisterAddress(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="button-container">
                        <button className="button button-back" type="button" onClick={() => setIndex("car")}>Quay lại</button>
                        <button className="button" type="button" onClick={handleAdd} disabled={isLoading || isError}>Đăng ký</button>
                    </div>
                </form>
            </div>
        </>
    )
}