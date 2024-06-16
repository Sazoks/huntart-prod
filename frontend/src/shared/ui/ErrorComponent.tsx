import { useRouteError } from "react-router-dom";

export default function ErrorComponent() {
  const error = useRouteError();
  console.error(error);

  return (
    <div style={{margin: "50px auto"}}>
      <h1>Упс!</h1>
      <p>Простите, произошла непредвиденная ошибка</p>
      <p>
        <i>{error?.statusText || error?.message}</i>
      </p>
    </div>
  )
}