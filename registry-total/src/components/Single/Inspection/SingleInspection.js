import React from 'react'
import Select from "react-select";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { vi } from 'date-fns/locale';
import { useState, useEffect } from "react";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { updateInspectionbyId, reset } from '../../../redux/inspection';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function SingleInspection( { inspection }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const isLoading = useSelector(
        (state) => state.inspection.isLoading[1]
    )
    const message = useSelector(
        (state) => state.inspection.message
    )
    const isError = useSelector(
        (state) => state.inspection.isError[1]
    )

    const isSuccess = useSelector(
        (state) => state.inspection.isSuccess[1]
    )
    
    useEffect(() => {
        if (isError) {
            toast.error(JSON.stringify(message), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                onClose: () => dispatch(reset())
            })
        }
        if (isSuccess) {
            dispatch(reset())
            navigate('/inspections', { replace: true });
        }
        toast.clearWaitingQueue();
    }, [isError, message, dispatch, isSuccess, navigate])

    const car = inspection.car
    const owner = inspection.car.owner
    const center = inspection.center
    
    const cities = require('../../../address/tinh_tp.json');
    const tree = require('../../../address/tree.json');
    const wards = require('../../../address/xa-phuong.json');
    const formatDate = (d) => {
      return d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2)
    }
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
    const findCarUse = (use) => {
      return carUses[carUses.findIndex(carUse => carUse.value === use)]
    }
    const getDist = (city) => {
        if (city && city.code) {
            return tree[city.code]['quan-huyen']
        }
        else {
          return []
        }
    }
    const findDist = (dist, city) => {
        const dists = tree[city.code]['quan-huyen']
        return dists[dists.findIndex(d => d['name_with_type'] === dist || d['name'] === dist)]
    }
    const findCity = (city) => {
      return cities[cities.findIndex(c => c['code'] === city)]
    }
    const findWard = (district, ward) => {
      
      const wards_of_district = wards[district.parent_code]['quan-huyen'][district.code]['xa-phuong']
      return wards_of_district[wards_of_district.findIndex(w => w['name_with_type'] === ward)]
    }
    const getWard = (district) => {
        if (district && district.code && wards[district.parent_code]['quan-huyen'][district.code]['xa-phuong'].length > 0) {
            return wards[district.parent_code]['quan-huyen'][district.code]['xa-phuong']
        }
        else return []
    }


    const [type, setType] = useState(owner.type);
    const [name, setName] = useState(owner.name);
    const [id, setId] = useState(owner.id);
    const [contact, setContact] = useState(owner.contact);
    const [city, setCity] = useState(findCity(owner.city));
    const [district, setDistrict] = useState(findDist(owner.district, city));
    const [ward, setWard] = useState(findWard(district, owner.ward));
    const [address, setAddress] = useState(owner.address);

    const [carId, setCarId] = useState(car.registration_id);
    const [carDate, setCarDate] = useState(new Date(car.registration_date));
    const [numberPlate, setNumberPlate] = useState(car.plate_number);
    const [carPlace, setCarPlace] = useState(car.registration_place);
    const [brand, setBrand] = useState(car.manufacturer);
    const [carType, setCarType] = useState(car.type);
    const [modelCode, setModelCode] = useState(car.model);
    const [carUse, setCarUse] = useState(findCarUse(car.purpose));
    const [engine_number, setEngineNumber] = useState(car.engine_number);
    const [chassis_number, setChassisNumber] = useState(car.chassis_number);

    const [registerId, setRegisterId] = useState(inspection.register_id);
    const [registerDate, setRegisterDate] = useState(new Date(inspection.register_date));
    const [expiredDate, setExpiredDate] = useState(new Date(inspection.expired_date));
    const [registerCity, setRegisterCity] = useState(findCity(center.city));
    const [registerDistrict, setRegisterDistrict] = useState(findDist(center.district, registerCity));
    const [registerAddress, setRegisterAddress] = useState(center.address);
    console.log(registerDistrict)

    const handleEdit = (e) => {
        e.preventDefault()
        dispatch(updateInspectionbyId({
          "car": {
              "registration_id": carId,
              "registration_place": carPlace,
              "registration_date": formatDate(carDate),
              "plate_number": numberPlate,
              "purpose": carUse.value,
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
                  "district": district.name_with_type,
                  "ward": ward.name_with_type,
                  "city": city.code
              }
          },
          "register_id": registerId,
          "register_date": formatDate(registerDate),
          "expired_date": formatDate(expiredDate),
          "center": center
      }))
    }
    
    return (
      <>
      <div className="dashboard-layout">
          <h4 className="dashboard-title">Inspection</h4>
          <div className="statistics-line-chart">
            <div className="content">
                  <h2 className="form-header">Giấy đăng kiểm</h2>
                  <form>
                      <div className="row-text">
                          <div className="label">Mã số</div>
                          <div className="text-input">
                              <input type="text" name="registerId" value={registerId} disabled={true} onChange={(e) => setRegisterId(e.target.value)}></input>
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
                                  value={expiredDate}
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
                                  id="city" name="City"
                                  options={cities}
                                  className="select"
                                  defaultValue={registerCity}
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
                                  id="district" name="District" options={getDist(registerCity)}
                                  className="select"
                                  defaultValue={registerDistrict}
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
                  </form>
              </div>
              <div className="content" style={{marginTop: '32px'}}>
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
                                <input type="text" name="carId" value={carId} disabled={true} onChange={(e) => setCarId(e.target.value)}></input>
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
                                    className='date-picker-width'
                                />
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row-select">
                        <div className="label">Nơi đăng ký</div>
                        <div className="select-container">
                            <div className="text-input">
                              <input type="text" name="carPlace" value={carPlace} onChange={(e) => setCarPlace(e.target.value)}></input>
                          </div>
                        </div>
                    </div>

                    <div className="row-text">
                        <div className="label">Biển đăng ký</div>
                        <div className="text-input">
                            <input type="text" name="numberPlate" value={numberPlate} onChange={(e) => setNumberPlate(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="row-text">
                        <div className="label">Loại phương tiện</div>
                        <div className="text-input">
                            <input type="text" name="modelCode" value={carType} onChange={(e) => setCarType(e.target.value)}></input>
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
                                id="carUse" name="carUse"
                                options={carUses}
                                className="select"
                                defaultValue={carUse}
                                onChange={setCarUse}
                                styles={selectStyle}
                            />
                        </div>
                    </div>

                    <div className="row-text">
                        <div className="label">Số Máy</div>
                        <div className="text-input">
                            <input type="text" name="engineNumber" value={engine_number} onChange={(e) => setEngineNumber(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="row-text">
                        <div className="label">Số Khung</div>
                        <div className="text-input">
                            <input type="text" name="chassisNumber" value={chassis_number} onChange={(e) => setChassisNumber(e.target.value)}></input>
                        </div>
                    </div>
                </form>
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
                        <div className="label">{type === "individual" ? "Họ và tên" : "Tên doanh nghiệp"}</div>
                        <div className="text-input">
                            <input type="text" name="Name" value={name} onChange={(e) => setName(e.target.value)}></input>
                        </div>
                    </div>
                    <div className="row-text">
                        <div className="label">{type === "individual" ? "Số CMT/CCCD hoặc hộ chiếu" : "Mã số doanh nghiệp"}</div>
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
                        {type === "individual" ? "Địa chỉ thường trú" : "Địa chỉ liên lạc"}
                        <p className="line_blue"></p>
                    </div>
                        
                    <div className="row-select">
                        <div className="label">Tỉnh/Thành phố</div>
                        <div className="select-container">
                            <Select 
                                id="city" name="City"
                                options={cities}
                                className="select"
                                defaultValue={city}
                                onChange={setCity}
                                noOptionsMessage={() => "Không có lựa chọn nào"}
                                getOptionLabel={(city) => city.name_with_type}
                                getOptionValue={(city) => city.code}
                            />
                        </div>
                    </div>
    
                    <div className="row-select">
                        <div className="label">Quận/Huyện</div>
                        <div className="select-container">
                            <Select
                                id="district" name="District"
                                options={getDist(city)}
                                className="select"
                                defaultValue={district}
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
                                placeholder={ward}
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
                        <button className="button button-back" type="button" onClick={() => navigate(`/inspection/print/${inspection.register_id}`)}>Export</button>
                        <button className="button" type="button" onClick={handleEdit}>Edit</button>
                    </div>
                </form>
            </div>
          </div>
      </div>
      </>
    )
}