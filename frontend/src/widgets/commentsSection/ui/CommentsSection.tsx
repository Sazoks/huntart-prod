import { FC, useEffect, useState, useRef, useCallback } from "react";
import Chat from "../../../shared/ui/chat/Chat";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { fetchComment, fetchComments, fetchNextComments, selectCommNext, selectCommStatus, selectComments, selectId } from "../../../app/model/slices/artSlice";
import { NavLink } from "react-router-dom";
import "./CommentsSection.scss";
import { selectIsAuth, selectMyId } from "../../../app/model/slices/authSlice";
import clsx from "clsx";
// import { useBottomScrollListener } from "react-bottom-scroll-listener";

interface CommentsSectionProps {
  artId?: string;
  height?: string;
  placeholder?: string;
}

const STANDARD_HEIGHT = "450px"//"506px"
const DEFAULT_PLACEHOLDER = "Введите комментарий..."

const CommentsSection:FC<CommentsSectionProps> = ({artId, height=STANDARD_HEIGHT, placeholder=DEFAULT_PLACEHOLDER}) => {

  const dispatch = useDispatch<ThunkDispatch>();

  // const artId = useSelector(selectId);
  const comments = useSelector(selectComments);
  const isAuth = useSelector(selectIsAuth);
  const myId = useSelector(selectMyId);

  const commNext = useSelector(selectCommNext);
  const status = useSelector(selectCommStatus);
  // console.log("commNext", commNext)

  // useEffect(() => {
  //   // dispatch(fetchComments(artId));
  // }, [])

  //Scroll behaviour
  // const scrollRef = useBottomScrollListener(() => console.log("scroll bottom"))
  const scrollRef = useRef(null);
  const msgsEndRef = useRef(null)

  const scrollToBottom = () => {
    msgsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleScroll = useCallback((e) => {
    let scrollBottom = Math.floor(e.target.scrollHeight + e.target.scrollTop - e.target.clientHeight);

    // console.log(scrollBottom)
    
    if (scrollBottom <= 4) {
      console.log('scrolled to top')
      console.log(commNext)
      if (commNext) {
        dispatch(fetchNextComments())
      } else {
        console.log('доскроллили до конца');
      }
    }
  }, [commNext]);

  useEffect(() => {
    scrollRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      scrollRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [commNext]);

  useEffect(() => {
    setTimeout(scrollToBottom, 500)
  }, [artId]);

  //Input behaviour
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (message) {
        dispatch(fetchComment({id: artId, text: message}))
        setMessage('')
        setTimeout(scrollToBottom, 500)
      } 
    }
  };

  const renderInput = () => {
    return  <div className="chat__input-block">
              <input type="text" 
                     className="chat__input"
                     value={message}
                     placeholder={placeholder}
                     onChange={handleChange}
                     onKeyDown={handleKeyDown}/>
            </div>
  }

  const renderComments = () => {

      return (
        <ul className="chat__comments-list" ref={scrollRef}>
          <div ref={msgsEndRef}/>
          {
            comments?.map((comment) => {
              const dateStr = comment.created_at;
              const date = new Date(dateStr)
              const yyyy = date.getFullYear();
              let mm = date.getMonth() + 1; // Months start at 0!
              let dd = date.getDate();
              if (dd < 10) dd = '0' + dd;
              if (mm < 10) mm = '0' + mm;
              
              const hour = date.getHours();
              const min = date.getMinutes();
              // const sec = date.getSeconds();

              const formattedDate = `${hour}:${min} ${dd}.${mm}.${yyyy}`;
              // console.log(formattedDate)

              return (
                <li className={clsx("chat__comment", isAuth && (myId === comment?.user?.id) && 'chat__comment--yours')} key={comment.id}>
                  <NavLink className="chat__comm-author" to={`/users/${comment?.user?.id}`}>{comment?.user?.username}</NavLink>
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
    <div className="comments">
      <Chat renderInput={renderInput} renderMsgs={() => renderComments()} height={height} data={comments}/>
      {status === 'error' ? <div className="modal__error">Авторизируйтесь, чтобы оставить комментарий!</div> : null}
    </div>
  )
}

export default CommentsSection;