import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./auth"

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
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(syncMiddleware),
})

initMessageListener(store);