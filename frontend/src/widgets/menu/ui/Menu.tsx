import {FC, useEffect, useState, useRef} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import clsx from 'clsx';
import { useDispatch } from "react-redux";

import "./Menu.scss";

import { ILink } from "../../../entities/Link";
import { logout } from "../../../app/model/slices/authSlice";
// import { logout } from "../../../shared/api/authService";


interface MenuProps {
  links?: ILink[];
}

const Menu:FC<MenuProps> = (props) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {links} = props;

  const [isOpen, setIsOpen] = useState(false);
  const burgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
   return () => clearAllBodyScrollLocks();
  }, []);

  useEffect(() => {
    if (burgerRef) {
      if (isOpen) {
        disableBodyScroll(burgerRef);
      } else {
        enableBodyScroll(burgerRef);
      }
    }
   }, [isOpen]);

  const onToggleMenu = () => {
    setIsOpen(isActive => !isActive);
  }

  const renderList = () => {
    if (links?.length && links?.length > 0) {
      return (
        links?.map((link, i) => {
          if (link.name === 'Выход') {
            return <li key={i} onClick={() => {dispatch(logout()); navigate(0)}}>
                    <NavLink to={link.url} className="header__link">{link.name}</NavLink>
                   </li>
          } else {
            return <li key={i}>
                    <NavLink to={link.url} className="header__link">{link.name}</NavLink>
                   </li>
          }
        }
      ))
    } else {
      return (
        <div>Что-то пошло не так :c</div>
      )
    }
  }

  return (
    <>
      <div className={clsx('header__burger', isOpen && 'active')}
           onClick={() => onToggleMenu()}
           ref={burgerRef}>
        <span></span>
      </div>
      <nav className={clsx('header__menu', isOpen && 'active')}>
        <ul className="header__list">
          {renderList()}
        </ul>
      </nav>
    </>
  )
}

export default Menu;