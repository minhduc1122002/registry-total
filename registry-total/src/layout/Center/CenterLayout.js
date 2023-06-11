import React from 'react'
import CenterTable from '../../components/Table/CenterTable'
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';

export default function CenterLayout( {centers} ) {
    const dispatch = useDispatch()
    
    const cities = require('../../address/tinh_tp.json');
    const findCity = (city) => {
        return cities[cities.findIndex(c => c['code'] === city)]
    }
    const handleDelete = (e, id) => {
        e.preventDefault()
        // dispatch(deleteInspection(id))
    }

    const actionColumn = [
      {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
          return (
          <div className="cellAction">
              <Link to={`/center/${params.row.username}`} style={{ textDecoration: "none" }}>
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
            field: "username",
            headerName: "Tên Đăng Nhập",
            width: 150,
            renderCell: (params) => {
                return <div className="rowitem">{params.row.username}</div>;
            },
        },
        {
            field: "center_id",
            headerName: "Mã Trung Tâm",
            width: 150,
            renderCell: (params) => {
                return <div className="rowitem">{params.row.center.id}</div>;
            },
        },
        {
            field: "center_city",
            headerName: "Thành Phố",
            width: 150,
            renderCell: (params) => {
                return <div className="rowitem">{findCity(params.row.center.city).name}</div>;
            }
        },
        {
            field: "center_district",
            headerName: "Quận",
            width: 150,
            renderCell: (params) => {
                return <div className="rowitem">{params.row.center.district}</div>;
            },
        },
        {
            field: "center_address",
            headerName: "Địa Chỉ",
            width: 300,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.center.address}</div>;
            }
        },
    ];
    return (
        <div className="dashboard-layout">
            <h4 className="dashboard-title">Trung Tâm</h4>
            {centers &&
              <div className="statistics-line-chart" style={{paddingBottom: '20px', paddingTop: '20px'}}>
                  <CenterTable rows={centers} cols={userColumns} row_id='username' actionColumn={actionColumn}/>
              </div>
            }
        </div>
  )
}