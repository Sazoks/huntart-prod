import { useState, useDeferredValue, useMemo, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "./MessengerPage.scss";

import Header from "../../widgets/header/ui/Header";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth, selectMyId, selectStatus } from "../../app/model/slices/authSlice";
import { IUser } from "../../entities/User";
import SearchInput from "../../shared/ui/searchInput/SearchInput";
import InterlocutorsList from "../../shared/ui/interlocutorsList/InterlocutorsList";
import { fetchChats, selectChats, setChatActive } from "../../app/model/slices/chatsSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import SearchField from "../../shared/ui/searchField/SearchField";
import { fetchAuthors, selectAuthors } from "../../app/model/slices/authorsSlice";
import { setSearchUsername } from "../../app/model/slices/artsSlice";

export const MessengerPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dispatchThunk = useDispatch<ThunkDispatch>();

  //header
  const isAuth = useSelector(selectIsAuth);
  const status = useSelector(selectStatus)
  const myId = useSelector(selectMyId);
  const [menuLinks, setMenuLinks] = useState([{url:"/authorization", name:"Вход"}, {url:"/registration", name:"Регистрация"}]);

  useEffect(() => {
    if (isAuth) {
      setMenuLinks([{url:`/`, name:"Главная"}, {url:`/users/${myId}`, name:"Профиль"}, {url:"/", name:"Выход"}]);
    } else if (!isAuth && status != "loading") {
      setMenuLinks([{url:`/`, name:"Главная"}, {url:"/authorization", name:"Вход"}, {url:"/registration", name:"Регистрация"}]);
      console.log("redirect")
      // navigate("/authorization")
      
    }
  }, [isAuth, status])
  //end header

  useEffect(() => {
    dispatchThunk(fetchChats())
  }, [])

  const interlocutorsData = useSelector(selectChats);
  // console.log("interlocutorsData", interlocutorsData)

  //search-block---------------------------------------------------------
  const [searchValue, setSearchValue] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const debounceSearchValue = useDeferredValue(searchValue);

  const onSetSearchValue = (value: string) => {
    setSearchValue(value);
    dispatch(setSearchUsername(value))
  }
  const onSetIsPopupOpen = (isOpen: boolean) => {
    setIsPopupOpen(isOpen);
  }

  useEffect(() => {
    dispatchThunk(fetchAuthors(debounceSearchValue));
  }, [debounceSearchValue])

  const authors = useSelector(selectAuthors);
  // console.log(authors)

  const onSelectValue = (value : string) => {
    setSearchValue(value);
    // console.log("searchValue", searchValue)
    dispatch(setSearchUsername(""))
    setIsPopupOpen(false);
    const user = authors.find(user => user.username === value)
    // console.log(user)
    setSearchValue("")
    navigate(`/messenger/${user?.id}`)
  }
  //end-search-block-----------------------------------------------------

  return (
    <>
      <header className="header" style={{position: "static", overflowX: "hidden"}}>
        <Header menuLinks={menuLinks}/>
      </header>
      <main className="main messanger-wrapper" style={{paddingTop: "0px"}}>
        <div className="interlocutors-list-block">
          
          <div className="input-wrapper">
            <SearchField  onSetSearchValue={onSetSearchValue}
                          onSetIsPopupOpen={onSetIsPopupOpen}
                          onSelectValue={onSelectValue}
                          foundValues={authors.map(item => item.username)}
                          isPopupOpen={isPopupOpen}
                          placeholder="Введите имя пользователя"/>
          </div>
          
          <InterlocutorsList interlocutors={interlocutorsData}
                             onSelect={(id) => { dispatch(setChatActive(id)); navigate(`/messenger/${id}`)}}/>
          
        </div>

        <Outlet />

      </main>
    </>
  )
}