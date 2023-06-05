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
import { publicRequest, userRequest } from "../../request";

const data = [
    { name: "January", Total: 12, Missing: 5 },
    { name: "February", Total: 21, Missing: 19 },
    { name: "March", Total: 8, Missing: 4 },
    { name: "April", Total: 16, Missing: 10 },
    { name: "May", Total: 9, Missing: 1 },
    { name: "June", Total: 17, Missing: 5 },
];

const userColumns = [
    {
        field: "id",
        headerName: "ID",
        width: 150,
        renderCell: (params) => {
          return <div className="rowitem">{params.row.register_id}</div>;
        },
   },
    {
      field: "register_date",
      headerName: "Register Date",
      width: 230,
      renderCell: (params) => {
        return <div className="rowitem">{params.row.register_date}</div>;
      },
    },
    {
      field: "expired_date",
      headerName: "Expired Date",
      width: 230,
      renderCell: (params) => {
        return <div className="rowitem">{params.row.expired_date}</div>;
      }
    },
  
    {
      field: "center_id",
      headerName: "Center",
      width: 100,
      renderCell: (params) => {
        return <div className="rowitem">{params.row.center.id}</div>;
      }
    },

    {
        field: "car_id",
        headerName: "Car",
        width: 100,
        renderCell: (params) => {
          return <div className="rowitem">{params.row.car.registration_number}</div>;
        }
      },
    
  ];

export default function InspectionLayout() {
    const [cars, setCars] = useState([]);
    
    useEffect(() => {
        const getCars = async () => {
        try {
            const inspections = await userRequest.get("/form");
            
            setCars(inspections.data);
        } catch {}
        };
        getCars();
    }, []);
    
    
    return (
        <div className="dashboard-layout">
            <h4 className="dashboard-title">Inspection</h4>
            {cars.length > 0 &&
            
            <div className="statistics-line-chart">
                <Table rows={cars} cols={userColumns} row_id='register_id'/>
            </div>
            }
        </div>
  )
}