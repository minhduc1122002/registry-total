import React from 'react'
import CarTable from '../../components/Table/CarTable'
import { Link } from "react-router-dom";
import { deleteCar } from '../../redux/car'
import { useDispatch } from 'react-redux'

export default function CarLayout( {cars} ) {
    const dispatch = useDispatch()

    const handleDelete = (e, id) => {
        e.preventDefault()
        dispatch(deleteCar(id))
    }
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
              <div
                  className="deleteButton"
                  onClick={(e) => handleDelete(e, params.row.registration_id)}
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
            field: "registration_id",
            headerName: "Số Đăng Ký",
            width: 150,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.registration_id}</div>;
            },
        },
        {
            field: "registration_address",
            headerName: "Nơi Đăng Ký",
            width: 200,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.registration_place}</div>;
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
          field: "inspection_status",
          headerName: "Tình Trạng",
          width: 200,
          renderCell: (params) => {
            const status_class = params.row.inspection_status === 'Chưa đăng kiểm' ? 'expired' : 'active'
            return (
              <div className={`cellWithStatus ${status_class}`}>
                {status_class === 'expired' ? 'Chưa đăng kiểm' : 'Đã đăng kiểm'}
              </div>
            );
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
            width: 200,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.owner.name}</div>;
            }
          },
  
          {
            field: "owner_id",
            headerName: "CCCD/Mã Cty",
            width: 150,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.owner.id}</div>;
            }
          },
      
          {
            field: "owner_address",
            headerName: "Địa Chỉ Thường Trú",
            width: 300,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.owner.address}</div>;
            }
          },
      
          {
            field: "owner_contact",
            headerName: "Địa Chỉ Liên Hệ",
            width: 250,
            renderCell: (params) => {
              return <div className="rowitem">{params.row.owner.contact}</div>;
            }
          },
    ];
    return (
        <div className="dashboard-layout">
            <h4 className="dashboard-title">Xe Ô Tô Đã Đăng Ký</h4>
            {cars &&
                <div className="statistics-line-chart" style={{paddingBottom: '64px', paddingTop: '20px'}}>
                    <CarTable rows={cars} cols={userColumns} row_id='registration_id' actionColumn={actionColumn}/>
                </div>
            }
        </div>
    )
}