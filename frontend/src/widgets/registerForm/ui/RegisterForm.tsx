import { useForm, SubmitHandler } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';

import "../../authForm/ui/AuthForm.scss";

type Inputs = {
  username: string
  password: string
  confirm_password: string
}

const RegisterForm = () => {
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const {register, handleSubmit, formState: {errors}, watch} = useForm<Inputs>({
    defaultValues: {
      username: '',
      password: '',
      confirm_password: '',
    },
    mode: 'onChange'
  });
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)

    try {
      console.log("Нажали на кнопку")
      const response = await axios.post('http://localhost:8000/api/v1/users/', data);
      // console.log(response)

      setError('')
      navigate("/authorization");
    } catch (err) {
      console.log(err)
      setError(err?.response?.data?.username)
      console.log(error)
    }
  };

  return (
    <div className="auth-wrapper">
      <h1>Зарегистрироваться:</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        
        <div>
          <label htmlFor="username">Имя пользователя:</label>
          <input
            id="username"
            className="auth-form__name-input"
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

        <div>
          <label htmlFor="confirm_password">Подтвердите пароль:</label>
          <input
            id="confirm_password"
            className="auth-form__password-input"
            type="password" 
            placeholder="Введите пароль" 
            {...register( "confirm_password", {
              required: "Данное поле обязательно для заполнения",
              validate: (val: string) => {
                if (watch('password') != val) {
                  return "Пароли должны совпадать"
                }
              }
            })}
            aria-invalid={errors.password ? "true" : "false"} 
            />
        </div>
        {errors.confirm_password && <p role="alert" className="alert-msg">{errors.confirm_password.message}</p>}
        

        <input type="submit" className="submit-btn" value={"Зарегистрироваться!"}/>
        {/* {isLoading && <p style={{textAlign: "center", margin: "10px auto", fontWeight: "700"}}>Загрузка...</p>} */}
        {error && <p style={{textAlign: "center", margin: "10px auto", fontWeight: "700"}}>{error}</p>}
      </form>
      <NavLink to="/authorization" className="auth_link">Уже зарегистрированы? <span>Авторизируйтесь</span></NavLink>
    </div>
  )
}

export default RegisterForm;