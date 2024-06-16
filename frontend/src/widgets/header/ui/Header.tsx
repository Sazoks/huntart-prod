import { FC } from "react";
import { NavLink } from "react-router-dom";

import "./Header.scss";

import { ILink } from "../../../entities/Link";
import Menu from "../../menu/ui/Menu";


interface HeaderProps {
  menuLinks?: ILink[];
}

const Header:FC<HeaderProps> = ({menuLinks}) => {

  return (
    <div className="header__hat">
      <div className="header__container">
        <div className="header__body">
          <NavLink to="/" className="header__logo">HuntArt</NavLink>
          <Menu links={menuLinks}/>
        </div>
      </div>
    </div>
  )
}

export default Header;