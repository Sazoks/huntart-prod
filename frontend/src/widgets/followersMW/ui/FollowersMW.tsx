import { FC, useState, useDeferredValue, useMemo } from "react";
import ModalWindow from "../../../shared/ui/modalWindow/ModalWindow";
import InterlocutorsList from "../../../shared/ui/interlocutorsList/InterlocutorsList";
import SearchInput from "../../../shared/ui/searchInput/SearchInput";
import { IUser } from "../../../entities/User";
import "./FollowersMW.scss";
import { useNavigate } from "react-router-dom";


interface FollowersMWProps {
  onSetModalClose?(): void;
  userData: IUser[] | null;
}


const FollowersMW:FC<FollowersMWProps> = ({userData, onSetModalClose}) => {

  const navigate = useNavigate();
  
  //search-block---------------------------------------------------------

  const interlocutorsData = userData;
  // console.log(interlocutorsData)

  const [searchValue, setSearchValue] = useState('');

  const debounceSearchValue = useDeferredValue(searchValue);

  const onSetSearchValue = (value: string) => {
    setSearchValue(value);
  }

  const foundContent = useMemo(findUser, [debounceSearchValue]);

  function findUser():IUser[] {
    if (searchValue === '') {
      return [];
    } else {
      // return interlocutorsData?.filter(user => user.username.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1);
      return interlocutorsData ? interlocutorsData.filter(user => user.username.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1) : [];
    }
  }
  //end-search-block-----------------------------------------------------

  return (
    <ModalWindow onSetModalClose={onSetModalClose}>

      <div className="followers-wrapper">
        <div className="input-wrapper" style={{border: "none", marginBottom: "10px"}}>
        <SearchInput  className="search__input not-absolute"
                      placeholder="Введите Ваш запрос..."
                      disabled={false}
                      onSetSearchValue={onSetSearchValue}
                      // isPopupOpen={isPopupOpen}
                      />
        </div>
        <div style={{overflowY: "auto", maxHeight: "480px"}}>
          <InterlocutorsList interlocutors={searchValue.length > 0 ? foundContent : interlocutorsData}
                            onSelect={(id) => {navigate(`/users/${id}`); onSetModalClose?.()}}/>
        </div>
        
      </div>

    </ModalWindow>
  )
}

export default FollowersMW;