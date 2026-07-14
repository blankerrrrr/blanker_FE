import styled from 'styled-components'
import Icon from './Icon.jsx'

const CardSurface = styled.article`
  position: relative;
  width: 100%;
  min-height: 126px;
  overflow: hidden;
  border-radius: 22px;
  background: #f7f7f7;
`

const DefaultLink = styled.a`
  display: grid;
  min-height: 126px;
  grid-template-columns: minmax(0, 1fr) 30px;
  gap: 12px;
  align-items: center;
  padding: 16px 14px 16px 18px;
  color: #111;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: -3px;
    border-radius: 22px;
  }
`

const RevealButton = styled.button`
  display: block;
  width: 100%;
  min-height: 126px;
  padding: 18px 58px 18px 18px;
  border: 0;
  color: #111;
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: -3px;
    border-radius: 22px;
  }
`

const SourceLink = styled.a`
  position: absolute;
  top: 50%;
  right: 14px;
  z-index: 4;
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 50%;
  color: #050505;
  text-decoration: none;
  transform: translateY(-50%);

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: 2px;
  }
`

const Copy = styled.div`
  position: relative;
  z-index: 1;
  min-width: 0;
  filter: ${({ $spoiler, $revealed }) =>
    $spoiler && !$revealed ? 'blur(5px)' : 'none'};
  opacity: ${({ $spoiler, $revealed }) =>
    $spoiler && !$revealed ? 0.72 : 1};
  transition: filter 160ms ease, opacity 160ms ease;
`

const Url = styled.p`
  overflow: hidden;
  margin: 0 0 ${({ $hasSummary }) => ($hasSummary ? '14px' : '0')};
  color: #168bf2;
  font-size: 13px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Summary = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  word-break: keep-all;
`

const DefaultBlur = styled.span`
  position: absolute;
  inset: 0 42px 0 38%;
  z-index: 2;
  background: linear-gradient(
    90deg,
    rgb(247 247 247 / 12%),
    rgb(247 247 247 / 88%) 82%
  );
  backdrop-filter: blur(5px);
  pointer-events: none;
  -webkit-backdrop-filter: blur(5px);
`

const Arrow = styled.span`
  position: relative;
  z-index: 3;
  display: grid;
  place-items: center;
`

const SpoilerVeil = styled.span`
  position: absolute;
  inset: 0;
  z-index: 2;
  background: rgb(247 247 247 / 34%);
  pointer-events: none;
`

const SpoilerNotice = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  padding: 9px 14px;
  border-radius: 13px;
  color: #fff;
  background: #050505;
  font-size: 13px;
  line-height: 1.2;
  white-space: nowrap;
  pointer-events: none;
  transform: translate(-50%, -50%);
`

function CardCopy({ revealed, spoiler, summary, url }) {
  return (
    <Copy $revealed={revealed} $spoiler={spoiler}>
      <Url $hasSummary={Boolean(summary)}>{url}</Url>
      {summary && <Summary>{summary}</Summary>}
    </Copy>
  )
}

function LinkCard({
  ariaLabel,
  onReveal,
  revealed = false,
  sourceLabel,
  summary,
  url,
  variant = 'default',
}) {
  const spoiler = variant === 'spoiler'

  if (spoiler) {
    return (
      <CardSurface>
        <RevealButton
          aria-label={ariaLabel}
          aria-pressed={revealed}
          onClick={onReveal}
          type="button"
        >
          <CardCopy revealed={revealed} spoiler summary={summary} url={url} />
          {!revealed && (
            <>
              <SpoilerVeil aria-hidden="true" />
              <SpoilerNotice>
                다음 내용에는 스포일러가 포함되어 있습니다.
              </SpoilerNotice>
            </>
          )}
        </RevealButton>
        <SourceLink
          aria-label={sourceLabel}
          href={url}
          rel="noreferrer"
          target="_blank"
        >
          <Icon name="arrow-right" size={28} />
        </SourceLink>
      </CardSurface>
    )
  }

  return (
    <CardSurface>
      <DefaultLink
        aria-label={ariaLabel}
        href={url}
        rel="noreferrer"
        target="_blank"
      >
        <CardCopy summary={summary} url={url} />
        <DefaultBlur aria-hidden="true" />
        <Arrow>
          <Icon name="arrow-right" size={28} />
        </Arrow>
      </DefaultLink>
    </CardSurface>
  )
}

export default LinkCard
