import React from 'react'
import './Table.scss'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as XLSX from 'xlsx/xlsx.mjs'
import { useSelector } from "react-redux";
import { addCarList } from '../../redux/car'
import { useDispatch } from 'react-redux'

export default function CarTable( { cols, rows, title, row_id, actionColumn }) {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch()

    function upload() {
      var files = document.getElementById('file_upload').files;
      if(files.length === 0){
        alert("Please choose any file...");
        return;
      }
      var filename = files[0].name;
      var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
      if (extension === '.XLS' || extension === '.XLSX') {
          excelFileToJSON(files[0]);
      } else {
          alert("Please select a valid excel file.");
      }
    }

    function excelFileToJSON(file){
      try {
          var reader = new FileReader();
          reader.readAsBinaryString(file);
          reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type : 'binary'
            });
            var result = {};
            workbook.SheetNames.forEach(function(sheetName) {
              var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
              if (roa.length > 0) {
                result[sheetName] = roa;
              }
            });

            var final = [];
            for (var i = 0; i < result['Car'].length; i++) {
              for (var j = 0; j < result['Owner'].length; j++) {
                var car = result['Car'][i];
                var owner = result['Owner'][j];
                if (car['owner'] == owner['id']) {
                  car['owner'] = owner;
                  final.push(car);
                }
              }
            }
            dispatch(addCarList(JSON.parse(JSON.stringify(final, null, 4))))
          }
      } catch(e) {
        console.error(e);
      }
    }
    console.log(rows)
    return (
        <div className="datatable">
            <div className="datatableTitle">
                Table
                {user.role === 'department' &&
                    <div className="upload">
                        <div className="faux-button">
                            <div className="btn-enhanced btn-s">Upload File</div>
                            <input type="file" id="file_upload" />
                            <div className="hover-bg"></div>
                        </div>
                        <button 
                            id="upBtn" 
                            className="link primary-btn" 
                            type="button"
                            onClick={() => upload()}
                            
                        >
                            Submit
                        </button>
                    </div>
                }
            </div>
            <DataGrid
                className="datagrid"
                rows={rows}
                columns={cols.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                getRowId={(row) => row['registration_id']}
                slots={{toolbar: GridToolbar}}
            />
        </div>
    );
}