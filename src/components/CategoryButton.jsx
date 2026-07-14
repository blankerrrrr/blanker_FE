import styled from 'styled-components'

const StyledCategoryButton = styled.button`
  position: relative;
  display: flex;
  width: 100%;
  aspect-ratio: 1.1 / 1;
  align-items: center;
  justify-content: center;
  padding: 0;
  overflow: hidden;
  border: ${({ $selected }) => ($selected ? '2px solid #000' : '1px solid #d8d8d8')};
  border-radius: 0;
  color: ${({ $hasImage }) => ($hasImage ? '#fff' : '#000')};
  background: #f8f8f8;
  cursor: pointer;

  &::after {
    position: absolute;
    inset: 0;
    background: rgb(0 0 0 / 30%);
    content: '';
    opacity: ${({ $hasImage }) => ($hasImage ? 1 : 0)};
    pointer-events: none;
  }

  &:focus-visible {
    outline: 2px solid #000;
    outline-offset: 2px;
  }
`

const CategoryImageElement = styled.span`
  position: absolute;
  inset: 0;

  & > * {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const Label = styled.span`
  position: relative;
  z-index: 1;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
`

function CategoryButton({
  children,
  className = '',
  label,
  selected = false,
  type = 'button',
  ...props
}) {
  return (
    <StyledCategoryButton
      $hasImage={Boolean(children)}
      $selected={selected}
      aria-pressed={selected}
      className={className}
      type={type}
      {...props}
    >
      {children && (
        <CategoryImageElement aria-hidden="true">
          {children}
        </CategoryImageElement>
      )}
      <Label>{label}</Label>
    </StyledCategoryButton>
  )
}

export default CategoryButton
