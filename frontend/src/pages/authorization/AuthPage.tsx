import Header from "../../widgets/header/ui/Header";
import AuthForm from "../../widgets/authForm/ui/AuthForm";
import "./AuthPage.scss";

const AuthPage = () => {

  return (
    <>
      <header className="header">
        <Header menuLinks={[{url:"/", name:"Главная"}, {url:"/registration", name:"Регистрация"}]}/>
      </header>
      <main className="main_auth">
        <AuthForm/>
      </main>
    </>
  )
}

export default AuthPage;