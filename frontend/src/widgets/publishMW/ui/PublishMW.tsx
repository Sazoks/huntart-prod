import { FC, useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import ModalWindow from "../../../shared/ui/modalWindow/ModalWindow";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

import "./PublishMW.scss";

import { fetchNewArt, resetArtStatus, selectArtStatus, selectStatus } from "../../../app/model/slices/authSlice";
import { renderMessage } from "../../../shared/ui/submitMessage/submitMessage";
import { selectUserId } from "../../../app/model/slices/userSlice";
import { fetchUserArts } from "../../../app/model/slices/artsSlice";

interface PublishMWProps {
  onSetModalClose?(): void;
}

type Inputs = {
  // forSale: string
  tags: string
  pickFileInput: File
  description: string
}

const PublishMW:FC<PublishMWProps> = ({onSetModalClose}) => {

  const status = useSelector(selectArtStatus);
  const userId = useSelector(selectUserId)
  const dispatch = useDispatch();
  const dispatchThunk = useDispatch<ThunkDispatch>();

  const [selectedFile, setSelectedFile] = useState(null);
  const filePicker = useRef<HTMLInputElement | null>(null);
  
  const {register, handleSubmit, reset, formState: {errors}} = useForm<Inputs>();

  const handleChangeFile = (e) => {
    setSelectedFile(e.target.files[0]);
  }

  const handlePickFile = () => {
    filePicker?.current?.click();
    dispatch(resetArtStatus());
  }

  const { onChange, name, ref } = register('pickFileInput', {required: {
      value: true,
      message: "Загрузите изображение",
    }});

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // console.log(selectedFile)
    console.log(data)
    const tagsWithoutExcessSpaces = data.tags.replace(/\s+/g, ' ').trim();
    const tagsArray = tagsWithoutExcessSpaces.split(' ');
    console.log(tagsArray);
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('description', data.description);
    formData.append('for_sale', false);
    formData.append('tags', tagsArray);
    dispatchThunk(fetchNewArt(formData)).then(res => dispatchThunk(fetchUserArts(userId)));
    reset();
    setSelectedFile(null)
  };

  return (
    <ModalWindow onSetModalClose={onSetModalClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="publish-form">
        <div className="publish-form__file-picker">
          <button onClick={handlePickFile} className="pick-file-btn" type="button">Выберите файл</button>
          <input
            type="file"
            accept="image/*, .png, .jpg, .gif, .web"
            className="hidden"
            onChange={e => {
              handleChangeFile(e)
              onChange(e)
            }}
            name={name}
            ref={(e) => {
              ref(e)
              filePicker.current = e
            }}
            aria-invalid={errors.pickFileInput ? "true" : "false"} 
            />
          {selectedFile && (<p>{selectedFile?.name}</p>)}
        </div>
        {errors.pickFileInput?.type === "required" && <p role="alert" className="alert-msg">{errors.pickFileInput.message}</p>}

        {/* <div className="publish-form__sale-check">
          <p>Для продажи?</p>
          <div>
            <input id="Yes" {...register("forSale", { required: "Заполните обязательное поле" })} type="radio" value="Yes" />
            <label htmlFor="Yes">да</label>
          </div>
          <div>
            <input id="No" {...register("forSale", { required: "Заполните обязательное поле" })} type="radio" value="No" />
            <label htmlFor="No">нет</label>
          </div> 
        </div>
        {errors.forSale?.type === "required" && <p role="alert"  className="alert-msg">{errors.forSale.message}</p>} */}

        <input
          className="publish-form__tags-input"
          type="text" 
          placeholder="#тег #другой_тег" 
          onClick={() => dispatch(resetArtStatus())}
          {...register( "tags", {pattern: {value: /^((\#[^\s\#]+\_*)+\s*)+$/g, message: "Текст должен соответствовать шаблону: #название_тега"}})}
          // {...register( "tags", {pattern: {value: /^((\#\w+\_*)+\s*)+$/g, message: "Текст должен соответствовать шаблону: #название_тега"}})}
          aria-invalid={errors.tags ? "true" : "false"} 
          />
        {errors.tags && <p role="alert"  className="alert-msg">{errors.tags.message}</p>}
        
        <textarea
          className="publish-form__description"
          placeholder="Описание арта..."
          onClick={() => dispatch(resetArtStatus())}
          {...register("description")}
          // value={descr}
          // onChange={e => handleChange(e)}
          />
        
        <input type="submit" className="submit-btn"/>
        {renderMessage(status)}
        {/* {isSubmitSuccessful && <p style={{textAlign: "center", margin: "10px auto", fontWeight: "700"}}>Данные успешно отправлены</p>} */}
      </form>
    </ModalWindow>
  )
}

export default PublishMW;