import styled, { css } from 'styled-components'

const variantStyles = {
  light: css`
    color: #000;
    background: #f8f8f8;

    &:disabled {
      color: #aaa;
      background: #e3e3e3;
    }
  `,
  dark: css`
    color: #fff;
    background: #333;
    border-color: #555;

    &:disabled {
      color: #aaa;
      background: #555;
    }
  `,
  auth: css`
    color: #000;
    border-color: #d2d2d2;
    background: #fff;
    box-shadow: 0 4px 18px rgb(0 0 0 / 8%);

    &:focus-visible {
      border-color: #555;
      box-shadow: 0 0 0 2px rgb(0 0 0 / 12%), 0 6px 22px rgb(0 0 0 / 10%);
    }

    &:disabled {
      color: #999;
      background: #eee;
    }
  `,
}

const StyledInput = styled.input`
  display: block;
  width: 100%;
  height: 53px;
  padding: 0 16px;
  border: 1px solid #d8d8d8;
  border-radius: 15px;
  outline: none;
  font-size: 14px;
  color: #000;
  transition: border-color 160ms ease, box-shadow 160ms ease;

  &::placeholder {
    color: currentColor;
    opacity: 1;
  }

  &:focus-visible {
    border-color: #777;
    box-shadow: 0 0 0 2px rgb(0 0 0 / 12%);
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${({ $variant }) => variantStyles[$variant] ?? variantStyles.light}

  ${({ $hasError }) => $hasError && css`
    border-color: #c62828;

    &:focus-visible {
      border-color: #c62828;
    }
  `}
`

function Input({ variant = 'light', className = '', hasError = false, ...props }) {
  return (
    <StyledInput
      $hasError={hasError}
      $variant={variant}
      aria-invalid={hasError || undefined}
      className={className}
      data-variant={variant}
      {...props}
    />
  )
}

export default Input
