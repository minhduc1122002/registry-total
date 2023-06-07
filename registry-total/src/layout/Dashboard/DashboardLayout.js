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
import Table from '../../components/Table/Table'
import { useState, useEffect } from "react";

const data = [
    { name: "January", Total: 12, Missing: 5 },
    { name: "February", Total: 21, Missing: 19 },
    { name: "March", Total: 8, Missing: 4 },
    { name: "April", Total: 16, Missing: 10 },
    { name: "May", Total: 9, Missing: 1 },
    { name: "June", Total: 17, Missing: 5 },
];

const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "user",
      headerName: "User",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.img} alt="avatar" />
            {params.row.username}
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 230,
    },
  
    {
      field: "age",
      headerName: "Age",
      width: 100,
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.status}`}>
            {params.row.status}
          </div>
        );
      },
    },
  ];
  
  //temporary data
const userRows = [
    {
      id: 1,
      username: "Snow",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      status: "active",
      email: "1snow@gmail.com",
      age: 35,
    },
    {
      id: 2,
      username: "Jamie Lannister",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "2snow@gmail.com",
      status: "passive",
      age: 42,
    },
    {
      id: 3,
      username: "Lannister",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "3snow@gmail.com",
      status: "pending",
      age: 45,
    },
    {
      id: 4,
      username: "Stark",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "4snow@gmail.com",
      status: "active",
      age: 16,
    },
    {
      id: 5,
      username: "Targaryen",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "5snow@gmail.com",
      status: "passive",
      age: 22,
    },
    {
      id: 6,
      username: "Melisandre",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "6snow@gmail.com",
      status: "active",
      age: 15,
    },
    {
      id: 7,
      username: "Clifford",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "7snow@gmail.com",
      status: "passive",
      age: 44,
    },
    {
      id: 8,
      username: "Frances",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "8snow@gmail.com",
      status: "active",
      age: 36,
    },
    {
      id: 9,
      username: "Roxie",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "snow@gmail.com",
      status: "pending",
      age: 65,
    },
    {
      id: 10,
      username: "Roxie",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "snow@gmail.com",
      status: "active",
      age: 65,
    },
];

export default function DashboardLayout() {
    // const [registered_cars, setCars] = useState([]);

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
        // const getCars = async () => {
        // try {
        //   const res = const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
        //   const response = await axios.create({
        //     baseURL: BASE_URL,
        //     headers: { token: `${TOKEN}` },
        // }).get("/form");
            
        //    setCars(res.data);
        // } catch {}
        // };
        // getCars();
    }, []);

    
    // console.log(registered_cars)
    return (
        <div className="dashboard-layout">
            <h4 className="dashboard-title">Dashboard</h4>
            <div className="card-grid">
                <div className="statistics-card">
                    <h4>60</h4>
                    <p>Ô Tô Đã Đăng Kiểm</p>
                </div>
                <div className="statistics-card">
                    <h4>60</h4>
                    <p>Ô Tô Sắp Hết Hạn Đăng Kiểm</p>
                </div>
                <div className="statistics-card">
                    <h4>60</h4>
                    <p>Ô Tô Đã Hết Hạn Đăng Kiểm</p>
                </div>
            </div>
            <div className="statistics-line-chart">
                <h4 class="chart-title">Số lượng xe ô tô đã đăng kiểm trong năm 2023</h4>
                <ResponsiveContainer width="100%" height={400}>
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
            {/* <div className="statistics-line-chart">
                
            </div> */}
        </div>
  )
}