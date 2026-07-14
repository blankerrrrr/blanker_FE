import styled, { css } from 'styled-components'

const variantStyles = {
  light: css`
    color: #000;
    background: #f8f8f8;
  `,
  dark: css`
    color: #fff;
    background: #333;
    border-color: #555;
  `,
}

const StyledButton = styled.button`
  display: inline-flex;
  width: 100%;
  height: 53px;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border: 1px solid #d8d8d8;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 160ms ease, box-shadow 160ms ease;

  &:hover:not(:disabled) {
    filter: brightness(0.96);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgb(0 0 0 / 18%);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  ${({ $variant }) => variantStyles[$variant] ?? variantStyles.light}
`

function Button({ variant = 'light', className = '', type = 'button', ...props }) {
  return (
    <StyledButton
      $variant={variant}
      className={className}
      type={type}
      {...props}
    />
  )
}

export default Button
