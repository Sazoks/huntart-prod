import { createBrowserRouter, RouterProvider, redirect, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useEffect } from "react";

import './App.css'

import ErrorComponent from "../shared/ui/ErrorComponent";
import MainPage from "../pages/main/MainPage";
import AuthPage from "../pages/authorization/AuthPage";
import RegisterPage from "../pages/registration/RegisterPage";
import { MessengerPage } from "../pages/messenger/MessengerPage";
import { fetchMe, selectIsAuth, selectStatus } from "./model/slices/authSlice";
import { UserPage } from "../pages/user/UserPage";
import { Messenger } from "../widgets/messenger/ui/Messenger";
import { ReadyState } from "react-use-websocket";
import { SOCKET_URL } from "../shared/api/useChatWebsocket";
import { useChatWebsocket } from "../shared/api/useChatWebsocket";
  
function App() {
  const isAuth = useSelector(selectIsAuth)
  const status = useSelector(selectStatus)

  const dispatch = useDispatch<ThunkDispatch>();
  
  useEffect(() => {
    dispatch(fetchMe());
  }, [])

  const { readyState } = useChatWebsocket();
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];
  console.log(connectionStatus)

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage/>,
      errorElement: <ErrorComponent/>,
    },
    {
      path: "/authorization",
      element: <AuthPage/>,
      errorElement: <ErrorComponent/>,
    },
    {
      path: "/registration",
      element: <RegisterPage/>,
      errorElement: <ErrorComponent/>,
    },
    {
      path: "/users/:userId",
      element: <UserPage/>,
      errorElement: <ErrorComponent/>,
    },
    {
      path: "/messenger",
      element: (!isAuth && status != "loading") ? <Navigate to="/authorization" replace={true}/> : <MessengerPage/>,
      errorElement: <ErrorComponent/>,
      children: [
        {
          path: ":userId",
          element: <Messenger />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
