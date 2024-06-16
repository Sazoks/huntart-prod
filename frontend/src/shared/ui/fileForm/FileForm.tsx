import { FC, useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";

import "./FileForm.scss"

import { resetProfileStatus } from "../../../app/model/slices/authSlice";

interface FileFormProps {
  onSubmitFile?(file ?: File | null): void;
  header?: string;
  btnHeader?: string;
}

type Inputs = {
  file: File
}

const FileForm:FC<FileFormProps> = ({onSubmitFile, header, btnHeader}) => {

  const dispatch = useDispatch();

  const {register, handleSubmit, reset, formState: {errors}} = useForm<Inputs>();

  const [selectedFile, setSelectedFile] = useState(null);
  const filePicker = useRef<HTMLInputElement | null>(null);

  const handleChange = (e) => {
    dispatch(resetProfileStatus());
    setSelectedFile(e.target.files[0]);
  }

  const handlePickFile = () => {
    filePicker?.current?.click();
  }

  const { onChange, name, ref } = register('file', {required: {
    value: true,
    message: "Загрузите изображение",
  }}); 

  const onSubmit: SubmitHandler<Inputs> = () => {
    onSubmitFile?.(selectedFile);
    reset();
    setSelectedFile(null);
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="file-form" id="settingForm">
        <div className="file-form__header">{header}</div>
        <div className="file-form__file-picker">
          <button onClick={handlePickFile} className="pick-file-btn" type="button">Выберите файл</button>
          <input
            type="file"
            accept="image/*, .png, .jpg, .gif, .web"
            className="hidden"
            onChange={e => {
              handleChange(e)
              onChange(e)
            }}
            name={name}
            ref={(e) => {
              ref(e)
              filePicker.current = e
            }}
            aria-invalid={errors.file ? "true" : "false"} 
            />
          {selectedFile && (<p>{selectedFile?.name}</p>)}
        </div>
        {errors.file?.type === "required" && <p role="alert" className="alert-msg">{errors.file.message}</p>}

        <input type="submit" className="file-form__submit-btn" value={btnHeader}/>
      </form>
  )
}

export default FileForm;