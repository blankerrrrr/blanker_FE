import styled from 'styled-components'

const Card = styled.button`
  position: relative;
  display: flex;
  width: 100%;
  min-height: 108px;
  align-items: flex-end;
  padding: 16px;
  overflow: hidden;
  border: ${({ $selected }) =>
    $selected ? '3px solid #168bea' : '1px solid #d8d8d8'};
  border-radius: 17px;
  color: ${({ $hasImage }) => ($hasImage ? '#fff' : '#111')};
  background: #f8f8f8;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: 2px;
  }
`

const Image = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Overlay = styled.span`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgb(0 0 0 / 44%), rgb(0 0 0 / 18%));
`

const Copy = styled.span`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 6px;
`

const Title = styled.strong`
  font-size: 18px;
  line-height: 1.2;
`

const Summary = styled.span`
  display: -webkit-box;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
`

function InterestTargetCard({
  imageUrl,
  onClick,
  selected = false,
  summary,
  title,
}) {
  const hasImage = Boolean(imageUrl)

  return (
    <Card
      $hasImage={hasImage}
      $selected={selected}
      aria-label={`${title} 관심사 ${selected ? '선택 취소' : '선택'}`}
      aria-pressed={selected}
      onClick={onClick}
      type="button"
    >
      {hasImage && (
        <>
          <Image alt="" aria-hidden="true" src={imageUrl} />
          <Overlay aria-hidden="true" />
        </>
      )}
      <Copy>
        <Title>{title}</Title>
        {summary && <Summary>{summary}</Summary>}
      </Copy>
    </Card>
  )
}

export default InterestTargetCard
