import styled from 'styled-components'

const State = styled.div`
  display: grid;
  min-height: ${({ $compact }) => ($compact ? '120px' : '220px')};
  place-content: center;
  justify-items: center;
  gap: 12px;
  padding: 24px;
  color: #777;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
`

const RetryButton = styled.button`
  min-width: 96px;
  height: 40px;
  padding: 0 16px;
  border: 1px solid #d8d8d8;
  border-radius: 12px;
  color: #111;
  background: #f8f8f8;
  font-weight: 600;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: 2px;
  }
`

function RequestState({ compact = false, message, onRetry }) {
  return (
    <State $compact={compact} role={onRetry ? 'alert' : 'status'}>
      <span>{message}</span>
      {onRetry && (
        <RetryButton onClick={onRetry} type="button">
          다시 시도
        </RetryButton>
      )}
    </State>
  )
}

export default RequestState
