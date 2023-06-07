import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { publicRequest } from "../request";
import axios from "axios";

const initialState = {
  inspections: [],
  isError: [false, false, false, false],
  isSuccess: [false, false, false, false],
  isLoading: [false, false, false, false],
  message: '',
}

const BASE_URL = "http://localhost:8000/api/";

//get all inspections
export const getInspectionList = createAsyncThunk('form/list', async (thunkAPI) => {
  try {
    const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
    const response = await axios.create({
        baseURL: BASE_URL,
        headers: { token: `${TOKEN}` },
    }).get("/form")
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
export const addInspection = createAsyncThunk('form/add', async (inspection, thunkAPI) => {
  try {
        console.log(inspection)
        const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
        const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).post("/form", inspection)
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
export const updateInspectionbyId = createAsyncThunk('form/update', async (inspection, thunkAPI) => {
  try {
        const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
        const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).put(`/form/${inspection.register_id}`, inspection)
        
        return response.data
  } catch (error) {
    console.log(error.response)
    const message = (error.response &&
      (error.response.data ||
      error.response.data.message)) || error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

//delete inspection
export const deleteInspection = createAsyncThunk('form/delete', async (id, thunkAPI) => {
  try {
        const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
        const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).delete("/form/" + id)
        return id
  }catch (error) {
    const message = (error.response &&
      (error.response.data ||
        error.response.data.message)) || error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
export const InspectionSlice = createSlice({
  name: 'inspection',
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
      .addCase(getInspectionList.pending, (state) => {
        state.isLoading[3] = true
      })
      .addCase(getInspectionList.fulfilled, (state, action) => {
        state.isLoading[3] = false
        state.isSuccess[3] = true
        state.inspections = action.payload
      })
      .addCase(getInspectionList.rejected, (state, action) => {
        state.isLoading[3] = false
        state.isError[3] = true
        state.isSuccess[3] = false
        state.message = action.payload
        state.inspections = []
      })
      .addCase(addInspection.pending, (state) => {
        state.isLoading[0] = true
      })
      .addCase(addInspection.fulfilled, (state, action) => {
        state.isLoading[0] = false
        state.isError[0] = false
        state.isSuccess[0] = true
        state.inspections.push(action.payload)
      })
      .addCase(addInspection.rejected, (state, action) => {
        state.isLoading[0] = false
        state.isError[0] = true
        state.isSuccess[0] = false
        state.message = action.payload
      })
      .addCase(updateInspectionbyId.pending, (state) => {
        state.isLoading[1] = true
      })
      .addCase(updateInspectionbyId.fulfilled, (state, action) => {
        state.isLoading[1] = false
        state.isError[1] = false
        state.isSuccess[1] = true
        state.inspections[
          state.inspections.findIndex(index => index.register_id === action.payload.register_id)
        ] = action.payload
      })
      .addCase(updateInspectionbyId.rejected, (state, action) => {
        state.isLoading[1] = false
        state.isError[1] = true
        state.isSuccess[1] = false
        state.message = action.payload
      })
      .addCase(deleteInspection.pending, (state) => {
        state.isLoading[2] = true
      })
      .addCase(deleteInspection.fulfilled, (state, action) => {
        state.isLoading[2] = false
        state.isError[2] = false
        state.isSuccess[2] = true
        const index = state.inspections.findIndex(inspection => inspection.register_id === action.payload)
        state.inspections.splice(index, 1)
      })
      .addCase(deleteInspection.rejected, (state, action) => {
        state.isLoading[2] = false
        state.isError[2] = true
        state.isSuccess[2] = false
        state.message = action.payload
      })
      
  },
})

export const { reset } = InspectionSlice.actions
export default InspectionSlice.reducer