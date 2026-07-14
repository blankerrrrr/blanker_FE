import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Icon from './Icon.jsx'

const StyledBackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 0;
  border: 0;
  color: #000;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #333;
    outline-offset: 4px;
    border-radius: 4px;
  }
`

function BackButton({ children = '뒤로가기', className = '', onClick, ...props }) {
  const navigate = useNavigate()
  const handleClick = (event) => {
    if (onClick) {
      onClick(event)
      return
    }

    navigate(-1)
  }

  return (
    <StyledBackButton
      className={className}
      onClick={handleClick}
      type="button"
      {...props}
    >
      <Icon name="chevron-left" size={16} />
      <span>{children}</span>
    </StyledBackButton>
  )
}

export default BackButton
