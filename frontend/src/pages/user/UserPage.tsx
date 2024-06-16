import { useState, useDeferredValue, useEffect, useRef} from "react";
import { useParams } from "react-router-dom";
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

import Header from "../../widgets/header/ui/Header";
import Gallery from "../../widgets/gallery/ui/Gallery";
import ArtInfoMW from "../../widgets/artInfoMW/ui/ArtInfoMW";
import { selectIsAuth, selectMyId, selectSubscriptions } from "../../app/model/slices/authSlice";
import Wallpaper from "../../shared/ui/wallpaper/Wallpaper";
import { fetchUser } from "../../app/model/slices/userSlice";
import UserInfoSection from "../../widgets/userInfoSection/ui/UserInfoSection";
import FollowersMW from "../../widgets/followersMW/ui/FollowersMW";
import { fetchNewPage, fetchUserArts, selectNext } from "../../app/model/slices/artsSlice";
import SettingProfileMW from "../../widgets/settingProfileMW/ui/SettingProfileMW";
import PublishMW from "../../widgets/publishMW/ui/PublishMW";
import { IUser } from "../../entities/User";

export const UserPage = () => {

  const {userId} = useParams();
  const dispatchThunk = useDispatch<ThunkDispatch>();

  const nextUrl = useSelector(selectNext);
  useBottomScrollListener(() => nextUrl ? dispatchThunk(fetchNewPage()) : console.log('доскроллили до конца'));

  const isAuth = useSelector(selectIsAuth);
  const myId = useSelector(selectMyId);
  const subscriptions = useSelector(selectSubscriptions);
  const [isMySubscription, setIsMySubscription] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [menuLinks, setMenuLinks] = useState([{url:"/authorization", name:"Вход"}, {url:"/registration", name:"Регистрация"}]);

  useEffect(() => {
    if (isAuth) {
      setIsMine((myId == userId) ? true : false);
      setIsMySubscription(!!subscriptions?.find((item : IUser) => item.id == userId));
      if (myId == userId) {
        setMenuLinks([{url:"/", name:"Главная"}, {url:"/messenger/id", name:"Сообщения"}, {url:"/", name:"Выход"}]);
      } else {
        setMenuLinks([{url:"/", name:"Главная"}, {url:`/users/${myId}`, name:"Профиль"}, {url:"/messenger/id", name:"Сообщения"}, {url:"/", name:"Выход"}]);
      }
      
    } else {
      setMenuLinks([{url:"/", name:"Главная"}, {url:"/authorization", name:"Вход"}, {url:"/registration", name:"Регистрация"}]);
    }
  }, [isAuth, subscriptions, myId, userId])


  //modal-block----------------------------------------------------------
  useEffect(() => {

    if (userId) {
      dispatchThunk(fetchUser(userId));
      dispatchThunk(fetchUserArts(userId));
    }

    return () => clearAllBodyScrollLocks();
   }, [userId]);

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

  // const [priceListModalClose, setPriceListModalClose] = useState<boolean>(true);

  // const onSetPriceListModalOpen = () => {
  //   setPriceListModalClose(false);
  // }

  // const onSetPriceListModalClose = () => {
  //   setPriceListModalClose(true);
  // }


  const [publishModalClose, setPublishModalClose] = useState<boolean>(true);

  const onSetPublishModalOpen = () => {
    setPublishModalClose(false);
  }

  const onSetPublishModalClose = () => {
    setPublishModalClose(true);
  }


  const [followersModalClose, setFollowersModalClose] = useState<boolean>(true);
  const [followers, setFollowers] = useState<IUser[] | null>([]);

  const onSetFollowersModalOpen = (data : IUser[] | null) => {
    setFollowers(data);
    // console.log(data)
    setFollowersModalClose(false);
  }

  const onSetFollowersModalClose = () => {
    setFollowersModalClose(true);
  }

  const [profileModalClose, setProfileModalClose] = useState<boolean>(true);

  const onSetProfileModalOpen = () => {
    setProfileModalClose(false);
  }

  const onSetProfileModalClose = () => {
    setProfileModalClose(true);
  }
  //end-modal-block------------------------------------------------------

  return (
    <>
      <header className="header" style={{position: "static", overflowX: "hidden"}}>
        <Header menuLinks={menuLinks}/>
        <Wallpaper/>
        <UserInfoSection isMine={isMine} 
                         userId={userId}
                         isMySubscription={isMySubscription}
                        //  onSetModalOpen={onSetPriceListModalOpen}
                         onSetPublishModalOpen={onSetPublishModalOpen} 
                         onSetFollowersModalOpen={onSetFollowersModalOpen} 
                         onSetProfileModalOpen={onSetProfileModalOpen}/>
      </header>
      <main className="main" style={{paddingTop: "0px"}}>
        <Gallery onSetModalOpen={onSetModalOpen}/>
        {modalClose ? null : 
          <div ref={modalRef}>
            <ArtInfoMW imgId={imgId} onSetModalClose={onSetModalClose}/>
          </div>
        }
        {followersModalClose ? null : <FollowersMW userData={followers} onSetModalClose={onSetFollowersModalClose}/>}
        {profileModalClose ? null : <SettingProfileMW onSetModalClose={onSetProfileModalClose}/>} 
        {publishModalClose ? null : <PublishMW onSetModalClose={onSetPublishModalClose}/>}
      </main>
    </>
  )
}