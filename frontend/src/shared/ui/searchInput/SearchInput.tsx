import { FC, useState, ChangeEvent, useEffect } from "react";
import './SearchInput.scss';
import { useSelector } from "react-redux";
import { selectSearchUsername } from "../../../app/model/slices/artsSlice";

export interface InputSearchProps {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  isPopupOpen?: boolean;
  onSetSearchValue?(value?: string): void;
}

const SearchInput: FC<InputSearchProps> = ({className, placeholder, disabled, onSetSearchValue, isPopupOpen=false}) => {

  // const {className, placeholder, disabled, onSetSearchValue, isPopupOpen} = props;
  const value = useSelector(selectSearchUsername);
  const [searchValue, setSearchValue] = useState<string>(value);

  useEffect(() => {
    // setSearchValue('');
    // onSetSearchValue?.('');
    setSearchValue(value);
    // onSetSearchValue?.('');
  }, [isPopupOpen, value])

  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    onSetSearchValue?.(e.target.value);
  }

  return (
    <>
      <input
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChangeSearchValue}
        value={searchValue}
      />
    </>
  )
}

export default SearchInput;