import store, { persistor } from "Redux/store";
import { EditProfile } from "Shared/pages/EditProfile";
import { Login } from "Shared/pages/Login";
import { NotFound } from "Shared/pages/NotFound";
import { RegForm } from "Shared/pages/RegForm";
import { UserInfo } from "Shared/pages/UserInfo";
import { Users } from "Shared/pages/Users";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { PersistGate } from 'redux-persist/integration/react';
import "./global.css";

function AppContent() {    
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/sign-up" element={<RegForm/>} />
      <Route path="/" element={<Users/>} />
      <Route path="/users" element={<Navigate to="/" />} />
      <Route path="/users/:user" element={<UserInfo/>} />
      <Route path="/users/edit-profile" element={<EditProfile/>} />
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
