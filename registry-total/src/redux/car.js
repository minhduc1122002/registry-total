import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

const initialState = {
  cars: [],
  isError: [false, false, false, false, false],
  isSuccess: [false, false, false, false, false],
  isLoading: [false, false, false, false, false],
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

//add car
export const addCar = createAsyncThunk('car/add', async (car, thunkAPI) => {
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

//add list of car
export const addCarList = createAsyncThunk('car/add/list', async (cars, thunkAPI) => {
  try {
        const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
        const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).post("/car/list/all", cars)
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

//delete car
export const deleteCar = createAsyncThunk('car/delete', async (id, thunkAPI) => {
  try {
        const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
        const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).delete("/car/" + id)
        return id
  }catch (error) {
    const message = (error.response &&
      (error.response.data ||
        error.response.data.message)) || error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const CarSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = [false, false, false, false, false]
      state.isSuccess = [false, false, false, false, false]
      state.isError = [false, false, false, false, false]
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
      .addCase(addCarList.pending, (state) => {
        state.isLoading[4] = true
      })
      .addCase(addCarList.fulfilled, (state, action) => {
        state.isLoading[4] = false
        state.isError[4] = false
        state.isSuccess[4] = true
        state.cars = state.cars.concat(action.payload)
      })
      .addCase(addCarList.rejected, (state, action) => {
        state.isLoading[4] = false
        state.isError[4] = true
        state.isSuccess[4] = false
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
      .addCase(deleteCar.pending, (state) => {
        state.isLoading[2] = true
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.isLoading[2] = false
        state.isError[2] = false
        state.isSuccess[2] = true
        const index = state.cars.findIndex(car => car.registration_id === action.payload)
        state.cars.splice(index, 1)
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.isLoading[2] = false
        state.isError[2] = true
        state.isSuccess[2] = false
        state.message = action.payload
      })
      
  },
})

export const { reset } = CarSlice.actions
export default CarSlice.reducer