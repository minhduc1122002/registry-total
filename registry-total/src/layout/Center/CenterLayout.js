import React from 'react'
import CenterTable from '../../components/Table/CenterTable'
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import SingleCenter from '../../components/Single/Center/SingleCenter'
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/fontawesome-free-solid'

export default function CenterLayout( {centers} ) {
    fontawesome.library.add(faChevronCircleLeft)

    const dispatch = useDispatch()
    
    const cities = require('../../address/tinh_tp.json');
    const findCity = (city) => {
        return cities[cities.findIndex(c => c['code'] === city)]
    }
    const [center, setCenter] = useState()
    const handleDelete = (e, id) => {
        e.preventDefault()
        // dispatch(deleteInspection(id))
    }

    const handleView = (e, id) => {
        console.log(center)
        e.preventDefault()
        setCenter(id.toString())
        console.log(center)
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
                <div 
                    className="viewButton"
                    onClick={(e) => handleView(e, params.row.center.id)}
                >View</div>
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
            {center ? (
                <>
                <div style={{display:'flex'}}>
                    <Link type="button" style={{marginLeft:'3rem'}} onClick={() => setCenter() }>
                        <svg style={{color: 'rgb(63, 81, 181)', width: '1.8em', height: '1.8em', marginRight:'1em'}}>
                            <FontAwesomeIcon icon={faChevronCircleLeft} />
                        </svg>
                        
                    </Link>
                    <h4 className="dashboard-title">Trung Tâm {center}</h4>
                </div>
                
                <div className="statistics-line-chart" style={{paddingBottom: '20px', paddingTop: '20px'}}>
                  <SingleCenter center_id={center}></SingleCenter>
                </div>
                </>
            ) : (
            <><h4 className="dashboard-title">Trung Tâm</h4>
            {centers &&
              <div className="statistics-line-chart" style={{paddingBottom: '20px', paddingTop: '20px'}}>
                  <CenterTable rows={centers} cols={userColumns} row_id='username' actionColumn={actionColumn}/>
              </div>
            }</>)}
        </div>
  )
}