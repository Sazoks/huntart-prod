import { FC } from "react";
import "./Chat.scss";

interface ChatProps {
  renderMsgs(): JSX.Element;
  renderInput(): JSX.Element;
  height?: string;
  data?: [];
}

const Chat:FC<ChatProps> = ({renderInput, renderMsgs, height, data}) => {
//style={{height: height}}
  return (
    <div className="chat"> 
      {renderInput()}
      {renderMsgs()}
    </div>
  )
}

export default Chat;