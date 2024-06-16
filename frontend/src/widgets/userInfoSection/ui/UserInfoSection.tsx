import { FC, useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import "./UserInfoSection.scss";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { fetchSubscribe, fetchUnsubscribe, selectAvatar, selectDescription, selectFollowersCount, selectStatus, selectUserFollowers, selectUserId, selectUserSubscriptions, selectUsername, subscribe, unsubscribe } from "../../../app/model/slices/userSlice";
import { selectIsAuth, selectMyId, selectMyUsername, selectSubscriptions } from "../../../app/model/slices/authSlice";
import { IUser } from "../../../entities/User";
import { useNavigate } from "react-router-dom";

interface UserInfoSectionProps {
  isMine?: boolean;
  userId?: string;
  isMySubscription?: boolean;
  // onSetModalOpen?(): void;
  onSetPublishModalOpen?(): void;
  onSetFollowersModalOpen(data : IUser[] | null): [] | void;
  onSetProfileModalOpen?(): void;
}


const UserInfoSection:FC<UserInfoSectionProps> = ({userId, isMine, onSetPublishModalOpen, onSetFollowersModalOpen, onSetProfileModalOpen}) => {
  
  const navigate = useNavigate();
  const btnRef = useRef(null);
  const subscriptions = useSelector(selectSubscriptions);
  const [isMySubscription, setIsMySubscription] = useState(false);

  const dispatch = useDispatch();
  const dispatchThunk = useDispatch<ThunkDispatch>();

  const status = useSelector(selectStatus);

  const isAuth = useSelector(selectIsAuth);
  const myId = useSelector(selectMyId);
  const myUsername = useSelector(selectMyUsername);

  const avatar = useSelector(selectAvatar);
  const description = useSelector(selectDescription);
  const username = useSelector(selectUsername);
  const followersCount = useSelector(selectFollowersCount);
  // const userId = useSelector(selectUserId);

  const userSubscriptions = useSelector(selectUserSubscriptions);
  const userFollowers = useSelector(selectUserFollowers);

  const [mine, setMine] = useState(false);

  useEffect(() => {
    setMine((myId == userId) ? true : false);
  }, [myId, userId])

  useEffect(() => {
    // console.log(subscriptions)
    // console.log(userId)
    setIsMySubscription(!!subscriptions?.find(item => item.id == userId));
  }, [subscriptions, userId])

  const onSubscribe = async (e) => {
    btnRef.current.disabled = true;

    if (isMySubscription) {
      await dispatchThunk(fetchUnsubscribe(userId))
      if (status === 'loaded') {
        dispatch(unsubscribe(myId))
        setIsMySubscription(false)
      }
    } else {
      await dispatchThunk(fetchSubscribe(userId))
      if (status === 'loaded') {
        dispatch(subscribe({id: myId, username: myUsername}))
        setIsMySubscription(true)
      }
    }
    btnRef.current.disabled = false;
  }

  return (
    <div className="user__container">

      <div className="userinfosection">
        
        <div className="avatar-container">
          {!isAuth || isMine || mine ? null :
              <button className="subscribe-btn" ref={btnRef} onClick={(e) => onSubscribe(e)}>
                {isMySubscription ? 
                  <FontAwesomeIcon icon={faCheck} className="subscribe__icon"/>
                  :
                  <FontAwesomeIcon icon={faPlus} className="subscribe__icon"/>
                }
              </button>
          }
          <div className="userinfosection__avatar-wrapper">
            {
              avatar ? 
              <img src={avatar} alt="avatar" className="userinfosection__avatar-img" />
              : null
            }
          </div>
          <div className="userinfosection__username">{username || "Имя пользователя"}</div>
          <div className="followers">
            <FontAwesomeIcon icon={faUserGroup} className="followers__icon"/>
            <span className="followers__value">{followersCount || 0}</span>
          </div>
        </div>

        <div className="btns-container">
        <button className="followers-btn" onClick={() => onSetFollowersModalOpen(userFollowers)}>Подписчики</button>
          <button className="followering-btn" onClick={() => onSetFollowersModalOpen(userSubscriptions)}>Подписки</button>
          {/* <button className="open-pricelist-btn" onClick={e => onSetModalOpen?.()}>Открыть прайс-лист</button> */}
          
          {isMine ? 
          <>
            <button onClick={onSetPublishModalOpen}>Опубликовать работу</button>
            <button onClick={onSetProfileModalOpen}>Редактировать профиль</button>
          </>
          :
          <>
            <button className="message-btn" onClick={() => navigate(`/messenger/${userId}`)}>Написать пользователю</button>
            {/* <button className="subscribe-btn">Подписаться</button> */}
          </>}
          
        </div>
      
      </div>

      <div className="user__description">{description}</div>

    </div>
    
  )
}

export default UserInfoSection;