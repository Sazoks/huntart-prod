import { FC } from "react";

import Avatar from "../avatar/Avatar";
import "./InterlocutorItem.scss";
import { IUser } from "../../../entities/User";
import clsx from "clsx";


const InterlocutorItem:FC<IUser> = ({id, username, avatar, has_unread_messages = false}) => {

  // console.log("has_unread_messages", has_unread_messages)

  return (
    <div className="interlocutor__item">
      <div className="interlocutor__username__wrapper">
        <Avatar img={avatar}/>
        <a className="interlocutor__username" href={`/users/${id}`}>{username}</a>
      </div>
      
      <div className={clsx("msg_indicator", has_unread_messages && "msg_indicator--active")}></div>
    </div>
  )
}

export default InterlocutorItem;