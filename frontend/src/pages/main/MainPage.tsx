import { useState, useEffect, useDeferredValue, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import "./MainPage.scss";

import Header from "../../widgets/header/ui/Header";
import FeedsSwitcher from "../../widgets/feedsSwitcher/ui/FeedsSwitcher";
import Gallery from "../../widgets/gallery/ui/Gallery";
import ArtInfoMW from "../../widgets/artInfoMW/ui/ArtInfoMW";
import { fetchNewArts, fetchNewPage, selectNext } from "../../app/model/slices/artsSlice";
import { selectIsAuth, selectMyId } from "../../app/model/slices/authSlice";
import FiltersField from "../../widgets/filtersField/ui/FiltersField";

const MainPage = () => {

  const dispatch  = useDispatch<ThunkDispatch>();
  const nextUrl = useSelector(selectNext);
  useBottomScrollListener(() => nextUrl ? dispatch(fetchNewPage()) : console.log('доскроллили до конца'));

  const isAuth = useSelector(selectIsAuth);
  const myId = useSelector(selectMyId);
  const [menuLinks, setMenuLinks] = useState([{url:"/authorization", name:"Вход"}, {url:"/registration", name:"Регистрация"}]);
  const [feedsNames, setFeedsNames] = useState(["новые работы", "популярное"]);

  useEffect(() => {
    if (isAuth) {
      setMenuLinks([{url:`/users/${myId}`, name:"Профиль"}, {url:"/messenger/id", name:"Сообщения"}, {url:"/", name:"Выход"}]);
      setFeedsNames(["новые работы", "популярное", "подписки"]);
    } else {
      setMenuLinks([{url:"/authorization", name:"Вход"}, {url:"/registration", name:"Регистрация"}]);
      setFeedsNames(["новые работы", "популярное"]);
    }
  }, [isAuth])

  //modal-block----------------------------------------------------------
  useEffect(() => {
    dispatch(fetchNewArts());
    return () => clearAllBodyScrollLocks();
   }, []);

  const [modalClose, setModalClose] = useState<boolean>(true);
  const [imgId, setImgId] = useState<number>();
  // const debounceImgId = useDeferredValue(imgId);
  const modalRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    if (modalRef) {
      if (modalClose) {
      enableBodyScroll(modalRef);
      } else {
        disableBodyScroll(modalRef);
      }
    }
  }, [modalClose]);

  const onSetModalOpen = (imgId : number) => {
    setImgId(imgId);
    setModalClose(false);
  }

  const onSetModalClose = () => {
    setModalClose(true);
  }
  //end-modal-block------------------------------------------------------

  return (
    <>
      <header className="header">
        <Header menuLinks={menuLinks}/>
        <FeedsSwitcher feedsNames={feedsNames}/>
        <FiltersField/>
      </header>
      <main className="main">
        <Gallery onSetModalOpen={onSetModalOpen}/>
        {modalClose ? null : 
          <div ref={modalRef}>
            <ArtInfoMW imgId={imgId} onSetModalClose={onSetModalClose}/>
          </div>
        }
      </main>
    </>
  )
}

export default MainPage;