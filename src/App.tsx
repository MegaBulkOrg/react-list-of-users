import { NotFound } from "Shared/NotFound";
import { Login } from "Shared/pages/Login";
import { RegForm } from "Shared/pages/RegForm";
import { UserInfo } from "Shared/pages/UserInfo";
import { Users } from "Shared/pages/Users";
import { rootReducer } from "Store/store";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import "./global.css";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

function AppContent() {    
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/sign-up" element={<RegForm/>} />
      <Route path="/" element={<Users/>} />
      <Route path="/users" element={<Navigate to="/" />} />
      <Route path="/users/:user" element={<UserInfo/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export function ClientApp() {    
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};

export const ServerApp = (url: string) => {
  return (
    <Provider store={store}>
      <StaticRouter location={url}>
        <AppContent />
      </StaticRouter>
    </Provider>
  );
};
