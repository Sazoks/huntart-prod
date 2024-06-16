
import "./Wallpaper.scss";
import { useSelector } from "react-redux";
import { selectWallpaper } from "../../../app/model/slices/userSlice";

const Wallpaper = () => {
  const wallpaper = useSelector(selectWallpaper);

  return (
    <div className="wallpaper__wrapper">
      {wallpaper ? 
        <img className="wallpaper__img" src={wallpaper} />
      : null
      }
    </div>
  )
}

export default Wallpaper;