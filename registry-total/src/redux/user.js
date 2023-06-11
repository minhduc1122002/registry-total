import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

const initialState = {
  users: [],
  isError: [false, false, false, false],
  isSuccess: [false, false, false, false],
  isLoading: [false, false, false, false],
  message: '',
}

const BASE_URL = "http://localhost:8000/api/";

//get all users
export const getUserList = createAsyncThunk('user/list', async (thunkAPI) => {
  try {
    const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
    const response = await axios.create({
        baseURL: BASE_URL,
        headers: { token: `${TOKEN}` },
    }).get("/user")
    return response.data
  } catch (error) {
    const message = (error.response &&
      (error.response.data ||
        error.response.data.message)) || error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

//add users
export const addUser = createAsyncThunk('user/add', async (user, thunkAPI) => {
  try {
        const TOKEN = JSON.parse(localStorage.getItem('accessToken'))
        const response = await axios.create({
            baseURL: BASE_URL,
            headers: { token: `${TOKEN}` },
        }).post("/register", user)
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

export const UserSlice = createSlice({
  name: 'user',
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
      .addCase(getUserList.pending, (state) => {
        state.isLoading[3] = true
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.isLoading[3] = false
        state.isSuccess[3] = true
        state.users = action.payload
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.isLoading[3] = false
        state.isError[3] = true
        state.isSuccess[3] = false
        state.message = action.payload
        state.users = []
      })
      .addCase(addUser.pending, (state) => {
        state.isLoading[0] = true
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading[0] = false
        state.isError[0] = false
        state.isSuccess[0] = true
        state.users.push(action.payload)
      })
      .addCase(addUser.rejected, (state, action) => {
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

export const { reset } = UserSlice.actions
export default UserSlice.reducer