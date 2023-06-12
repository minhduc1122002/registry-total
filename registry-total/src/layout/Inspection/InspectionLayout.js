import React, { useEffect, useState } from 'react'
import InspectionTable from '../../components/Table/InspectionTable'
import { Link } from "react-router-dom";
import { deleteInspection } from '../../redux/inspection'
import { useDispatch, useSelector } from 'react-redux'
import Select from "react-select"
import axios from 'axios';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {vi} from 'date-fns/locale';
import moment from 'moment';

export default function InspectionLayout( {inspections} ) {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user);
    const cities = require('../../address/tinh_tp.json');
    const tree = require('../../address/tree.json');
    const [inspection, setInspection] = useState([])
    
    useEffect(() => {
        setInspection(inspections)
    }, [inspections]);

    const [city, setCity] = useState()
    const [district, setDistrict] = useState()
    const [centers, setCenters] = useState()
    const [center, setCenter] = useState()
    const [lowerRegisterDate, setLowerRegisterDate] = useState()
    const [upperRegisterDate, setUpperRegisterDate] = useState()
    const [minUpperRegisterDate, setMinUpperRegisterDate] = useState()
    const [lowerExpiredDate, setLowerExpiredDate] = useState()
    const [upperExpiredDate, setUpperExpiredDate] = useState()
    const [minLowerExpiredDate, setMinLowerExpiredDate] = useState()
    const [minUpperExpiredDate, setMinUpperExpiredDate] = useState()

    useEffect(() => {
        setDistrict("")
        setCenter("")
    }, [city])

    useEffect(() => {
      setCenter("")
    }, [district])

    useEffect(() => {
      setMinUpperRegisterDate(lowerRegisterDate)
      setMinLowerExpiredDate(lowerRegisterDate)
    }, [lowerRegisterDate])

    useEffect(() => {
      setMinUpperExpiredDate(lowerExpiredDate)
    }, [lowerExpiredDate])

    const BASE_URL = "http://localhost:8000/api/"
    useEffect(() => {
      const getCenters = async () => {
        try {
            const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
            const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).get("/user");
        
            setCenters(response.data);
        } catch(e) {
            console.log(e)
        }};
        getCenters();
    }, []);

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

    const getCenter = (district) => {
      if (centers) {
        return centers.filter(center => center.center.district == district.code)
      } 
      else return []
    }

    const handleClick = () => {
      const chosen_city = (city && city.code) ? city.code : undefined
      const chosen_district = (district && district.code) ? district.code : undefined
      const chosen_center = (center && center.center && center.center.id) ? center.center.id : undefined
      const lower_register_date = (lowerRegisterDate && moment(lowerRegisterDate, 'dd/MM/yyyy', true).isValid()) ? lowerRegisterDate : undefined
      const upper_register_date = (upperRegisterDate && moment(upperRegisterDate, 'dd/MM/yyyy', true).isValid()) ? upperRegisterDate : undefined
      const lower_expired_date = (lowerExpiredDate && moment(lowerExpiredDate, 'dd/MM/yyyy', true).isValid()) ? lowerExpiredDate : undefined
      const upper_expired_date = (upperExpiredDate && moment(upperExpiredDate, 'dd/MM/yyyy', true).isValid()) ? upperExpiredDate : undefined

      setInspection(inspections.filter(inspection => (inspection.center.id === chosen_center || !chosen_center) && 
                    (inspection.center.district === chosen_district || !chosen_district) && 
                    (inspection.center.city === chosen_city || !chosen_city) && 
                    (!lower_register_date || (new Date(inspection.register_date).getTime() >= lower_register_date.getTime())) && 
                    (!upper_register_date || (new Date(inspection.register_date).getTime() <= upper_register_date.getTime())) && 
                    (!lower_expired_date || (new Date(inspection.expired_date).getTime() >= lower_expired_date.getTime())) && 
                    (!upper_expired_date || (new Date(inspection.expired_date).getTime() <= upper_expired_date.getTime()))))
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
              <div className="label">Tỉnh/Thành phố</div>
              <div className="select-container">
                <Select 
                    id="city" name="City" options={cities}
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
                    id="district" name="District" options={getDist(city)}
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
                    id="center" name="Center" options={getCenter(district)}
                    className="select"
                    placeholder="Chọn Trung tâm"
                    value={center}
                    onChange={setCenter}
                    getOptionLabel={(center) => center.center.id}
                    getOptionValue={(center) => center.center.id}
                    noOptionsMessage={() => "Không có lựa chọn nào"}
                    styles={selectStyle}
                />
              </div>
            </div>
            <div className="row-text">
              <div className="label">Ngày cấp</div>
              <div className="text-input">
                <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <DatePicker
                      defaultValue={lowerRegisterDate}
                      onChange={setLowerRegisterDate}
                      disableFuture
                      format="dd/MM/yyyy"
                      className='date-picker-width'
                  />
                </LocalizationProvider>
              </div>
              <div style={{padding:'10px'}}>-</div>
              <div className="text-input">
                <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <DatePicker
                      defaultValue={upperRegisterDate}
                      onChange={setUpperRegisterDate}
                      disableFuture
                      format="dd/MM/yyyy"
                      className='date-picker-width'
                      minDate={minUpperRegisterDate}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="row-text">
              <div className="label">Ngày hết hạn</div>
              <div className="text-input">
                <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <DatePicker
                      defaultValue={lowerExpiredDate}
                      onChange={setLowerExpiredDate}
                      format="dd/MM/yyyy"
                      className='date-picker-width'
                      minDate={minLowerExpiredDate}
                  />
                </LocalizationProvider>
              </div>
              <div style={{padding:'10px'}}>-</div>
              <div className="text-input">
                <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <DatePicker
                      defaultValue={upperExpiredDate}
                      onChange={setUpperExpiredDate}
                      format="dd/MM/yyyy"
                      className='date-picker-width'
                      minDate={minUpperExpiredDate}
                  />
                </LocalizationProvider>
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