import { FC } from "react";

import "./Avatar.scss";

interface AvatarProps {
  img?: string; 
}

const Avatar:FC<AvatarProps> = ({img}) => {

  return (
    <div className="avatar__wrapper">
      {
        img ? <img src={img} alt="users avatar" className="avatar__img" />
        : null
      }
    </div>
  )
}

export default Avatar;