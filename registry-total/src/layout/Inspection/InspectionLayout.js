import React, { useEffect, useState } from 'react'
import InspectionTable from '../../components/Table/InspectionTable'
import { Link } from "react-router-dom";
import { deleteInspection } from '../../redux/inspection'
import { useDispatch, useSelector } from 'react-redux'
import Select from "react-select"

export default function InspectionLayout( {inspections} ) {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user);
    const cities = require('../../address/tinh_tp.json');
    const tree = require('../../address/tree.json');
    const filters = [
      { value: 'city', label: 'Theo Tỉnh/Thành phố' },
      { value: 'district', label: 'Theo Quận/Huyện' },
      { value: 'center', label: 'Theo Trung tâm' }
    ]
    const centers = [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' }
    ]
    const [inspection, setInspection] = useState(inspections)

    const [filter, setFilter] = useState()
    const [city, setCity] = useState()
    const [district, setDistrict] = useState()
    const [center, setCenter] = useState()

    useEffect(() => {
      setCity("")
      setDistrict("")
      setCenter("")
  }, [filter])

  useEffect(() => {
      setDistrict("")
  }, [city])

    const selectStyle = {    
      control: (base, state) => ({
          ...base,
          '&:hover': { borderColor: 'gray' },
          border: '1px solid rgba(0, 0, 0, 0.32)',
          boxShadow: 'none',
          width: '100%'
      }),
    };

    const getDist = (city) => {
      if (city && city.code) {
          return tree[city.code]['quan-huyen']
      }
      else return []
    }

    const handleClick = () => {
      if (filter) {
        switch(filter.value) {
          case 'city':
            setInspection(inspections.filter(inspection => inspection.center.city == city.code))
          case 'district':
            setInspection(inspections.filter(inspection => inspection.center.district == district.code))
          case 'center':
            setInspection(inspections.filter(inspection => inspection.center.id == center.value))
        }
      }
    }

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
            {inspection && user.role === 'department' && 
            (
            <>
            <div className="row-select">
              <div className="label">Bộ lọc</div>
              <div className="select-container" style={{width:'70%'}}>
                <Select
                  id="filter" name="filter" options={filters}
                  className="select"
                  placeholder="Chọn Bộ lọc"
                  value={filter}
                  onChange={setFilter}
                  noOptionsMessage={() => "Không có lựa chọn nào"}
                  styles={selectStyle}
                />
              </div>
            </div>
            <div className="row-select">
              <div className="label">Tỉnh/Thành phố</div>
              <div className="select-container">
                <Select 
                    id="city" name="City" options={(filter && filter.value=='center') ? [] : cities}
                    className="select"
                    placeholder="Chọn Tỉnh/Thành phố"
                    value={city}
                    onChange={setCity}
                    getOptionLabel={(city) => city.name_with_type}
                    getOptionValue={(city) => city.code}
                    noOptionsMessage={() => "Không có lựa chọn nào"}
                    styles={selectStyle}
                />
              </div>
            </div>
            <div className="row-select">
              <div className="label">Quận/Huyện</div>
              <div className="select-container">
                <Select
                    id="district" name="District" options={(filter && filter.value=='district') ? getDist(city) : []}
                    className="select"
                    placeholder="Chọn Quận/Huyện"
                    value={district}
                    onChange={setDistrict}
                    getOptionLabel={(district) => district.name_with_type}
                    getOptionValue={(district) => district.code}
                    noOptionsMessage={() => "Không có lựa chọn nào"}
                    styles={selectStyle}
                />
              </div>
            </div>
            <div className="row-select">
              <div className="label">Trung tâm</div>
              <div className="select-container">
                <Select
                    id="center" name="Center" options={(filter && filter.value=='center') ? centers : []}
                    className="select"
                    placeholder="Chọn Trung tâm"
                    value={center}
                    onChange={setCenter}
                    noOptionsMessage={() => "Không có lựa chọn nào"}
                    styles={selectStyle}
                />
              </div>
            </div>
            <div className="button-container">
              <button type='button' className='link primary-btn' onClick={handleClick}>Lọc</button>
            </div>
            </>)}

            {inspection &&
              <div className="statistics-line-chart" style={{paddingBottom: '20px', paddingTop: '20px'}}>
                  <InspectionTable rows={inspection} cols={userColumns} row_id='register_id' actionColumn={actionColumn}/>
              </div>
            }
        </div>
  )
}