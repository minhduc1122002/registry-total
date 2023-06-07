import React from "react";
import './UserForm.css';
import { useState, useEffect } from "react";
import Select from "react-select";

export default function Form() {
    const cities = require('../../address/tinh_tp.json');
    const tree = require('../../address/tree.json');

    const [account, setAccount] = useState();
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
    
    return (
        <div className="form-container">
            <div className="content">
                        <h1 className="form-header">Đăng ký tài khoản</h1>
                        <form>
                            <div className="row-text">
                                <div className="label">Tài khoản</div>
                                <div className="text-input">
                                    <input type="text" name="account" value={account} onChange={(e) => setAccount(e.target.value)}></input>
                                </div>
                            </div>
                            <div className="row-text">
                                <div className="label">Mật khẩu</div>
                                <div className="text-input">
                                    <input type="text" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
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
                                        id="registerDistrict" name="registerDistrict" options={getDist(registerCity)}
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
                                <button className="button button-quit" type="button">Hủy bỏ</button>
                                <button className="button" type="button">Đăng ký</button>
                            </div>
                        </form>
                    </div>
        </div>
    );
}