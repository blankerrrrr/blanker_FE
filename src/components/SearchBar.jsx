import styled from "styled-components";
import Icon from "./Icon.jsx";

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  padding: 16px 18px;
  border: 1px solid #d8d8d8;
  border-radius: 15px;
  background: #f8f8f8;
`;
const Input = styled.input`
  width: 100%;
  min-width: 0;
  flex: 1 1 auto;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 14px;

  &::placeholder {
    color: #888;
  }
`;

const Button = styled.button`
  display: grid;
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  place-items: center;
  padding: 0;
  border: 0;
  color: #111;
  background: transparent;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: -4px;
  }
`;

function SearchBar({
  ariaLabel = "검색어",
  buttonLabel = "검색",
  className = "",
  onChange,
  onSubmit,
  placeholder = "검색어를 입력해주세요.",
  value,
}) {
  return (
    <Form className={className} onSubmit={onSubmit} role="search">
      <Input
        aria-label={ariaLabel}
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      <Button aria-label={buttonLabel} type="submit">
        <Icon name="search" size={22} />
      </Button>
    </Form>
  );
}

export default SearchBar;
