import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import useWebSocket from "react-use-websocket";

import "./Messenger.scss"

import Chat from "../../../shared/ui/chat/Chat";
import Message from "../../../shared/ui/message/Message";
import InterlocutorItem from "../../../shared/ui/interlocutorItem/InterlocutorItem";
import { SOCKET_URL, useChatWebsocket } from "../../../shared/api/useChatWebsocket";
import { selectIsAuth, selectMyId } from "../../../app/model/slices/authSlice";
import { fetchMessages, fetchNewPage, fetchReadMessages, selectMsgs, selectNext, setNewMsg } from "../../../app/model/slices/msgsSlice";
import { fetchChats, selectChats, setActive, setChatActive, setChatReaded, setChatUnreaded } from "../../../app/model/slices/chatsSlice";

export const Messenger = () => {

  const {sendJsonMessage, lastJsonMessage} = useChatWebsocket();
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const dispatchThunk = useDispatch<ThunkDispatch>();

  const {userId} = useParams();
  const token = localStorage.getItem('token');
  const chats = useSelector(selectChats);
  const isAuth = useSelector(selectIsAuth);
  const myId = useSelector(selectMyId);

  useEffect(() => {
    sendJsonMessage({
      "subsystem": "auth",
      "action": "auth",
      "headers": {
           "jwt_access": token,
       },
    })
  }, [])

  //UseEffect, зависящий от lastJsonMessage
  useEffect(() => {
    console.log(`Got a new message: `, lastJsonMessage)

    const chatId = chats.findIndex(chat => chat.id == lastJsonMessage?.data?.author?.id)
    if ((chatId === -1) && (lastJsonMessage?.data?.author?.id  != myId)) {
      dispatchThunk(fetchChats())
    }

    if ((lastJsonMessage?.action === "new_message") && (lastJsonMessage?.data?.author?.id == userId || lastJsonMessage?.data?.author?.id == myId)) {
      console.log("read a new msg");

      sendJsonMessage({
        "subsystem": "chat",
        "action": "read_message",
        "headers": {
            "jwt_access": token,
        },
        "data": {
            "user_id": Number(userId),
            "message_id": lastJsonMessage?.data?.message_id,
        },
      })

      console.log("Получено новое сообщение из текущего чата", lastJsonMessage?.data?.message_text)
      dispatch(setNewMsg({
        id: lastJsonMessage?.data?.message_id,
        text: lastJsonMessage?.data?.message_text,
        created_at: lastJsonMessage?.data?.created_at,
        // chat: ,
        user: lastJsonMessage?.data?.author?.id,
      }))
      setTimeout(scrollToBottom, 200)
      
    } else if (lastJsonMessage?.action === "new_message") {
      console.log("Получено новое сообщение из другого чата", lastJsonMessage?.data?.message_text)
      dispatch(setChatUnreaded(lastJsonMessage?.data?.author?.id))
    }
  }, [lastJsonMessage])
  
  //Получаем собеседника
  const [interlocutor, setInterlocutor] = useState(null);
  
  useEffect(() => {
    const fetchInterlocutor = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/users/${userId}/`);
        setInterlocutor({
          id: response.data.id,
          username: response.data.username,
          avatar: response.data.profile.avatar,
        });
      } catch (err) {
        console.log(err)
      }
    }
    if (userId != "id") {
      console.log("active")
      dispatch(setActive(userId))
      fetchInterlocutor();
      dispatchThunk(fetchMessages(userId)).then(res => dispatchThunk(fetchReadMessages(userId)))
      dispatch(setChatReaded(userId))
    }
  }, [userId])
  

  //Создаем input чата, отслеживаем события отправки сообщения
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (message) {
        console.log(`отправка сообщения по вебсокету пользователю ${userId}`, message)
        sendJsonMessage({
          "subsystem": "chat",
          "action": "receive_message",
          "headers": {
              "jwt_access": token,
          },
          "data": {
              "user_id": Number(userId),
              "message_text": message,
          },
        })
        setMessage('')
        const chatId = chats.findIndex(chat => chat.id == userId)
        if (chatId === -1) {
          setTimeout(dispatchThunk(fetchChats()), 500)
        }
      } 
    }
  };

  const renderInput = () => {
    return  <div className="chat__input-block">
              <input type="text" 
                     className="chat__input"
                     value={message}
                     placeholder={"Введите текст сообщения..."}
                     onChange={handleChange}
                     onKeyDown={handleKeyDown}/>
            </div>
  }

  //Обрабатываем события скролла и пагинацию
  const nextPage = useSelector(selectNext)
  const scrollRef = useRef(null);
  const msgsEndRef = useRef(null)

  const scrollToBottom = () => {
    msgsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleScroll = useCallback((e) => {
    let scrollBottom = Math.floor(e.target.scrollHeight + e.target.scrollTop - e.target.clientHeight);

    if (scrollBottom <= 4 && nextPage) {
      dispatchThunk(fetchNewPage())
    }
  }, [nextPage]);

  useEffect(() => {
    scrollRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      scrollRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [nextPage]);

  useEffect(() => {
    setTimeout(scrollToBottom, 500)
  }, [userId]);

  //Создаем само окошко чата
  const messages = useSelector(selectMsgs);

  const renderMessages = () => {

      return (
        <ul className="chat__comments-list" ref={scrollRef}>
          <div ref={msgsEndRef}/>
          {
            messages?.map((comment) => {
              const dateStr = comment.created_at;
              const date = new Date(dateStr)
              const yyyy = date.getFullYear();
              let mm = date.getMonth() + 1; // Months start at 0!
              let dd = date.getDate();
              if (dd < 10) dd = '0' + dd;
              if (mm < 10) mm = '0' + mm;              
              
              let hour = date.getHours();
              let min = date.getMinutes();
              if (hour < 10) hour = '0' + hour;
              if (min < 10) min = '0' + min;

              const formattedDate = `${hour}:${min} ${dd}.${mm}.${yyyy}`;

              return (
                <li className={clsx("chat__comment", isAuth && (myId === comment?.user) && 'chat__comment--yours')} key={comment.id}>
                  <p className="chat__comm-content">{comment.text}</p>
                  <p className="chat__comm-date">{formattedDate}</p>
                </li>
              )
            })
          }
          {/* <div ref={msgsEndRef}/> */}
        </ul>
      )
  }
  
  
  return (
    <>
      <div className="messenger">
        {
          userId != "id" ?
          <>
            <InterlocutorItem id={interlocutor?.id}
                              username={interlocutor?.username} 
                              avatar={interlocutor?.avatar}
                              />
            <Chat renderInput={renderInput} 
                  renderMsgs={() => renderMessages()} 
                  data={messages}/>
          </>
          : <Message msgTitle={`Чат не выбран`} 
                     msgText="Выберите собеседника из списка слева,
                              чтобы начать общение"/>
        }
      </div>
    </>
  )
}