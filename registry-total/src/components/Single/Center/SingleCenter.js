import React from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    YAxis,
    Bar,
    BarChart,
    Legend,
    RadialBar,
    RadialBarChart,
    LineChart,
    Line
} from "recharts";
import { useState, useEffect } from "react";
import axios from 'axios';
import "../../../layout/Dashboard/DashboardLayout.css";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getCarList } from '../../../redux/car'
import { getInspectionList } from '../../../redux/inspection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck, faXmark, faCarBurst, faCarOn } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom'
import { updateUser, reset } from '../../../redux/user';
import { ToastContainer, toast } from 'react-toastify'

const customStyles = {

    control: (defaultStyles) => ({
        ...defaultStyles,
        width: '95%',
        marginLeft: '10px',
        fontSize: '18px',
        fontWeight: '600',
        '&:hover': { borderColor: 'gray' },
        border: '1px solid rgba(0, 0, 0, 0.32)',
        boxShadow: 'none',
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "rgb(40, 53, 147)" }),
};

export default function SingleCenter( {user} ) {
    const navigate = useNavigate()
    const center_id = user.center.id
    const [registered_cars, setRegisteredCars] = useState([]);
    const [year_registered_cars, setYearRegisteredCars] = useState([]);
    const [yearly_registered_cars, setYearlyRegisteredCars] = useState([]);
    const [expiring_cars, setExpiringCars] = useState([]);
    const [expired_cars, setExpiredCars] = useState([]);
    const [re_regis_cars, setReRegisCars] = useState([]);
    const [selected, setSelected] = useState(null);
    const [re_regis_cars_center, setReRegisCarsCenter] = useState([]);
    const [unregistered_cars_district, setUnRegisteredCarsDistrict] = useState([]);
    const [center_month_expiring_cars, setCenterMonthExpiringCars] = useState();

    const cities = require('../../../address/tinh_tp.json');
    const tree = require('../../../address/tree.json');

    const dispatch = useDispatch()
    const cars = useSelector(state => state.car.cars)
    
    const findDist = (dist, city_code) => {
        const dists = tree[city_code]['quan-huyen']
        return dists[dists.findIndex(d => d['code'] === dist)]
    }

    const findCity = (city) => {
        return cities[cities.findIndex(c => c['code'] === city)]
    }

    const [username, setUsername] = useState(user.username);
    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [registerCity, setRegisterCity] = useState(findCity(user.center.city));
    const [registerDistrict, setRegisterDistrict] = useState(findDist(user.center.district, user.center.city));
    const [registerAddress, setRegisterAddress] = useState(user.center.address);

    const isLoading = useSelector(
        (state) => state.user.isLoading[1]
    )
    const message = useSelector(
        (state) => state.user.message
    )
    const isError = useSelector(
        (state) => state.user.isError[1]
    )

    const isSuccess = useSelector(
        (state) => state.user.isSuccess[1]
    )
    
    var expiring_month = [
        { name: "T1", Total: 0 },
        { name: "T2", Total: 0 },
        { name: "T3", Total: 0 },
        { name: "T4", Total: 0 },
        { name: "T5", Total: 0 },
        { name: "T6", Total: 0 },
        { name: "T7", Total: 0 },
        { name: "T8", Total: 0 },
        { name: "T9", Total: 0 },
        { name: "T10", Total: 0 },
        { name: "T11", Total: 0 },
        { name: "T12", Total: 0 },
    ].slice(new Date().getMonth(),)

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
            toast.success('Cập Nhật Thành Công', {
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
        toast.clearWaitingQueue();
    }, [isError, message, dispatch, isSuccess, navigate])

    const getDist = (city) => {
        if (city !== undefined) {
            return tree[city.code]['quan-huyen']
        }
        else return []
    }

    const handleCity = (e) => {
        setRegisterCity(e)
        setRegisterDistrict()
    }

    const selectStyle = {    
        control: (base, state) => ({
          ...base,
          '&:hover': { borderColor: 'gray' },
          border: '1px solid rgba(0, 0, 0, 0.32)',
          boxShadow: 'none',
      }),
    };

    useEffect(() => {
        dispatch(getCarList())
        dispatch(getInspectionList())
    }, [dispatch]);
    

    const inspections = useSelector(state => state.inspection.inspections).filter(inspection => inspection.center.id == center_id)

    const BASE_URL = "http://localhost:8000/api/"

    useEffect(() => {
        window.addEventListener('error', e => {
          if (e.message === 'ResizeObserver loop limit exceeded') {
              const resizeObserverErrDiv = document.getElementById(
                  'webpack-dev-server-client-overlay-div'
              );
              const resizeObserverErr = document.getElementById(
                  'webpack-dev-server-client-overlay'
              );
              if (resizeObserverErr) {
                  resizeObserverErr.setAttribute('style', 'display: none');
              }
              if (resizeObserverErrDiv) {
                  resizeObserverErrDiv.setAttribute('style', 'display: none');
              }
          }
      });

        const getUnRegisteredCarsDistrict = async () => {
            try {
                const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
                const response = await axios.create({
                baseURL: BASE_URL,
                headers: { token: `${TOKEN}` },
            }).get("/car/unregisdistrict/all");

                const data = response.data;
                data.forEach( obj => renameKey( obj, 'owner__city', 'name' ) );
                data.forEach( obj => renameKey( obj, 'count', 'NewRegis' ) );
                data.forEach( obj => obj['name'] = findCity(obj['name']));
                setUnRegisteredCarsDistrict(data);
            } catch(e) {
                console.log(e)
            }};
        getUnRegisteredCarsDistrict();

        const getReRegisCarsCenter = async () => {
            try {
                const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
                const response = await axios.create({
                baseURL: BASE_URL,
                headers: { token: `${TOKEN}` },
            }).get(`/form/forecast/center/${center_id}`);
                console.log(response.data);
                setReRegisCarsCenter(response.data);
            } catch(e) {
                console.log(e)
            }};
        getReRegisCarsCenter();

        const getRegisteredCars = async () => {
            try {
                const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
                const response = await axios.create({
                baseURL: BASE_URL,
                headers: { token: `${TOKEN}` },
            }).get(`/form/register/all/${center_id}`);
            
                setRegisteredCars(response.data);
            } catch(e) {
                console.log(e)
            }};
            getRegisteredCars();

        const getExpiringCars = async () => {
            try {
                const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
                const response = await axios.create({
                    baseURL: BASE_URL,
                    headers: { token: `${TOKEN}` },
                }).get(`/form/expiring/all/${center_id}`);
                
                setExpiringCars(response.data);
            } catch(e) {
                console.log(e)
            }};
            getExpiringCars();

        const getExpiredCars = async () => {
        try {
            const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
            const response = await axios.create({
                baseURL: BASE_URL,
                headers: { token: `${TOKEN}` },
            }).get(`/form/expired/all/${center_id}`);
            setExpiredCars(response.data);
        } catch(e) {
            console.log(e)
        }};
        getExpiredCars();

        const getYearlyRegisteredCars = async () => {
            try {
                const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
                const response = await axios.create({
                    baseURL: BASE_URL,
                    headers: { token: `${TOKEN}` },
                }).get(`/form/register/byyear/all/${center_id}`);
                const data = response.data;
                data.forEach( obj => renameKey( obj, 'register_date__year', 'name' ) );
                data.forEach( obj => renameKey( obj, 'count', 'Total' ) );
                setYearlyRegisteredCars(data);
            } catch(e) {
                console.log(e)
            }};
            getYearlyRegisteredCars();
        
        async function getCenterMonthExpiringCars() {
            try {
                const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
                const response = await axios.create({
                        baseURL: BASE_URL,
                        headers: { token: `${TOKEN}` },
                }).get("/form/expiring/center");
                const data = response.data;
                data.forEach( obj => renameKey( obj, 'expired_date__month', 'name' ) );
                data.forEach( obj => renameKey( obj, 'count', 'Total' ) );
                console.log(data)
                setCenterMonthExpiringCars(data);
            } catch(e) {
                console.log(e)
            }};
        getCenterMonthExpiringCars();
    }, []);

    function renameKey(obj, oldKey, newKey) {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
    }
    
    async function getYearRegisteredCars(url) {
        try {
            const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
            const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).get(url);
            
            setYearRegisteredCars(response.data);
        } catch(e) {
            console.log(e)
        }
    };

    const years = [
        { value: `/form/register/bymonth/2022/${center_id}`, label: '2022' },
        { value: `/form/register/bymonth/2023/${center_id}`, label: '2023' }
    ]

    const handleChange = (selectedOption) => {
        setSelected(selectedOption);
        getYearRegisteredCars(selectedOption.value);
    };

    var month = [
        { name: "Jan", Total: 0 },
        { name: "Feb", Total: 0 },
        { name: "Mar", Total: 0 },
        { name: "Apr", Total: 0 },
        { name: "May", Total: 0 },
        { name: "June", Total: 0 },
        { name: "July", Total: 0 },
        { name: "Aug", Total: 0 },
        { name: "Sep", Total: 0 },
        { name: "Oct", Total: 0 },
        { name: "Nov", Total: 0 },
        { name: "Dec", Total: 0 },
    ];

    var quarter = [
        { name: "1", Total: 0 },
        { name: "2", Total: 0 },
        { name: "3", Total: 0 },
        { name: "4", Total: 0 }
    ];

    var total;
    
    function selectdata() {
        var months = year_registered_cars;
            for (var i=0;i<months.length;i++) {
                if (months[i].register_date__month===1) {
                    month[0].Total = months[i].count;
                    quarter[0].Total += months[i].count;
                } else if (months[i].register_date__month===2) {
                    month[1].Total = months[i].count;
                    quarter[0].Total += months[i].count;
                } else if (months[i].register_date__month===3) {
                    month[2].Total = months[i].count;
                    quarter[0].Total += months[i].count;
                } else if (months[i].register_date__month===4) {
                    month[3].Total = months[i].count;
                    quarter[1].Total += months[i].count;
                } else if (months[i].register_date__month===5) {
                    month[4].Total = months[i].count;
                    quarter[1].Total += months[i].count;
                } else if (months[i].register_date__month===6) {
                    month[5].Total = months[i].count;
                    quarter[1].Total += months[i].count;
                } else if (months[i].register_date__month===7) {
                    month[6].Total = months[i].count;
                    quarter[2].Total += months[i].count;
                } else if (months[i].register_date__month===8) {
                    month[7].Total = months[i].count;
                    quarter[2].Total += months[i].count;
                } else if (months[i].register_date__month===9) {
                    month[8].Total = months[i].count;
                    quarter[2].Total += months[i].count;
                } else if (months[i].register_date__month===10) {
                    month[9].Total = months[i].count;
                    quarter[3].Total += months[i].count;
                } else if (months[i].register_date__month===11) {
                    month[10].Total = months[i].count;
                    quarter[3].Total += months[i].count;
                } else if (months[i].register_date__month===12) {
                    month[11].Total = months[i].count;
                    quarter[3].Total += months[i].count;
                }
            }
        total = quarter[0].Total + quarter[1].Total  + quarter[2].Total  + quarter[3].Total ;
        return month;
    }

    function getNewRegis() {
        const city = findCity(user.center.city);
        for (let i=0;i<unregistered_cars_district.length;i++) {
            if (unregistered_cars_district[i].name === city) {
                return unregistered_cars_district[i].NewRegis;
            }
        }
        return 0;
    }

    function expiringMonth() {
        var months = center_month_expiring_cars;
        
        if (months) {
            console.log(months[0])
            for (var i = 0; i < months.length; i++) {
                for (var j = 0; j < expiring_month.length; j++) {
                    if (months[i].name === j + new Date().getMonth() + 1) {
                        expiring_month[j].Total = months[i].Total;
                    }
                }
            }
            console.log(expiring_month)
            return expiring_month;
        }
    }
    
    const handleEdit = (e) => {
        e.preventDefault()
        console.log({username, registerCity, registerDistrict, registerAddress})
        if (!username || !registerCity || !registerDistrict || !registerAddress) {
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
        if (!oldPassword && newPassword) {
            return toast.error('Hãy nhập mật khẩu cũ', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            })
        }
        if (oldPassword && !newPassword) {
            return toast.error('Hãy nhập mật khẩu mới', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            })
        }
        if (oldPassword && newPassword) {
            dispatch(updateUser({
                'username': username,
                'oldpassword': oldPassword,
                'newpassword': newPassword,
                'role': 'center',
                'center': {
                    'id': user.center.id,
                    'city': registerCity.code,
                    'district': registerDistrict.code,
                    'address': registerAddress
                }
            }))

        } else {
            dispatch(updateUser({
                'username': username,
                'role': 'center',
                'center': {
                    'id': user.center.id,
                    'city': registerCity.code,
                    'district': registerDistrict.code,
                    'address': registerAddress
                }
            }))
        }
    }

    return (
        <>
        <ToastContainer limit={1}/>
        <div className="dashboard-layout">
            <h5 className="dashboard-title">Thông Tin</h5>
            <form className="block-content-container">
                <div className="label-group">
                    Thông Tin Đăng Nhập
                    <p className="line_blue"></p>
                </div>

                <div className="row-text">
                    <div className="label">Tên Đăng Nhập</div>
                    <div className="text-input">
                        <input type="text" name="account" defaultValue={username} onChange={(e) => setUsername(e.target.value)}></input>
                    </div>
                </div>

                <div className="row-text">
                    <div className="label">Mật Khẩu Cũ</div>
                    <div className="text-input">
                        <input type="password" name="oldpassword" defaultValue={oldPassword} onChange={(e) => setOldPassword(e.target.value)}></input>
                    </div>
                </div>

                <div className="row-text">
                    <div className="label">Mật Khẩu Mới</div>
                    <div className="text-input">
                        <input type="password" name="newpassword" defaultValue={newPassword} onChange={(e) => setNewPassword(e.target.value)}></input>
                    </div>
                </div>

                <div className="label-group">
                    Thông Tin Trung Tâm
                    <p className="line_blue"></p>
                </div>

                <div className="row-select">
                    <div className="label">Tỉnh/Thành phố</div>
                    <div className="select-container">
                        <Select 
                            id="registerCity" name="registerCity" options={cities}
                            className="select"
                            placeholder="Chọn Tỉnh/Thành phố"
                            value={registerCity ? registerCity : ''}
                            onChange={handleCity}
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
                            value={registerDistrict ? registerDistrict : ''}
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
                    <button className="button button-back" type="button" onClick={() => navigate(`/centers`)}>Hủy bỏ</button>
                    <button className="button" type="button" onClick={handleEdit}>Cập Nhật</button>
                </div>
            </form>
        </div>
        <div className="dashboard-layout">
            <h5 className="dashboard-title">Thống kê</h5>
            {registered_cars && expiring_cars && expired_cars && 
            <div className="card-grid">
                <>
                <div className="statistics-card">
                        <div className="card-text">
                            <h4>{registered_cars.count}</h4>
                            <p>Ô Tô Đã Đăng Kiểm</p>
                        </div>
                      <div className="card-icon">
                        <FontAwesomeIcon icon={faListCheck}/>
                      </div>
                    </div>
                    <div className="statistics-card">
                        <div className="card-text">
                            <h4>{expiring_cars.length}</h4>
                            <p>Ô Tô Sắp Hết Hạn Đăng Kiểm</p>
                        </div>
                        <div className="card-icon">
                            <FontAwesomeIcon icon={faCarBurst} />
                        </div>
                    </div>
                    <div className="statistics-card">
                        <div className="card-text">
                            <h4>{expired_cars.count}</h4>
                            <p>Ô Tô Đã Hết Hạn Đăng Kiểm</p>
                        </div>
                        <div className="card-icon">
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                    </div>
                    <div className="statistics-card">
                        <div className="card-text">
                            <p>Dự báo</p>
                            <h4>{Math.round(getNewRegis()*(parseInt(user.center.id)%9)/10)}</h4>
                            <p>Ô Tô Đăng Kiểm Mới</p>
                        </div>
                        <div className="card-icon">
                            <FontAwesomeIcon icon={faCarOn} />
                        </div>
                    </div>
                    <div className="statistics-card">
                        <div className="card-text">
                            <p>Dự báo</p>
                            <h4>{re_regis_cars_center.count}</h4>
                            <p>Ô Tô Đăng Kiểm Lại</p>
                        </div>
                        <div className="card-icon">
                            <FontAwesomeIcon icon={faCarOn} />
                        </div>
                    </div>
                </>
            </div>
            }
            {yearly_registered_cars.length !== 0 &&
            <div className="block-content-container">
                <div className="chart-title-container">
                    <h4 className="chart-title">Số lượng xe ô tô đã đăng kiểm qua các năm</h4>
                </div>
                <div style={{display: 'flex'}}>
                  <div className="statistics-line-chart">
                    <div style={{overflowX: 'scroll', paddingBottom: '16px'}}>
                        <ResponsiveContainer width={1000} height={400}>
                            <LineChart width={730} height={250} 
                                data={yearly_registered_cars}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Total" stroke="#8884d8" />
                            </LineChart>
                      </ResponsiveContainer>
                      </div>
                    </div>
                </div>
            </div>}
            <div className="block-content-container">
                <div className="chart-title-container">
                    <h4 className="chart-title">Số lượng xe ô tô đã đăng kiểm trong năm</h4>
                    <Select options={years} onChange={handleChange} styles={customStyles}/>
                </div>
                <div className="statistics-container">
                  <div className="statistics-line-chart" style={{padding: '16px'}}>
                    <div style={{overflowX: 'scroll', paddingBottom: '8px'}}>
                        <ResponsiveContainer width={800} height={400}>
                          <AreaChart
                            data={selectdata()}
                          >
                          <defs>
                              <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="rgb(23, 193, 232)" stopOpacity={0.2} />
                              <stop offset="70%" stopColor="rgb(23, 193, 232)" stopOpacity={0.1} />
                              </linearGradient>
                              <linearGradient id="missing" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} />
                              <stop offset="70%" stopColor="#8884d8" stopOpacity={0.2} />
                              </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="gray" />
                          <YAxis/>
                          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
                          <Tooltip />
                          <Area
                              type="monotone"
                              dataKey="Total"
                              stroke="rgb(23, 193, 232)"
                              fillOpacity={1}
                              strokeWidth={4}
                              fill="url(#total)"
                          />
                          <Area
                              type="monotone"
                              dataKey="Missing"
                              stroke="#8884d8"
                              fillOpacity={1}
                              strokeWidth={4}
                              fill="url(#missing)"
                          />
                          </AreaChart>
                      </ResponsiveContainer>
                      </div>
                    </div>
                    {total !== 0 ? (
                        <>
                        <div className="quater-container">
                            <span className="statis">Thống kê theo từng quý</span>
                            <hr className="space"></hr>
                            <ul className="progress-bar">
                                <li>
                                    <div style = {{width:"100%"}}>
                                        <p className="quarter">
                                            Quý 1 ({quarter[0].Total} / {total})
                                        </p>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress
                                            sx={{backgroundColor: 'rgb(237, 237, 237)', 
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: 'rgb(236, 64, 122)',
                                                }}} 
                                            variant="determinate" value={quarter[0].Total * 100 / total}>
                                            </LinearProgress>
                                        </Box>
                                    </div>
                                </li>
                                <li>
                                    <div style = {{width:"100%"}}>
                                        <p className="quarter">
                                            Quý 2 ({quarter[1].Total} / {total})
                                        </p>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress sx={{backgroundColor: 'rgb(237, 237, 237)', 
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: 'rgb(251, 140, 0)'
                                                }}} 
                                            variant="determinate" value={quarter[1].Total * 100 / total} />
                                        </Box>
                                    </div>
                                </li>
                                <li>
                                    <div style = {{width:"100%"}}>
                                        <p className="quarter">
                                            Quý 3 ({quarter[2].Total} / {total})
                                        </p>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress sx={{backgroundColor: 'rgb(237, 237, 237)', 
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: 'rgb(124, 179, 66)'
                                                }}} 
                                                variant="determinate" value={quarter[2].Total * 100 / total} />
                                        </Box>
                                    </div>
                                </li>
                                <li>
                                    <div style = {{width:"100%"}}>
                                        <p className="quarter">
                                            Quý 4 ({quarter[3].Total} / {total})
                                        </p>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress sx={{backgroundColor: 'rgb(237, 237, 237)', 
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: 'rgb(3, 169, 244)'
                                                }}} 
                                                variant="determinate" value={quarter[3].Total * 100 / total} />
                                        </Box>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </>
                    ) : (
                  <>
                  <div className="quater-container">
                            <span className="statis">Thống kê theo từng quý</span>
                            <hr className="space"></hr>
                            <ul className="progress-bar">
                                <li>
                                    <div style = {{width:"100%"}}>
                                        <p className="quarter">
                                            Quý 1
                                        </p>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress sx={{backgroundColor: 'rgb(237, 237, 237)', 
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: 'rgb(236, 64, 122)'
                                                }}} 
                                            variant="determinate" value={0} />
                                        </Box>
                                    </div>
                                </li>
                                <li>
                                    <div style = {{width:"100%"}}>
                                        <p className="quarter">
                                            Quý 2
                                        </p>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress sx={{backgroundColor: 'rgb(237, 237, 237)', 
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: 'rgb(251, 140, 0)'
                                                }}} 
                                            variant="determinate" value={0} />
                                        </Box>
                                    </div>
                                </li>
                                <li>
                                    <div style = {{width:"100%"}}>
                                        <p className="quarter">
                                            Quý 3
                                        </p>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress sx={{backgroundColor: 'rgb(237, 237, 237)', 
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: 'rgb(124, 179, 66)'
                                                }}} 
                                                variant="determinate" value={0} />
                                        </Box>
                                    </div>
                                </li>
                                <li>
                                    <div style = {{width:"100%"}}>
                                        <p className="quarter">
                                            Quý 4
                                        </p>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress sx={{backgroundColor: 'rgb(237, 237, 237)', 
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: 'rgb(3, 169, 244)'
                                                }}} 
                                                variant="determinate" value={0} />
                                        </Box>
                                    </div>
                                </li>
                            </ul>
                        </div>
                  </>
                    )
                }
                </div>
                
            </div>
            <div className="block-content-container">
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '36px'}}>
                        <h4 className="chart-title">Số lượng xe ô tô hết hạn đăng kiểm hàng tháng</h4>
                    </div>
                    <div style={{display: 'flex'}}>
                    <div className="statistics-line-chart">
                        <div style={{overflowX: 'scroll', paddingBottom: '16px'}}>
                            <ResponsiveContainer width={1000} height={400}>
                                <BarChart
                                    data={expiringMonth()}
                                    name
                                >
                                    <Bar dataKey="Total" fill="#8884d8" />
                                    <XAxis dataKey="name" stroke="gray" />
                                    <YAxis/>
                                    <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
                                    <Legend />

                                </BarChart>
                        </ResponsiveContainer>
                        </div>
                        </div>
                    </div>
                </div>
        </div>
    </>
  )
}