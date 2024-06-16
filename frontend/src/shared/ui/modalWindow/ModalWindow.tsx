import { FC, MouseEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import "./ModalWindow.scss";

interface ModalWindowProps {
  onSetModalClose?(): void;
  children: JSX.Element
}


const ModalWindow:FC<ModalWindowProps> = (props) => {

  const {onSetModalClose, children} = props;

  useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Escape") onSetModalClose?.();
      }

      document.addEventListener('keydown', onKeyDown);

      return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const onClickingOut = (e : MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      onSetModalClose?.();
    }
  }

  const onClickExit = () => {
    onSetModalClose?.();
  }

  return (
    <div className="modal" onClick={onClickingOut}>
      <div className="modal__dialog">
        <div className="close-wrapper">
         <FontAwesomeIcon icon={faXmark} className="modal__close" tabIndex={-1} onClick={onClickExit}/>
        </div>
        <div className="modal__content">

          {children}

        </div>
      </div>
    </div>
  )
}

export default ModalWindow;