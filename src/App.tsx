import { useLazyGetUsersListQuery } from "Redux/api/users";
import { useAppSelector } from "Redux/hooks";
import store, { persistor } from "Redux/store";
import { EditProfile } from "Shared/pages/EditProfile";
import { Login } from "Shared/pages/Login";
import { NotFound } from "Shared/pages/NotFound";
import { RegForm } from "Shared/pages/RegForm";
import { UserInfo } from "Shared/pages/UserInfo";
import { Users } from "Shared/pages/Users";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { PersistGate } from 'redux-persist/integration/react';
import "./global.css";


function AppContent() {
  const accessToken = useAppSelector(state => state.auth.accessToken)
  const [isAuth, setIsAuth] = useState(accessToken ? true : false)
  const errorResponses = [
    'Missing authorization header',
    'jwt expired',
    'jwt malformed'
  ]
  const [trigger] = useLazyGetUsersListQuery()
  // для проверки актуальности токена берем запрос на информацию о пользователях
  // (отдельного запроса на проверку актуальности токена делать не стал)
  // тут в триггер в качестве аргумента можно вставлять любое число кроме 1
  // -- тогда при авторизации при первом открытии списка пользователей происходит ошибка
  useEffect(() => {
    trigger(0).unwrap()
      .then(() => setIsAuth(true))
      .catch(error => {
        if (errorResponses.includes(error.data)) setIsAuth(false)
      })
  },[accessToken])

  return (
    <Routes>
      <Route path="/login" element={isAuth ? <Navigate to="/" /> : <Login/>} />
      <Route path="/sign-up" element={<RegForm/>} />
      <Route path="/" element={isAuth ? <Users/> : <Navigate to="/login" />} />
      <Route path="/users" element={isAuth ? <Navigate to="/" /> : <Navigate to="/login" />} />
      <Route path="/users/:user" element={isAuth ? <UserInfo/> : <Navigate to="/login" />} />
      <Route path="/users/edit-profile" element={isAuth ? <EditProfile/> : <Navigate to="/login" />} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}


export function ClientApp() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};


export const ServerApp = (url: string) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StaticRouter location={url}>
          <AppContent />
        </StaticRouter>
      </PersistGate>
    </Provider>
  );
};