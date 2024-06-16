import "./submitMessage.scss";

export const renderMessage = (status : string) => {
  switch (status) {
    case 'loading':
      return <p className="submit-msg">Загрузка...</p>
    case 'loaded':
      return (
        <div  className="submit-msg">
          <div>Данные успешно отправлены!</div>
          {/* <div>Обновите страницу, чтобы увидеть изменения с:</div> */}
        </div>
      )
    case 'error':
      return <p className="submit-msg">Не удалось обновить данные :c</p>
    default:
      return null
  }
}