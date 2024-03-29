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
    LineChart,
    Line
} from "recharts";
import { useState, useEffect } from "react";
import axios from 'axios';
import "./DashboardLayout.css";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getCarList } from '../../redux/car'
import { getInspectionList } from '../../redux/inspection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck, faXmark, faCarBurst, faCarOn } from "@fortawesome/free-solid-svg-icons";

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

export default function DashboardLayout() {
    const user = useSelector((state) => state.auth.user);
    const [unregistered_cars, setUnRegisteredCars] = useState([]);
    const [unregistered_cars_district, setUnRegisteredCarsDistrict] = useState([]);
    const [forecast, setForecast] = useState([]);
    const [re_registered_cars, setReRegisCars] = useState([]);
    const [registered_cars, setRegisteredCars] = useState([]);
    const [year_registered_cars, setYearRegisteredCars] = useState([]);
    const [yearly_registered_cars, setYearlyRegisteredCars] = useState([]);
    const [expiring_cars, setExpiringCars] = useState([]);
    const [expired_cars, setExpiredCars] = useState([]);
    const [re_regis_cars_center, setReRegisCarsCenter] = useState([]);
    const [re_regis_cars_district, setReRegisCarsDistrict] = useState([]);
    const [re_regis_cars_dep, setReRegisCarsDep] = useState([]);
    const [city_year_registered_cars, setCityYearRegisteredCars] = useState([]);
    const [city_year_registered_cars_2, setCityYearRegisteredCars2] = useState();
    const [city_month_registered_cars, setCityMonthRegisteredCars] = useState([]);
    const [city_month_registered_cars_2, setCityMonthRegisteredCars2] = useState();
    const [city_month_expiring_cars, setCityMonthExpiringCars] = useState();
    const [center_month_expiring_cars, setCenterMonthExpiringCars] = useState();
    const [selected, setSelected] = useState(null);

    const cities = require('../../address/tinh_tp.json');

    const findCity = (city) => {
        return cities[cities.findIndex(c => c['code'] === city)].name
    }

    const dispatch = useDispatch()
    const cars = useSelector(state => state.car.cars)
    useEffect(() => {
        dispatch(getCarList())
    }, [dispatch]);

    const inspections = useSelector(state => state.inspection.inspections)
    useEffect(() => {
        dispatch(getInspectionList())
    }, [dispatch]);

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

      const getUnRegisteredCars = async () => {
        try {
            const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
            const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).get("/car/unregis/all");
        
            setUnRegisteredCars(response.data);
        } catch(e) {
            console.log(e)
        }};
        getUnRegisteredCars();

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

        const getReRegisCars = async () => {
            try {
                const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
                const response = await axios.create({
                baseURL: BASE_URL,
                headers: { token: `${TOKEN}` },
            }).get("/form/forecast/total");
            
                setReRegisCars(response.data);
            } catch(e) {
                console.log(e)
            }};
        getReRegisCars();

        const getReRegisCarsCenter = async () => {
            try {
                const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
                const response = await axios.create({
                baseURL: BASE_URL,
                headers: { token: `${TOKEN}` },
            }).get("/form/forecast/center");
            
                setReRegisCarsCenter(response.data);
            } catch(e) {
                console.log(e)
            }};
        getReRegisCarsCenter();


        const getReRegisCarsDep = async () => {
            try {
                const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
                const response = await axios.create({
                    baseURL: BASE_URL,
                    headers: { token: `${TOKEN}` },
                }).get("/form/forecast/all");

                const data = response.data;
                data.forEach( obj => renameKey( obj, 'center_id', 'name' ) );
                data.forEach( obj => renameKey( obj, 'count', 'ReRegis' ) );
                data.forEach( obj => obj['NewRegis'] = Math.round(unregistered_cars*(parseInt(obj.name)%9)/10));
                setReRegisCarsDep(data);
            } catch(e) {
                console.log(e)
            }};
        getReRegisCarsDep();

        const getReRegisCarsDistrict = async () => {
            try {
                const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
                const response = await axios.create({
                    baseURL: BASE_URL,
                    headers: { token: `${TOKEN}` },
                }).get("/form/forecast/district");

                const data = response.data;
                data.forEach( obj => renameKey( obj, 'center__city', 'name' ) );
                data.forEach( obj => renameKey( obj, 'count', 'ReRegis' ) );
                data.forEach( obj => obj['name'] = findCity(obj['name']));
                setReRegisCarsDistrict(data);
            } catch(e) {
                console.log(e)
            }};
        getReRegisCarsDistrict();


        const getRegisteredCars = async () => {
            try {
                const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
                const response = await axios.create({
                baseURL: BASE_URL,
                headers: { token: `${TOKEN}` },
            }).get("/form/register/all");
            
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
                }).get("/form/expiring/all");
                
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
            }).get("/form/expired/all");
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
                }).get("/form/register/byyear/all");
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
            getCenterMonthExpiringCars()
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

    async function getCityYearRegisteredCars(url) {
        try {
            const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
            const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).get(url);
            const data = response.data;
            data.forEach( obj => renameKey( obj, 'center__city', 'name' ) );
            data.forEach( obj => renameKey( obj, 'count', 'Total' ) );
            data.forEach( obj => obj['name'] = findCity(obj['name']));
            setCityYearRegisteredCars(data);
        } catch(e) {
            console.log(e)
        }
    };

    async function getCityMonthRegisteredCars(url) {
        try {
            const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
            const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).get(url);
            const data = response.data;
            data.forEach( obj => renameKey( obj, 'center__city', 'name' ) );
            data.forEach( obj => renameKey( obj, 'count', 'Total' ) );
            data.forEach( obj => obj['name'] = findCity(obj['name']));
            setCityMonthRegisteredCars(data);
        } catch(e) {
            console.log(e)
        }
    };

    async function getCityMonthExpiringCars(url) {
        try {
            const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
            const response = await axios.create({
                baseURL: BASE_URL,
                headers: { token: `${TOKEN}` },
            }).get(url);
            const data = response.data;
            data.forEach( obj => renameKey( obj, 'center__city', 'name' ) );
            data.forEach( obj => renameKey( obj, 'count', 'Total' ) );
            data.forEach( obj => obj['name'] = findCity(obj['name']));
            setCityMonthExpiringCars(data);
        } catch(e) {
            console.log(e)
        }};

    const years = (user.role === 'center') ? ([
        { value: '/form/register/bymonth/2022', label: '2022' },
        { value: '/form/register/bymonth/2023', label: '2023' }
    ]) : ([
        { value: '/form/register/bymonth/all/2022', label: '2022' },
        { value: '/form/register/bymonth/all/2023', label: '2023' }
    ])

    const city_years = (user.role === 'department') ? ([
        { value: '/form/register/city_year/2022', label: '2022' },
        { value: '/form/register/city_year/2023', label: '2023' }
    ]) : ([])

    const city_month_years = (user.role === 'department') ? ([
        { value: '/form/register/city_month/2022', label: '2022' },
        { value: '/form/register/city_month/2023', label: '2023' }
    ]) : ([])

    const city_months = [
        { value: '/1', label: '1' },
        { value: '/2', label: '2' },
        { value: '/3', label: '3' },
        { value: '/4', label: '4' },
        { value: '/5', label: '5' },
        { value: '/6', label: '6' },
        { value: '/7', label: '7' },
        { value: '/8', label: '8' },
        { value: '/9', label: '9' },
        { value: '/10', label: '10' },
        { value: '/11', label: '11' },
        { value: '/12', label: '12' },
    ]

    const handleChange = (selectedOption) => {
        setSelected(selectedOption);
        getYearRegisteredCars(selectedOption.value);
    };

    const handleChangeCityYear = (selectedOption) => {
        getCityYearRegisteredCars(selectedOption.value)
    };

    const handleChangeCityYear2 = (selectedOption) => {
        setCityYearRegisteredCars2(selectedOption.value)
    };

    const handleChangeCityMonth = (selectedOption) => {
        setCityMonthRegisteredCars2(selectedOption.value)
    };

    const handleChangeCityMonthExpiring = (selectedOption) => {
        getCityMonthExpiringCars("form/expiring/city" + selectedOption.value)
    };

    const handleClick = () => {
        city_month_registered_cars_2 && city_year_registered_cars_2 && getCityMonthRegisteredCars(city_year_registered_cars_2 + city_month_registered_cars_2)
    }

    var month = [
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
    ];

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
    
    var quarter = [
        { name: "1", Total: 0 },
        { name: "2", Total: 0 },
        { name: "3", Total: 0 },
        { name: "4", Total: 0 }
    ];

    var total;
    
    function datamonth() {
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

    function expiringMonth() {
        var months = center_month_expiring_cars;
        console.log(months)
        if (months) {
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
    
    const getTotalCount = (list) => {
        if (list.length === 0) {
            return 0
        } else {
            let sum = 0
            for(let i = 0; i < list.length; i++) {
                sum += list[i].count
            }
            return sum
        }
    }

    const place = ([
        { value: 'district', label: 'Khu vực' },
        { value: 'center', label: 'Trung tâm' }
    ])

    const handleChangePlace = (selectedOption) => {
        setSelected(selectedOption);

        if (selectedOption.value !== 'district') {
            for (let i=0;i<re_regis_cars_dep.length;i++) {
                re_regis_cars_dep[i]['NewRegis'] = Math.round(getNewRegisDep(re_regis_cars_dep[i].center__city)*(parseInt(re_regis_cars_dep[i].name)%9)/10);
            }
            setForecast(re_regis_cars_dep);
        }
        else {
            for (let i=0;i<unregistered_cars_district.length;i++) {
                for (let j=0;j<re_regis_cars_district.length;j++) {
                    if (unregistered_cars_district[i].name === re_regis_cars_district[j].name) {
                        re_regis_cars_district[j]['NewRegis'] = unregistered_cars_district[i].NewRegis;
                        continue;
                    }
                }
            }
            setForecast(re_regis_cars_district);
        }
    };

    function getNewRegis() {
        const city = findCity(user.center.city);
        for (let i=0;i<unregistered_cars_district.length;i++) {
            if (unregistered_cars_district[i].name === city) {
                return unregistered_cars_district[i].NewRegis;
            }
        }
        return 0;
    }

    function getNewRegisDep(code) {
        const city = findCity(code);
        for (let i=0;i<unregistered_cars_district.length;i++) {
            if (unregistered_cars_district[i].name === city) {
                return unregistered_cars_district[i].NewRegis;
            }
        }
        return 0;
    }
    
    return (
        <div className="dashboard-layout">
            <h4 className="dashboard-title">Dashboard</h4>
            {registered_cars && expiring_cars && expired_cars && 
            <div className="card-grid">
              { user.role === 'center' ? (
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
                ) : (
                  <>
                    <div className="statistics-card">
                        <div className="card-text">
                            <h4>{getTotalCount(registered_cars)}</h4>
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
                            <h4>{getTotalCount(expired_cars)}</h4>
                            <p>Ô Tô Đã Hết Hạn Đăng Kiểm</p>
                        </div>
                        <div className="card-icon">
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                    </div>
                    <div className="statistics-card">
                        <div className="card-text">
                            <p>Dự báo</p>
                            <h4>{unregistered_cars}</h4>
                            <p>Ô Tô Đăng Kiểm Mới</p>
                        </div>
                        <div className="card-icon">
                            <FontAwesomeIcon icon={faCarOn} />
                        </div>
                    </div>
                    <div className="statistics-card">
                        <div className="card-text">
                            <p>Dự báo</p>
                            <h4>{re_registered_cars}</h4>
                            <p>Ô Tô Đăng Kiểm Lại</p>
                        </div>
                        <div className="card-icon">
                            <FontAwesomeIcon icon={faCarOn} />
                        </div>
                    </div>
                </>
                )
              }
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
                        <ResponsiveContainer width={1100} height={400}>
                            <LineChart
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
                    <div className="chart-select">
                        <Select options={years} onChange={handleChange} styles={customStyles} placeholder="Chọn năm"/>
                    </div>
                </div>
                <div className="statistics-container">
                  <div className="statistics-line-chart" style={{padding: '16px'}}>
                    <div style={{overflowX: 'scroll', paddingBottom: '8px'}}>
                        <ResponsiveContainer width={800} height={400}>
                          <AreaChart
                            data={datamonth()}
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
            {user.role === 'department' &&
                <div className="block-content-container">
                    <div className="chart-title-container">
                        <h4 className="chart-title">Số lượng xe ô tô đã đăng kiểm theo khu vực trong năm</h4>
                        <div className="chart-select">
                            <Select options={city_years} onChange={handleChangeCityYear} styles={customStyles} placeholder="Chọn năm"/>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                    <div className="statistics-line-chart">
                        <div style={{overflowX: 'scroll', paddingBottom: '16px'}}>
                            <ResponsiveContainer width={1100} height={400}>
                                <BarChart
                                    data={city_year_registered_cars}
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
            }
            {user.role === 'department' &&
                <div className="block-content-container">
                    <div className="special-chart-title-container">
                        <h4 className="chart-title">Số lượng xe ô tô đã đăng kiểm theo khu vực trong tháng</h4>
                        <div className="chart-select-container">
                            <div className="chart-select">
                                <Select options={city_months} onChange={handleChangeCityMonth} styles={customStyles} placeholder="Chọn tháng"/>
                                <span style={{paddingLeft:"12px"}}>-</span>
                                <Select options={city_month_years} onChange={handleChangeCityYear2} styles={customStyles} placeholder="Chọn năm"/>
                            </div>
                            <span>
                                <button type='button' className='link primary-btn' onClick={handleClick}>Lọc</button>
                            </span>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                    <div className="statistics-line-chart">
                        <div style={{overflowX: 'scroll', paddingBottom: '16px'}}>
                            <ResponsiveContainer width={1100} height={400}>
                                <BarChart
                                    data={city_month_registered_cars}
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
            }
            {user.role === 'department' &&
                <div className="block-content-container">
                    <div className="chart-title-container">
                        <h4 className="chart-title">Số lượng xe ô tô hết hạn đăng kiểm theo khu vực trong tháng</h4>
                        <div className="chart-select">
                            <Select options={city_months.slice(new Date().getMonth(),)} onChange={handleChangeCityMonthExpiring} styles={customStyles} placeholder="Chọn tháng"/>
                            <span className="chart-title" style={{paddingLeft:"12px"}}>- {new Date().getFullYear()}</span>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                    <div className="statistics-line-chart">
                        <div style={{overflowX: 'scroll', paddingBottom: '16px'}}>
                            <ResponsiveContainer width={1100} height={400}>
                                <BarChart
                                    data={city_month_expiring_cars}
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
            }
            {user.role === 'department' &&
                <div className="block-content-container">
                    <div className="chart-title-container">
                        <h4 className="chart-title">Dự báo số lượng xe ô tô đăng kiểm mới và đăng kiểm lại</h4>
                        <div className="chart-select">
                            <Select options={place} onChange={handleChangePlace} styles={customStyles} placeholder="Chọn bộ lọc"/>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                    <div className="statistics-line-chart">
                        <div style={{overflowX: 'scroll', paddingBottom: '16px'}}>
                            <ResponsiveContainer width={1100} height={'100%'}>
                                <BarChart
                                    data={forecast}
                                    name
                                >
                                    <Bar dataKey="ReRegis" fill="#8884d8" />
                                    <Bar dataKey="NewRegis" fill="#82ca9d" />
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
            }
            {user.role === 'center' &&
                <div className="block-content-container">
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '36px'}}>
                        <h4 className="chart-title">Số lượng xe ô tô hết hạn đăng kiểm hàng tháng</h4>
                    </div>
                    <div style={{display: 'flex'}}>
                    <div className="statistics-line-chart">
                        <div style={{overflowX: 'scroll', paddingBottom: '16px'}}>
                            <ResponsiveContainer width={1100} height={400}>
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
            }
        </div>
  )
}