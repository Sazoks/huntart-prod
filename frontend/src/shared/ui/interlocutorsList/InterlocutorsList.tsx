import { FC, useState } from "react";
import InterlocutorItem from "../interlocutorItem/InterlocutorItem";
import { IUser } from "../../../entities/User";
import "./InterlocutorLists.scss";
import clsx from "clsx";

interface InterlocutorsListProps {
  interlocutors: IUser[] | null;
  onSelect(id?: string | null): void;
}

const InterlocutorsList:FC<InterlocutorsListProps> = ({interlocutors, onSelect}) => {

  const renderItems = () => {
    return interlocutors?.map(user => (
      <li key={user?.id} className={clsx("interlocutor", user?.active && "interlocutor--active")} onClick={() => {onSelect(user?.id)}}>
        <InterlocutorItem id={user?.id} 
                          username={user?.username} 
                          avatar={user?.avatar}
                          has_unread_messages={user?.has_unread_messages}/>
      </li>
    ))
  }

  return (
    <ul className="interlocutors-list">
      {
        interlocutors?.length > 0 ? renderItems() : 
        <div style={{margin: "50px auto", textAlign: "center"}}>Список пуст</div>
      }
    </ul>
  )
}

export default InterlocutorsList;