import { useEffect, useId } from 'react'
import styled from 'styled-components'

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgb(0 0 0 / 42%);
`

const Dialog = styled.section`
  width: min(100%, 334px);
  padding: 24px 20px 18px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 16px 40px rgb(0 0 0 / 18%);
  text-align: center;
`

const Title = styled.h2`
  margin: 0;
  font-size: 19px;
  line-height: 1.35;
`

const Description = styled.p`
  margin: 10px 0 20px;
  color: #6f6f6f;
  font-size: 13px;
  line-height: 1.5;
`

const ErrorMessage = styled.p`
  margin: -10px 0 14px;
  color: #c62828;
  font-size: 12px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

const ActionButton = styled.button`
  min-height: 46px;
  border: 0;
  border-radius: 12px;
  color: ${({ $danger }) => ($danger ? '#fff' : '#333')};
  background: ${({ $danger }) => ($danger ? '#ff4b55' : '#f2f2f2')};
  font: inherit;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`

function ConfirmModal({
  cancelLabel = '취소',
  confirmLabel = '계정삭제',
  description,
  error = '',
  isSubmitting = false,
  onCancel,
  onConfirm,
  open,
  title,
}) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSubmitting) onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSubmitting, onCancel, open])

  if (!open) return null

  return (
    <Backdrop
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onCancel()
      }}
    >
      <Dialog aria-labelledby={titleId} aria-modal="true" role="dialog">
        <Title id={titleId}>{title}</Title>
        <Description>{description}</Description>
        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        <Actions>
          <ActionButton disabled={isSubmitting} onClick={onCancel} type="button">
            {cancelLabel}
          </ActionButton>
          <ActionButton
            $danger
            disabled={isSubmitting}
            onClick={onConfirm}
            type="button"
          >
            {isSubmitting ? '삭제 중...' : confirmLabel}
          </ActionButton>
        </Actions>
      </Dialog>
    </Backdrop>
  )
}

export default ConfirmModal
