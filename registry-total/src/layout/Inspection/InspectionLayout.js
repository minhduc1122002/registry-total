import React from 'react'
import InspectionTable from '../../components/Table/InspectionTable'
import { Link } from "react-router-dom";
import { deleteInspection } from '../../redux/inspection'
import { useDispatch } from 'react-redux'

export default function InspectionLayout( {inspections} ) {
    const dispatch = useDispatch()

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
              <Link to={`/inspections/${params.row.register_id}`} style={{ textDecoration: "none" }}>
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
            field: "inspection_id",
            headerName: "Số Đăng Kiểm",
            width: 150,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.register_id}</div>;
            },
       },
        {
          field: "inspection_date",
          headerName: "Ngày Đăng Kiểm",
          width: 150,
          type: "dateTime",
          valueGetter: (params) => {
            return new Date(params.row.register_date)
            
          },
          renderCell: (params) => {
            return <div className="rowitem">{params.row.register_date}</div>;
          }
        },

        {
          field: "expired_date",
          headerName: "Ngày Hết Hạn",
          width: 150,
          type: "dateTime",
          valueGetter: (params) => {
            return new Date(params.row.expired_date)
            
          },
          renderCell: (params) => {
            return <div className="rowitem">{params.row.expired_date}</div>;
          }
        },
        {
          field: "status",
          headerName: "Tình Trạng",
          width: 150,
          renderCell: (params) => {
            const expired_date = new Date(params.row.expired_date)
            const status = expired_date.getTime() < new Date().getTime() ? 'expired' : 'active'
            return (
              <div className={`cellWithStatus ${status}`}>
                {status === 'expired' ? 'Đã hết hạn' : 'Còn hiệu lực'}
              </div>
            );
          },
        },
        {
          field: "center_id",
          headerName: "Trung Tâm",
          width: 100,
          renderCell: (params) => {
            return <div className="rowitem">{params.row.center.id}</div>;
          }
        },
        {
          field: "registration_id",
          headerName: "Số Đăng Ký",
          width: 150,
          renderCell: (params) => {
            return <div className="rowitem">{params.row.car.registration_id}</div>;
          },
        },
    
        {
            field: "car_id",
            headerName: "Biển Số Xe",
            width: 150,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.car.plate_number}</div>;
            }
          },
          {
            field: "owner_name",
            headerName: "Chủ sở hữu",
            width: 150,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.car.owner.name}</div>;
            }
          },
  
          {
            field: "owner_id",
            headerName: "CCCD",
            width: 150,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.car.owner.id}</div>;
            }
          }
        
    ];
    return (
        <div className="dashboard-layout">
            <h4 className="dashboard-title">Giấy Đăng Kiểm</h4>
            {inspections &&
              <div className="statistics-line-chart" style={{paddingBottom: '20px', paddingTop: '20px'}}>
                  <InspectionTable rows={inspections} cols={userColumns} row_id='register_id' actionColumn={actionColumn}/>
              </div>
            }
        </div>
  )
}