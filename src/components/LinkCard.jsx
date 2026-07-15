import styled from 'styled-components'
import Icon from './Icon.jsx'

const CardSurface = styled.article`
  position: relative;
  width: 100%;
  min-height: 100px;
  overflow: hidden;
  border-radius: 16px;
  background: #f7f7f7;
`

const SpoilerSurface = styled(CardSurface)`
  min-height: 96px;
  border-radius: 16px;
`

const DefaultLink = styled.a`
  display: grid;
  min-height: 100px;
  grid-template-columns: minmax(0, 1fr) 26px;
  gap: 8px;
  align-items: stretch;
  padding: 12px 10px;
  color: #111;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: -3px;
    border-radius: 16px;
  }
`

const RevealButton = styled.button`
  display: block;
  width: 100%;
  min-height: 96px;
  padding: 14px 54px 14px 14px;
  border: 0;
  color: #111;
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: -3px;
    border-radius: 16px;
  }
`

const Copy = styled.div`
  position: relative;
  z-index: 1;
  min-width: 0;
  filter: ${({ $spoiler, $revealed }) =>
    $spoiler && !$revealed ? 'blur(3px)' : 'none'};
  opacity: ${({ $spoiler, $revealed }) =>
    $spoiler && !$revealed ? 0.94 : 1};
  transition: filter 160ms ease, opacity 160ms ease;
`

const Url = styled.p`
  overflow: hidden;
  margin: 0 0 ${({ $hasSummary, $spoiler }) =>
    $hasSummary ? ($spoiler ? '14px' : '8px') : '0'};
  color: #168bf2;
  font-size: ${({ $spoiler }) => ($spoiler ? '13px' : '11px')};
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Summary = styled.p`
  margin: 0;
  font-size: ${({ $spoiler }) => ($spoiler ? '13px' : '11px')};
  line-height: ${({ $spoiler }) => ($spoiler ? 1.55 : 1.35)};
  word-break: keep-all;
`

const DefaultBlur = styled.span`
  position: absolute;
  inset: 0 34px 0 62%;
  z-index: 2;
  background: linear-gradient(
    90deg,
    rgb(247 247 247 / 12%),
    rgb(247 247 247 / 88%) 82%
  );
  backdrop-filter: blur(4px);
  pointer-events: none;
  -webkit-backdrop-filter: blur(4px);
`

const Arrow = styled.span`
  position: relative;
  z-index: 3;
  display: grid;
  align-self: center;
  place-items: center;
`

const SpoilerNotice = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  padding: 7px 12px;
  border-radius: 10px;
  color: #fff;
  background: #050505;
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
  pointer-events: none;
  transform: translate(-50%, -50%);
`

function CardCopy({ revealed, spoiler, summary, url }) {
  return (
    <Copy $revealed={revealed} $spoiler={spoiler}>
      <Url $hasSummary={Boolean(summary)} $spoiler={spoiler}>{url}</Url>
      {summary && <Summary $spoiler={spoiler}>{summary}</Summary>}
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

  if (spoiler && revealed) {
    return (
      <CardSurface>
        <DefaultLink
          aria-label={sourceLabel ?? ariaLabel}
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

  if (spoiler) {
    return (
      <SpoilerSurface>
        <RevealButton
          aria-label={ariaLabel}
          aria-pressed={revealed}
          onClick={onReveal}
          type="button"
        >
          <CardCopy revealed={revealed} spoiler summary={summary} url={url} />
          {!revealed && (
            <SpoilerNotice>
              다음 내용에는 스포일러가 포함되어 있습니다.
            </SpoilerNotice>
          )}
        </RevealButton>
      </SpoilerSurface>
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
          <Icon name="arrow-right" size={24} />
        </Arrow>
      </DefaultLink>
    </CardSurface>
  )
}

export default LinkCard
