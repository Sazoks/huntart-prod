
import {FC, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

import "./ArtInfoMW.scss";

import ModalWindow from "../../../shared/ui/modalWindow/ModalWindow";
import ImageSection from "../../imageSection/ui/ImageSection"
import CommentsSection from "../../commentsSection/ui/CommentsSection";
import instance from "../../../shared/api/axios";
import { fetchArt, fetchComments, fetchSetLike, fetchUnsetLike, selectCountLikes, selectDescription, selectId, selectIsLiked, selectLikeStatus, selectTags, selectViews } from "../../../app/model/slices/artSlice";
import { selectMyId } from "../../../app/model/slices/authSlice";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

interface ArtInfoModalWindowProps {
  imgId?: number;
  onSetModalClose?(): void;
}

const ArtInfoModalWindow:FC<ArtInfoModalWindowProps> = ({imgId, onSetModalClose}) => {

  const artId = useSelector(selectId);
  const countLikes = useSelector(selectCountLikes);
  const isLiked = useSelector(selectIsLiked);
  const views = useSelector(selectViews);
  const description = useSelector(selectDescription);
  const tags = useSelector(selectTags);
  const tagsStr = tags?.join(' ');
  const statusLike = useSelector(selectLikeStatus);
  console.log('statusLike', statusLike)
  
  const dispatchThunk  = useDispatch<ThunkDispatch>();

  const onLike = () => {
    if (isLiked) {
      dispatchThunk(fetchUnsetLike(artId));
    } else {
      dispatchThunk(fetchSetLike(artId));
    }
  }

  useEffect(() => {
    if (imgId) {
      dispatchThunk(fetchArt(imgId));
      dispatchThunk(fetchComments(imgId));
    } 
    
  }, [imgId])

  return (
    <ModalWindow onSetModalClose={onSetModalClose}>

        <div className="modal__grid">
          <ImageSection/>
          <CommentsSection artId={imgId}/>
        </div>
        {/* <div className="modal__views">
          {views}
          <span> </span>
          <FontAwesomeIcon icon={faEye}/>
        </div> */}
        <div className="modal__btns-container">
          <div className="modal__views">
            {views}
            <span> </span>
            <FontAwesomeIcon className="modal__like-icon" icon={faEye}/>
          </div>
          <button className="modal__like-btn" onClick={() => onLike()}>
            {countLikes}
            <span> </span>
            <FontAwesomeIcon className={clsx("modal__like-icon", isLiked && "modal__like-icon--liked")} icon={faHeart}/>
          </button>
        </div>
        {statusLike === 'error' ? <div className="modal__error">Авторизируйтесь, чтобы поставить лайк!</div> : null}
        {
          tagsStr ? 
          <div className="modal__tags">
            <span className="modal__header">Тэги: </span>
            {tagsStr}
          </div>
          : null
        }
        {description ? 
          <div className="modal__description-section">
            <span className="modal__header">Описание: </span>
            {description}
          </div>
        : null}
      

      {/* <div className="modal__grid">
        <ImageSection/>
        <div className="modal__description-section">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non, adipisci blanditiis fugit, esse a soluta tempore earum, repellat deserunt ex cupiditate?
        </div>
        <CommentsSection/>
      </div> */}
    </ModalWindow>
  )
}

export default ArtInfoModalWindow;