import {FC} from "react";

interface MessageProps {
  msgTitle?: string;
  msgText?: string;
}

const Message:FC<MessageProps> = ({msgTitle, msgText}) => {

  return (
    <div style={{margin: "50px auto"}}>
      <div style={{fontSize: "16px", fontWeight: "600"}}>
        {msgTitle}
      </div>
      <div style={{fontSize: "16px", fontWeight: "400"}}>
        {msgText}
      </div>
    </div>
  )
}

export default Message;