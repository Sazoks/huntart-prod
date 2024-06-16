import { useDispatch } from "react-redux";
import { redirect } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { logout } from "../../app/model/slices/authSlice";

export const SOCKET_URL = "ws://80.78.242.175:8000/ws/";

export const useChatWebsocket = () => {

  const dispatch = useDispatch();

  const token = localStorage.getItem('token');

  const socket = useWebSocket(SOCKET_URL, {
    share: true,
    shouldReconnect: (closeEvent) => true,
    onReconnectStop: () => redirect("/"),
    onOpen: () => {
      socket.sendJsonMessage({
        "subsystem": "auth",
        "action": "auth",
        "headers": {
             "jwt_access": token,
         },
    })
    },
    onError: (e) => {
      console.log("Websocket error:", e);
      redirect("/")
    },
    onClose: (e) => {
      console.log("Websocket closed:", e)
    }
  });

  return socket;
}

