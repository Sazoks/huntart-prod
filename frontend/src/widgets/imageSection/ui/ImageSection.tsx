import {FC, useEffect, useState, useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEye, faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

import "./ImageSection.scss";
import { selectStatus as selectArtStatus, selectId, selectUsername, selectUrl, selectCountLikes, selectIsLiked, fetchSetLike, fetchArt, selectDescription, fetchUnsetLike, selectAuthorId, selectViews } from "../../../app/model/slices/artSlice";
import { selectIsAuth, selectMyId, selectMyUsername, selectSubscriptions } from "../../../app/model/slices/authSlice";
import clsx from "clsx";
import { fetchSubscribe, fetchUnsubscribe, selectStatus, subscribe, unsubscribe } from "../../../app/model/slices/userSlice";


interface ImageSectionProps {
  imgSrc?: string;
}

const ImageSection:FC<ImageSectionProps> = () => {

  const dispatch = useDispatch();
  const dispatchThunk = useDispatch<ThunkDispatch>();

  const isAuth = useSelector(selectIsAuth);

  const authorId = useSelector(selectAuthorId);
  const username = useSelector(selectUsername);
  const artId = useSelector(selectId);
  const url = useSelector(selectUrl);
  const countLikes = useSelector(selectCountLikes);
  const isLiked = useSelector(selectIsLiked);
  const views = useSelector(selectViews);

  const [isMine, setIsMine] = useState(false);
  const myId = useSelector(selectMyId);
  const myUsername = useSelector(selectMyUsername);
  const subscriptions = useSelector(selectSubscriptions);
  const [isMySubscription, setIsMySubscription] = useState(false);

  const status = useSelector(selectStatus);
  const statusArt = useSelector(selectArtStatus);

  const btnRef = useRef(null);

  useEffect(() => {
    if (statusArt === 'loaded') {
      // console.log(authorId)
      // console.log(subscriptions)
      // console.log(myId)
      setIsMine((myId == authorId) ? true : false);
      setIsMySubscription(!!subscriptions?.find(item => item.id == authorId));
      // console.log(isAuth)
      // console.log(isMine)
      // console.log(isMySubscription)
    }
  }, [statusArt, subscriptions, authorId, myId])

  const onLike = () => {
    if (isLiked) {
      dispatchThunk(fetchUnsetLike(artId));
    } else {
      dispatchThunk(fetchSetLike(artId));
    }
  }

  const onSubscribe = async () => {
    btnRef.current.disabled = true;

    if (isMySubscription) {
      await dispatchThunk(fetchUnsubscribe(authorId))
      if (status === 'loaded') {
        dispatch(unsubscribe(myId))
        setIsMySubscription(false)
      }
    } else {
      await dispatchThunk(fetchSubscribe(authorId))
      if (status === 'loaded') {
        dispatch(subscribe({id: myId, username: myUsername}))
        setIsMySubscription(true)
      }
    }
    btnRef.current.disabled = false;
  }

  return (
    <div className="modal__img-section">

      {/* <div className="modal__img-username-container">
        {!isAuth || isMine ? null :
          <button className="subscribe-btn" ref={btnRef} onClick={(e) => onSubscribe(e)}>
            {isMySubscription ? 
              <FontAwesomeIcon icon={faCheck} className="subscribe__icon"/>
              :
              <FontAwesomeIcon icon={faPlus} className="subscribe__icon"/>
            }
          </button>
        }
        <a href={`/users/${authorId}`} className="modal__username">{username}</a>
      </div> */}

      <a href={`/users/${authorId}`} className="modal__username">{username}</a>

      <div className="modal__img-block">
        <div className="modal__img-wrapper">
          <img
            className='modal__img'
            src={url}
          />
        </div>
      </div>
      {/* <div className="modal__btns-container">
        <div className="modal__views">
          {views}
          <span> </span>
          <FontAwesomeIcon className={clsx("modal__like-icon", isLiked && "modal__like-icon--liked")} icon={faEye}/>
        </div>
        <button className="modal__like-btn" onClick={() => onLike()}>
          {countLikes}
          <span> </span>
          <FontAwesomeIcon className={clsx("modal__like-icon", isLiked && "modal__like-icon--liked")} icon={faHeart}/>
        </button>
      </div> */}
      {/* <div className="modal__tags">{tagsStr}</div> */}
      {/* <div className="modal__tags">{description}</div> */}
      
    </div>
  )
}

export default ImageSection;