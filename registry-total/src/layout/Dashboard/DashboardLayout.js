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
import { useSelector } from "react-redux";
import Stack from "@mui/material/Stack";

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
    const [expiring_cars, setExpiringCars] = useState([]);
    const [expired_cars, setExpiredCars] = useState([]);

    const BASE_URL = "http://localhost:8000/api/"
        const getRegisteredCars = async () => {
        try {
            const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
            const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).get("/form");
        
            setRegisteredCars(response.data);
        } catch(e) {
            console.log(e)
        }};
        getRegisteredCars();
    
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
        { value: '/form/register/bymonth/2022', label: '2022' },
        { value: '/form/register/bymonth/2023', label: '2023' }
    ]

    const [selected, setSelected] = useState(null);

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
            console.log(response.data)
            setExpiredCars(response.data);
        } catch(e) {
            console.log(e)
        }};
        getExpiredCars();
    }, []);
    
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
    return (
        <div className="dashboard-layout">
            <h4 className="dashboard-title">Dashboard</h4>
            {expiring_cars && expiring_cars && expired_cars && 
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
                </>
                )
              }
            </div>
            }
            <div className="block-content-container">
                <h4 className="chart-title">Số lượng xe ô tô đã đăng kiểm trong năm</h4>
                <div style={{display: 'flex'}}>
                  <div className="statistics-line-chart">
                    <div style={{overflowX: 'scroll', paddingBottom: '16px'}}>
                        <Select options={years} onChange={handleChange} styles={customStyles}/>
                        <br></br>
                        <ResponsiveContainer width={600} height={400}>
                          <AreaChart
                            data={selectdata()}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                        <span className="statis"> Thống kê </span>
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
                                                        variant="determinate" value={quarter[0].Total} />
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
                                                        variant="determinate" value={quarter[1].Total} />
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
                                                        variant="determinate" value={quarter[2].Total} />
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
                                                        variant="determinate" value={quarter[3].Total*100} />
                                    </Box>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="block-content-container">
                <h4 className="chart-title">Số lượng xe ô tô sắp hết hạn đăng kiểm trong năm</h4>
                <div style={{display: 'flex'}}>
                  <div className="statistics-line-chart">
                    <div style={{overflowX: 'scroll', paddingBottom: '16px'}}>
                        <Select options={years} onChange={handleChange} styles={customStyles}/>
                        <br></br>
                        <ResponsiveContainer width='100%' height={400}>
                          <AreaChart
                            data={selectdata()}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                </div>
            </div>
        </div>
  )
}