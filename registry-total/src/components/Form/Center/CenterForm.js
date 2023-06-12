import React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addUser } from '../../../redux/user'
import { useDispatch } from 'react-redux';

export default function CenterForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const cities = require('../../../address/tinh_tp.json');
    const tree = require('../../../address/tree.json');

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [registerCity, setRegisterCity] = useState();
    const [registerDistrict, setRegisterDistrict] = useState();
    const [registerAddress, setRegisterAddress] = useState();

    useEffect(() => {
        setRegisterDistrict("")
    }, [registerCity])

    const getDist = (city) => {
        if (city !== undefined) {
            return tree[city.code]['quan-huyen']
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
    
    const handleAdd = (e) => {
        e.preventDefault()
        if (!username || !password || !registerCity || !registerDistrict || !registerAddress) {
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
        dispatch(addUser({
            'username': username,
            'password': password,
            'role': 'center',
            'center': {
                'city': registerCity.code,
                'district': registerDistrict.code,
                'address': registerAddress
            }
        }))
    }
    return (
        <>
            <div className="content">
                <h2 className="form-header">Đăng ký tài khoản</h2>
                <form>
                    <div className="row-text">
                        <div className="label">Tài khoản</div>
                        <div className="text-input">
                            <input type="text" name="account" defaultValue={username} onChange={(e) => setUsername(e.target.value)}></input>
                        </div>
                    </div>
                    <div className="row-text">
                        <div className="label">Mật khẩu</div>
                        <div className="text-input">
                            <input type="password" name="password" defaultValue={password} onChange={(e) => setPassword(e.target.value)}></input>
                        </div>
                    </div>
                    <div className="label-group">
                        Địa chỉ trung tâm
                        <p className="line_blue"></p>
                    </div>
                            
                    <div className="row-select">
                        <div className="label">Tỉnh/Thành phố</div>
                        <div className="select-container">
                            <Select 
                                id="registerCity" name="registerCity" options={cities}
                                className="select"
                                placeholder="Chọn Tỉnh/Thành phố"
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
                                id="registerDistrict" name="registerDistrict" options={getDist(registerCity)}
                                className="select"
                                placeholder="Chọn Quận/Huyện"
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
                            <input type="text" name="registerAddress" defaultValue={registerAddress} onChange={(e) => setRegisterAddress(e.target.value)}></input>
                        </div>
                    </div>
            
                    <div className="button-container">
                        <button className="button button-back" type="button" onClick={() => navigate(`/center`)}>Hủy bỏ</button>
                        <button className="button" type="button" onClick={handleAdd}>Đăng ký</button>
                    </div>
                </form>
            </div>
        </>
    );
}