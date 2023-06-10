import React from 'react'
import CarTable from '../../components/Table/CarTable'
import { Link } from "react-router-dom";

export default function CarLayout( {cars} ) {
    const carUses = [
        { value: 'personal', label: 'Đi lại cá nhân' },
        { value: 'passenger_service', label: 'Dịch vụ chở khách' },
        { value: 'transportation_service', label: 'Dịch vụ vận tải' }
    ]

    const actionColumn = [
      {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
          return (
          <div className="cellAction">
              <Link to={`/cars/${params.row.register_id}`} style={{ textDecoration: "none" }}>
                  <div className="viewButton">View</div>
              </Link>
          </div>
          );
      },
      },
    ];
    
    const userColumns = [
        {
            field: "register_id",
            headerName: "Số Đăng Ký",
            width: 150,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.register_id}</div>;
            },
       },
        {
          field: "plate_number",
          headerName: "Biển Số Xe",
          width: 150,
          renderCell: (params) => {
            return <div className="rowitem">{params.row.plate_number}</div>;
          },
        },
        {
          field: "manufacturer",
          headerName: "Hãng",
          width: 150,
          renderCell: (params) => {
            return <div className="rowitem">{params.row.manufacturer}</div>;
          }
        },

        {
          field: "model",
          headerName: "Số Loại",
          width: 150,
          renderCell: (params) => {
            return <div className="rowitem">{params.row.model}</div>;
          }
        },
        {
            field: "type",
            headerName: "Loại Phương Tiện",
            width: 150,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.type}</div>;
            }
          },
  
          {
            field: "purpose",
            headerName: "Mục đích",
            width: 150,
            renderCell: (params) => {
              return <div className="rowitem">{carUses[carUses.findIndex(use => use.value === params.row.purpose)].label}</div>;
            }
          },
          {
            field: "owner_name",
            headerName: "Chủ sở hữu",
            width: 150,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.owner.name}</div>;
            }
          },
  
          {
            field: "owner_id",
            headerName: "CCCD",
            width: 150,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.owner.id}</div>;
            }
          },
      
        // {
        //   field: "center_id",
        //   headerName: "Trung Tâm",
        //   width: 100,
        //   renderCell: (params) => {
        //     return <div className="rowitem">{params.row.center.id}</div>;
        //   }
        // },
    
        // {
        //     field: "car_id",
        //     headerName: "Biển Số Xe",
        //     width: 150,
        //     renderCell: (params) => {
        //       return <div className="rowitem">{params.row.car.plate_number}</div>;
        //     }
        //   },

        //   {
        //     field: "status",
        //     headerName: "Tình Trạng",
        //     width: 150,
        //     renderCell: (params) => {
        //       const register_date = new Date(params.row.register_date)
              
        //       const status = register_date.getTime() * 1000 < new Date().getTime() ? 'expired' : 'active'
        //       return (
        //         <div className={`cellWithStatus ${status}`}>
        //           {status === 'expired' ? 'Đã hết hạn' : 'Còn hiệu lực'}
        //         </div>
        //       );
        //     },
        //   },
        
    ];
    return (
        <div className="dashboard-layout">
            <h4 className="dashboard-title">Xe Ô Tô Đã Đăng Ký</h4>
            {cars &&
                <div className="statistics-line-chart" style={{paddingBottom: '20px', paddingTop: '20px'}}>
                    <CarTable rows={cars} cols={userColumns} row_id='register_id' actionColumn={actionColumn}/>
                </div>
            }
        </div>
  )
}