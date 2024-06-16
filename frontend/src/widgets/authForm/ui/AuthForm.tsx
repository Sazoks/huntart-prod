import { useForm, SubmitHandler } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import axios from 'axios';

import "./AuthForm.scss";
import { fetchAuth, fetchMe } from "../../../app/model/slices/authSlice";
import { useChatWebsocket } from "../../../shared/api/useChatWebsocket";

type Inputs = {
  username: string
  password: string
}

const AuthForm = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const [error, setError] = useState('');

  const { sendJsonMessage } = useChatWebsocket();
  const navigate = useNavigate();

  const {register, handleSubmit, formState: {errors}} = useForm<Inputs>({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/token/', data);
      const { access: token, refresh: refreshToken } = response.data;
      sendJsonMessage({
        "subsystem": "auth",
        "action": "auth",
        "headers": {
             "jwt_access": token,
         },
      })

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      dispatch(fetchMe());

      setError('')
      navigate('/')
    } catch (err) {
      console.log(err)
      setError(err?.response?.data?.detail)
    }
  };

  return (
    <div className="auth-wrapper">
      <h1>Авторизироваться:</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        
        <div>
          <label htmlFor="username">Имя пользователя:</label>
          <input
            id="username"
            className="auth-username-input"
            type="text" 
            placeholder="Введите имя"
            {...register( "username", {required: "Данное поле обязательно для заполнения"})}
            aria-invalid={errors.username ? "true" : "false"} 
            />
        </div>
        {errors.username?.type === "required" && <p role="alert" className="alert-msg">{errors.username.message}</p>}

        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            id="password"
            className="auth-form__password-input"
            type="password" 
            placeholder="Введите пароль" 
            {...register( "password", {required: "Данное поле обязательно для заполнения"})}
            aria-invalid={errors.password ? "true" : "false"} 
            />
        </div>
        {errors.password?.type === "required" && <p role="alert" className="alert-msg">{errors.password.message}</p>}
        

        <input type="submit" className="submit-btn" value={"Войти!"}/>

        {error && <p style={{textAlign: "center", margin: "10px auto", fontWeight: "700"}}>Неверный логин или пароль</p>}

      </form>

      <NavLink to="/registration" className="auth_link">Нет профиля? <span>Зарегистрируйтесь</span></NavLink>
    </div>
  )
}

export default AuthForm;