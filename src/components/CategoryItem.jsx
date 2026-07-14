import styled from 'styled-components'

const StyledCategoryItem = styled.button`
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: 0;
  border-radius: 30px;
  color: #000;
  background: ${({ $selected }) => ($selected ? '#d8d8d8' : '#fff')};
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #333;
    outline-offset: 2px;
  }
`

function CategoryItem({ selected = false, className = '', type = 'button', ...props }) {
  return (
    <StyledCategoryItem
      $selected={selected}
      aria-pressed={selected}
      className={className}
      type={type}
      {...props}
    />
  )
}

export default CategoryItem
