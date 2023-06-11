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
    RadialBarChart
} from "recharts";
import Table from '../../components/Table/InspectionTable'
import { useState, useEffect } from "react";
import axios from 'axios';
import "./DashboardLayout.css";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getCarList } from '../../redux/car'
import { getInspectionList } from '../../redux/inspection'

const customStyles = {

    control: (defaultStyles) => ({
        ...defaultStyles,
        width: '95%',
        marginLeft: '10px'
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "black" }),
  };

export default function DashboardLayout() {
    const user = useSelector((state) => state.auth.user);
    const [registered_cars, setRegisteredCars] = useState([]);
    const [year_registered_cars, setYearRegisteredCars] = useState([]);
    const [yearly_registered_cars, setYearlyRegisteredCars] = useState([]);
    const [expiring_cars, setExpiringCars] = useState([]);
    const [expired_cars, setExpiredCars] = useState([]);
    const [re_regis_cars, setReRegisCars] = useState([]);
    const [selected, setSelected] = useState(null);

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

    const years = (user.role === 'center') ? ([
        { value: '/form/register/bymonth/2022', label: '2022' },
        { value: '/form/register/bymonth/2023', label: '2023' }
    ]) : ([
        { value: '/form/register/bymonth/all/2022', label: '2022' },
        { value: '/form/register/bymonth/all/2023', label: '2023' }
    ])

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
        return month;
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

    const new_regis_cars = cars.length - inspections.length;

    const getReRegisCars = () => {
        let total = 0;
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        for(let i = 0; i < inspections.length; i++) {
            const expired_date = new Date(inspections[i].expired_date);
            if (expired_date.getFullYear() === year) {
                if (expired_date.getMonth() - month <= 2) {
                    total += 1;
                }
            } 
        }
        return total;
    };
    
    return (
        <div className="dashboard-layout">
            <h4 className="dashboard-title">Dashboard</h4>
            {registered_cars && expiring_cars && expired_cars && 
            <div className="card-grid">
              { user.role === 'center' ? (
                  <>
                    <div className="statistics-card">
                        <h4>{registered_cars.count}</h4>
                        <p>Ô Tô Đã Đăng Kiểm</p>
                    </div>
                    <div className="statistics-card">
                        <h4>{expiring_cars.length}</h4>
                        <p>Ô Tô Sắp Hết Hạn Đăng Kiểm</p>
                    </div>
                    <div className="statistics-card">
                        <h4>{expired_cars.count}</h4>
                        <p>Ô Tô Đã Hết Hạn Đăng Kiểm</p>
                    </div>
                    <div className="statistics-card">
                        <p>Dự báo</p>
                        <h4>{new_regis_cars}</h4>
                        <p>Ô Tô Đăng Kiểm Mới</p>
                    </div>
                    <div className="statistics-card">
                        <p>Dự báo</p>
                        <h4>{getReRegisCars()}</h4>
                        <p>Ô Tô Đăng Kiểm Lại</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="statistics-card">
                      <h4>{getTotalCount(registered_cars)}</h4>
                      <p>Ô Tô Đã Đăng Kiểm</p>
                    </div>
                    <div className="statistics-card">
                      <h4>{expiring_cars.length}</h4>
                      <p>Ô Tô Sắp Hết Hạn Đăng Kiểm</p>
                    </div>
                    <div className="statistics-card">
                      <h4>{getTotalCount(expired_cars)}</h4>
                      <p>Ô Tô Đã Hết Hạn Đăng Kiểm</p>
                    </div>
                    <div className="statistics-card">
                        <p>Dự báo</p>
                        <h4>{new_regis_cars}</h4>
                        <p>Ô Tô Đăng Kiểm Mới</p>
                    </div>
                </>
                )
              }
            </div>
            }
            {yearly_registered_cars.length !== 0 &&
            <div className="block-content-container">
                <h4 className="chart-title">Số lượng xe ô tô đã đăng kiểm qua các năm</h4>
                <div style={{display: 'flex'}}>
                  <div className="statistics-line-chart">
                    <div style={{overflowX: 'scroll', paddingBottom: '16px'}}>
                        <ResponsiveContainer width={'100%'} height={400}>
                          <BarChart
                            data={yearly_registered_cars}
                            name
                          >
                            <Bar dataKey="Total" fill="rgb(63, 81, 181)" />
                            <XAxis dataKey="name" stroke="gray" />
                            <YAxis/>
                            <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
                          
                          
                          </BarChart>
                      </ResponsiveContainer>
                      </div>
                    </div>
                </div>
            </div>}
            <div className="block-content-container">
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '36px'}}>
                    <h4 className="chart-title" style={{marginBottom: '0px'}}>Số lượng xe ô tô đã đăng kiểm trong năm</h4>
                    <Select options={years} onChange={handleChange} styles={customStyles}/>
                </div>
                <div style={{display: 'flex'}}>
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
                                        variant="determinate" value={quarter[0].Total * 100 / (quarter[0].Total + quarter[1].Total + quarter[2].Total + quarter[3].Total)} />
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
                                        variant="determinate" value={quarter[1].Total * 100 / (quarter[0].Total + quarter[1].Total + quarter[2].Total + quarter[3].Total)} />
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
                                            variant="determinate" value={quarter[2].Total * 100 / (quarter[0].Total + quarter[1].Total + quarter[2].Total + quarter[3].Total)} />
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
                                            variant="determinate" value={quarter[3].Total * 100 / (quarter[0].Total + quarter[1].Total + quarter[2].Total + quarter[3].Total)} />
                                    </Box>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
  )
}