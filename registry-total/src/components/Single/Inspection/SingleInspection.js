import React from 'react'


export default function SingleInspection( { inspection }) {
  return (
    <>
    <div className="dashboard-layout">
        <h4 className="dashboard-title">Inspection</h4>
        <div className="statistics-line-chart">
        <div className="content">
                <h2 className="form-header">Giấy đăng kiểm</h2>
                <form>
                    {/* <div className="row-text">
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
                                placeholder={getCityByCode(registerCity)}
                                value={getCityByCode(registerCity)}
                                onChange={setRegisterCity}
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
                                value={registerDistrict}
                                onChange={setRegisterDistrict}
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
                            <input type="text" name="registerAddress" value={registerAddress} disabled={true} onChange={(e) => setRegisterAddress(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="button-container">
                        <button className="button button-back" type="button" onClick={() => setIndex("car")}>Quay lại</button>
                        <button className="button" type="button" onClick={handleAdd}>Đăng ký</button>
                    </div> */}
                </form>
            </div>
        </div>
    </div>
    </>
  )
}