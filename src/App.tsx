import React, { useEffect, useState } from "react";
import { hot } from "react-hot-loader/root";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { Login } from "Shared/pages/Login";
import { RegForm } from "Shared/pages/RegForm";
import { UserInfo } from "Shared/pages/UserInfo";
import { Users } from "Shared/pages/Users";
import { authorizationStatus } from "Store/authorization";
import "./global.css";

import { NotFound } from "./shared/NotFound";
import { rootReducer } from "./store/store";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

function AppContent() {
  const dispatch = useDispatch<any>()
  const isAuth = localStorage.getItem('user')
  if(isAuth !== null) dispatch(authorizationStatus(true))

  return (
    <BrowserRouter>            
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/sign-up" element={<RegForm/>} />
        <Route path="/" element={<Users/>} />
        <Route path="/users" element={<Navigate to="/" />} />
        <Route path="/users/:user" element={<UserInfo/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

function AppComponent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return <Provider store={store}>{mounted && <AppContent />}</Provider>;
}

export const App = hot(() => <AppComponent />);