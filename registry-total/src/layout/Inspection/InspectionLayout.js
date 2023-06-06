import React from 'react'
import Table from '../../components/Table/Table'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteInspection, getInspectionList } from '../../redux/inspection'
import { useDispatch, useSelector } from 'react-redux'

export default function InspectionLayout() {
      const handleDelete = (e, id) => {
        e.preventDefault()
        dispatch(deleteInspection(id))
    }
    
    const actionColumn = [
      {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
          return (
          <div className="cellAction">
              <Link to={`/inspection/${params.row.register_id}`} style={{ textDecoration: "none" }}>
                  <div className="viewButton">View</div>
              </Link>
              <div
                  className="deleteButton"
                  onClick={(e) => handleDelete(e, params.row.register_id)}
              >
              Delete
              </div>
          </div>
          );
      },
      },
    ];
    
    const userColumns = [
        {
            field: "id",
            headerName: "Mã Số",
            width: 100,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.register_id}</div>;
            },
       },
        {
          field: "register_date",
          headerName: "Ngày Đăng Kiểm",
          width: 150,
          renderCell: (params) => {
            return <div className="rowitem">{params.row.register_date}</div>;
          },
        },
        {
          field: "expired_date",
          headerName: "Ngày Hết Hạn",
          width: 150,
          renderCell: (params) => {
            return <div className="rowitem">{params.row.expired_date}</div>;
          }
        },
      
        {
          field: "center_id",
          headerName: "Mã Trung Tâm",
          width: 150,
          renderCell: (params) => {
            return <div className="rowitem">{params.row.center.id}</div>;
          }
        },
    
        {
            field: "car_id",
            headerName: "Biển Số Xe",
            width: 150,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.car.registration_number}</div>;
            }
          },

          {
            field: "status",
            headerName: "Tình Trạng",
            width: 150,
            renderCell: (params) => {
              const register_date = new Date(params.row.register_date)
              
              const status = register_date.getTime() < new Date().getTime() ? 'expired' : 'active'
              return (
                <div className={`cellWithStatus ${status}`}>
                  {status}
                </div>
              );
            },
          },
        
    ];
    const dispatch = useDispatch()
    const inspections = useSelector(state => state.inspection.inspections)
    
    useEffect(() => {
        dispatch(getInspectionList())
    }, [dispatch]);

    // useEffect(() => {
    //     const getInspection = async () => {
    //     try {
    //       const BASE_URL = "http://localhost:8000/api/";
    //       const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
    //         const inspections = await axios.create({
    //           baseURL: BASE_URL,
    //           headers: { token: `${TOKEN}` },
    //         }).get("/form");
            
    //         setInspection(inspections.data);
    //     } catch {}
    //     };
    //     getInspection();
    // }, []);
    
    
    return (
        <div className="dashboard-layout">
            <h4 className="dashboard-title">Inspection</h4>
            {inspections &&
            
            <div className="statistics-line-chart">
                <Table rows={inspections} cols={userColumns} row_id='register_id' actionColumn={actionColumn}/>
            </div>
            }
        </div>
  )
}