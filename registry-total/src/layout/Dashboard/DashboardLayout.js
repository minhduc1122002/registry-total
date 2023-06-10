import React from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    YAxis,
} from "recharts";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";

const data = [
  { name: "January", Total: 12, Missing: 5 },
  { name: "February", Total: 21, Missing: 19 },
  { name: "March", Total: 8, Missing: 4 },
  { name: "April", Total: 16, Missing: 10 },
  { name: "May", Total: 9, Missing: 1 },
  { name: "June", Total: 17, Missing: 5 },
];

export default function DashboardLayout() {
    const user = useSelector((state) => state.auth.user);
    const [registered_cars, setRegisteredCars] = useState();
    const [expiring_cars, setExpiringCars] = useState();
    const [expired_cars, setExpiredCars] = useState();

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
        
        const BASE_URL = "http://localhost:8000/api/"
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
                <h4 className="chart-title">Số lượng xe ô tô đã đăng kiểm trong năm 2023</h4>
                <div style={{display: 'flex'}}>
                  <div className="statistics-line-chart">
                    <div style={{overflowX: 'scroll', paddingBottom: '16px'}}>
                      <ResponsiveContainer width={1200} height={400}>
                          <AreaChart
                          data={data}
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
                      <p>Quý</p>
                    </div>
                  </div>
            </div>
            {/* <div className="statistics-line-chart">
                
            </div> */}
        </div>
  )
}