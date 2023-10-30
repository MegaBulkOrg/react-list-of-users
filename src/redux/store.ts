import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore
} from 'redux-persist';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { uploadApi } from './api/img';
import { usersApi } from './api/users';
import authReducer from "./authSlice";

const createNoopStorage = () => {
  return {
    getAllKeys(_key: any) {
      return Promise.resolve([]);
    },
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve(null);
    },
  }
}
const storage = 
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage()

const rootReducer = combineReducers({
  auth: authReducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [uploadApi.reducerPath]: uploadApi.reducer
})

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [usersApi.reducerPath, uploadApi.reducerPath]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(
        usersApi.middleware,
        uploadApi.middleware
      )
})

export default store
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;