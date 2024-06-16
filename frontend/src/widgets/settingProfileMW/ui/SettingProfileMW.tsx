import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

import "./SettingProfileMW.scss";

import ModalWindow from "../../../shared/ui/modalWindow/ModalWindow";
import FileForm from "../../../shared/ui/fileForm/FileForm";
import { fetchProfile, resetProfileStatus, selectMyDescription, selectProfileStatus } from "../../../app/model/slices/authSlice";
import { renderMessage } from "../../../shared/ui/submitMessage/submitMessage";
import { fetchUser, selectUserId } from "../../../app/model/slices/userSlice";
// import { useNavigate } from "react-router-dom";

interface SettingProfileMWProps {
  onSetModalClose?(): void;
}

type Inputs = {
  description: string
}

const SettingProfileMW:FC<SettingProfileMWProps> = ({onSetModalClose}) => {

  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector(selectProfileStatus);
  const userId = useSelector(selectUserId)

  //Files
  const dispatchThunk = useDispatch<ThunkDispatch>();

  const onFetchAvatar = (file : File | null) => {
    const formData = new FormData();
    formData.append('avatar', file);
    dispatchThunk(fetchProfile(formData)).then(res => dispatchThunk(fetchUser(userId)))
    
  }

  const onFetchWallpaper = (file : File | null) => {
    const formData = new FormData();
    formData.append('wallpaper', file);
    dispatchThunk(fetchProfile(formData)).then(res => dispatchThunk(fetchUser(userId)))
  }
  //End files

  //Description form
  const description = useSelector(selectMyDescription);
  const [descr, setDescr] = useState(description ?? "");
  const {register, handleSubmit, reset, formState: {errors}} = useForm<Inputs>();

  const handleChange = (e) => {
    setDescr(e.target.value)
    // console.log(descr)
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
    dispatchThunk(fetchProfile(data)).then(res => dispatchThunk(fetchUser(userId)));
    reset();
  };
  //End description form

  return (
    <ModalWindow onSetModalClose={onSetModalClose}>
      <div className="setting-mw__container">
        {renderMessage(status)}
        <FileForm onSubmitFile={onFetchAvatar} header="Изменить аватар:" btnHeader="Установить новый аватар"/>
        <FileForm onSubmitFile={onFetchWallpaper} header="Изменить обои:" btnHeader="Установить новые обои"/>
        <form onSubmit={handleSubmit(onSubmit)} className="publish-form" id="settingForm">
          <div className="file-form__header">Изменить описание профиля:</div>
          <textarea
            className="publish-form__description"
            placeholder="Описание профиля..." 
            onClick={() => dispatch(resetProfileStatus())}
            {...register("description")}
            value={descr}
            onChange={e => handleChange(e)}
            />
                
          <input type="submit" className="file-form__submit-btn" value="Установить новое описание"/>
        </form> 
      </div>
      {/* {renderMessage(status)} */}
      {/* <FileForm onSubmitFile={onFetchAvatar} header="Изменить аватар:" btnHeader="Установить новый аватар"/>
      <FileForm onSubmitFile={onFetchWallpaper} header="Изменить обои:" btnHeader="Установить новые обои"/>
      <form onSubmit={handleSubmit(onSubmit)} className="publish-form" id="settingForm">
        <div className="file-form__header">Изменить описание профиля:</div>
        <textarea
          className="publish-form__description"
          placeholder="Описание профиля..." 
          onClick={() => dispatch(resetStatus())}
          {...register("description")}
          />
               
        <input type="submit" className="file-form__submit-btn" value="Установить новое описание"/>
      </form>  */}
    </ModalWindow>
  )
}

export default SettingProfileMW;