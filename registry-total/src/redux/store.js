import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./auth"
import inspectionReducer from "./inspection"
import carReducer from "./car"
import userReducer from "./user"
import {
  createStateSyncMiddleware,
  initMessageListener,
} from "redux-state-sync";

const config = {
  whitelist: ['auth/login/fulfilled', 'auth/logout/fulfilled']
}
const syncMiddleware = createStateSyncMiddleware(config)

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inspection: inspectionReducer,
    car: carReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(syncMiddleware),
})

initMessageListener(store);