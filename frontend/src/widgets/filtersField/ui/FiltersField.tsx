import { useDeferredValue, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFilter } from "@fortawesome/free-solid-svg-icons";

import "./FiltersField.scss";

import { fetchAuthors, selectAuthors } from "../../../app/model/slices/authorsSlice";
import SearchField from "../../../shared/ui/searchField/SearchField";
import { fetchNewArts, fetchPopularArts, fetchSubscriptionsArts, selectFeedName, setSearchTags, setSearchUsername } from "../../../app/model/slices/artsSlice";
import { useForm } from "react-hook-form";

const FiltersField = () => {

  const dispatch = useDispatch();
  const dispatchThunk = useDispatch<ThunkDispatch>();

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

  const onSelectValue = (value : string) => {
    setSearchValue(value);
    // console.log(searchValue)
    dispatch(setSearchUsername(value))
    setIsPopupOpen(false);
  }
  //end-search-block-----------------------------------------------------
  type Inputs = {
    // forSale: string
    tags: string
  }

  const {register, handleSubmit, formState: {errors}} = useForm<Inputs>();

  // const onSubmit: SubmitHandler<Inputs> = (data) => {
  //   // console.log(selectedFile)
  //   // console.log(data)
  //   const tagsWithoutExcessSpaces = data.tags.replace(/\s+/g, ' ').trim();
  //   const tagsArray = tagsWithoutExcessSpaces.split(' ');
  //   dispatch(setSearchTags(tagsArray))
  // };

  const onSetTags = (e : InputEvent) => {
    const tags = e?.target?.value;
    if (tags?.length > 0) {
      const tagsWithoutExcessSpaces = e?.target?.value?.replace(/\s+/g, ' ').trim();
      const tagsArray = tagsWithoutExcessSpaces.split(' ');
      dispatch(setSearchTags(tagsArray))
    } else {
      dispatch(setSearchTags([]))
    }
  }

  const feedName = useSelector(selectFeedName);
  
  const onSearch = () => {
    console.log('search')
    switch (feedName) {
      case 'новые работы':
        dispatchThunk(fetchNewArts());
        break;
      case 'популярное':
        dispatchThunk(fetchPopularArts());
        break;
      case 'подписки':
        dispatchThunk(fetchSubscriptionsArts());
        break;
      default:
        dispatchThunk(fetchNewArts());
    }
  }

  return (
    <div className="filters-field">
      <div className="filters-field__container">
        <SearchField  onSetSearchValue={onSetSearchValue}
                      onSetIsPopupOpen={onSetIsPopupOpen}
                      onSelectValue={onSelectValue}
                      foundValues={authors.map(item => item.username)}
                      isPopupOpen={isPopupOpen}
                      placeholder="Введите имя автора"/>

        {/* <form onSubmit={handleSubmit(onSubmit)} className="filters-field__form"> */}
          <input
            className="filters-field__tags-input"
            type="text" 
            placeholder="#тег #другой_тег" 
            // onChangeText={(e) => onSetTags(e)}
            {...register( "tags", {
              onChange: (e) => onSetTags(e),
              pattern: {value: /^((\#[^\s\#]+\_*)+\s*)+$/g, message: "Текст должен соответствовать шаблону: #название_тега"}})}
            aria-invalid={errors.tags ? "true" : "false"} 
          />
          {errors.tags && <p role="alert"  className="alert-msg">{errors.tags.message}</p>}
        {/* </form> */}

        <button className="filters-field__btn" onClick={onSearch}>Найти</button>
        
      </div>
    </div>
  )
}

export default FiltersField;