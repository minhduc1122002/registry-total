import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

const initialState = {
  cars: [],
  isError: [false, false, false, false],
  isSuccess: [false, false, false, false],
  isLoading: [false, false, false, false],
  message: '',
}

const BASE_URL = "http://localhost:8000/api/";

//get all cars
export const getCarList = createAsyncThunk('car/list', async (thunkAPI) => {
  try {
    const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
    const response = await axios.create({
        baseURL: BASE_URL,
        headers: { token: `${TOKEN}` },
    }).get("/car")
    return response.data
  } catch (error) {
    const message = (error.response &&
      (error.response.data ||
        error.response.data.message)) || error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

//add inspections
export const addCar = createAsyncThunk('form/add', async (car, thunkAPI) => {
  try {
        const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
        const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).post("/car", car)
        return response.data
  } catch (error) {
        const message =  (error.response &&
        (error.response.data ||
            error.response.data.message)) || error.message ||
        error.toString()
        console.log(message)
        return thunkAPI.rejectWithValue(message)
  }
})

//update inspection by id
// export const updateInspectionbyId = createAsyncThunk('form/update', async (inspection, thunkAPI) => {
//   try {
//         const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
//         const response = await axios.create({
//             baseURL: BASE_URL,
//             headers: { token: `${TOKEN}` },
//         }).put(`/form/${inspection.register_id}`, inspection)
        
//         return response.data
//   } catch (error) {
//     console.log(error.response)
//     const message = (error.response &&
//       (error.response.data ||
//       error.response.data.message)) || error.message ||
//       error.toString()
//     return thunkAPI.rejectWithValue(message)
//   }
// })

// //delete inspection
// export const deleteInspection = createAsyncThunk('form/delete', async (id, thunkAPI) => {
//   try {
//         const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
//         const response = await axios.create({
//             baseURL: BASE_URL,
//             headers: { token: `${TOKEN}` },
//         }).delete("/form/" + id)
//         return id
//   }catch (error) {
//     const message = (error.response &&
//       (error.response.data ||
//         error.response.data.message)) || error.message ||
//       error.toString()
//     return thunkAPI.rejectWithValue(message)
//   }
// })

export const CarSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = [false, false, false, false]
      state.isSuccess = [false, false, false, false]
      state.isError = [false, false, false, false]
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCarList.pending, (state) => {
        state.isLoading[3] = true
      })
      .addCase(getCarList.fulfilled, (state, action) => {
        state.isLoading[3] = false
        state.isSuccess[3] = true
        state.cars = action.payload
      })
      .addCase(getCarList.rejected, (state, action) => {
        state.isLoading[3] = false
        state.isError[3] = true
        state.isSuccess[3] = false
        state.message = action.payload
        state.cars = []
      })
      .addCase(addCar.pending, (state) => {
        state.isLoading[0] = true
      })
      .addCase(addCar.fulfilled, (state, action) => {
        state.isLoading[0] = false
        state.isError[0] = false
        state.isSuccess[0] = true
        state.cars.push(action.payload)
      })
      .addCase(addCar.rejected, (state, action) => {
        state.isLoading[0] = false
        state.isError[0] = true
        state.isSuccess[0] = false
        state.message = action.payload
      })
    //   .addCase(updateInspectionbyId.pending, (state) => {
    //     state.isLoading[1] = true
    //   })
    //   .addCase(updateInspectionbyId.fulfilled, (state, action) => {
    //     state.isLoading[1] = false
    //     state.isError[1] = false
    //     state.isSuccess[1] = true
    //     state.inspections[
    //       state.inspections.findIndex(index => index.register_id === action.payload.register_id)
    //     ] = action.payload
    //   })
    //   .addCase(updateInspectionbyId.rejected, (state, action) => {
    //     state.isLoading[1] = false
    //     state.isError[1] = true
    //     state.isSuccess[1] = false
    //     state.message = action.payload
    //   })
    //   .addCase(deleteInspection.pending, (state) => {
    //     state.isLoading[2] = true
    //   })
    //   .addCase(deleteInspection.fulfilled, (state, action) => {
    //     state.isLoading[2] = false
    //     state.isError[2] = false
    //     state.isSuccess[2] = true
    //     const index = state.inspections.findIndex(inspection => inspection.register_id === action.payload)
    //     state.inspections.splice(index, 1)
    //   })
    //   .addCase(deleteInspection.rejected, (state, action) => {
    //     state.isLoading[2] = false
    //     state.isError[2] = true
    //     state.isSuccess[2] = false
    //     state.message = action.payload
    //   })
      
  },
})

export const { reset } = CarSlice.actions
export default CarSlice.reducer