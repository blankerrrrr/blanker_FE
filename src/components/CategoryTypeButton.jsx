import styled from "styled-components";

const StyledCategoryTypeButton = styled.button`
  display: inline-flex;
  min-height: 34px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: none;
  border-radius: 999px;
  color: #000;
  background: ${({ $selected }) => ($selected ? "#d8d8d8" : "#ffffff")};
  font-size: 13px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #000;
    outline-offset: 2px;
  }
`;

function CategoryTypeButton({
  children,
  className = "",
  selected = false,
  type = "button",
  ...props
}) {
  return (
    <StyledCategoryTypeButton
      $selected={selected}
      aria-pressed={selected}
      className={className}
      type={type}
      {...props}
    >
      {children}
    </StyledCategoryTypeButton>
  );
}

export default CategoryTypeButton;
