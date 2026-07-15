import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { getInterestItem } from '../api/interestsApi.js'
import { useAuth } from '../auth/useAuth.js'
import BackButton from '../components/BackButton.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import RequestState from '../components/RequestState.jsx'

const Page = styled.main`
  position: relative;
  width: min(100%, 402px);
  min-height: 100vh;
  min-height: 100svh;
  margin: 0 auto;
  padding-bottom: 96px;
  background: #fff;
`

const Header = styled.header`
  padding: 22px 20px 10px;
`

const MetaRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
`

const Meta = styled.div`
  min-width: 0;
`

const ItemTitle = styled.p`
  margin: 0 0 4px;
  overflow: hidden;
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Byline = styled.p`
  margin: 0;
  color: #696969;
  font-size: 11px;
`

const IconButton = styled.button`
  display: inline-flex;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: #111;
  background: transparent;
  cursor: pointer;
`

const HeroImage = styled.img`
  display: block;
  width: calc(100% - 40px);
  height: auto;
  aspect-ratio: 4 / 5;
  margin: 0 20px;
  object-fit: cover;
`

const Content = styled.article`
  padding: 12px 20px 0;
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px 10px;
  margin-bottom: 14px;
  color: #555;
  font-size: 10px;
`

const VisuallyHiddenTitle = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`

const Section = styled.section`
  margin-top: 18px;

  &:first-of-type {
    margin-top: 0;
  }
`

const SectionTitle = styled.h2`
  margin: 0 0 9px;
  font-size: 14px;
`

const Paragraph = styled.p`
  margin: 0 0 10px;
  color: #252525;
  font-size: 11px;
  line-height: 1.55;
`

const MemoForm = styled.form`
  display: grid;
  gap: 8px;
`

const MemoInput = styled.textarea`
  width: 100%;
  min-height: 112px;
  padding: 0;
  resize: vertical;
  border: 0;
  border-radius: 0;
  outline: none;
  color: #252525;
  background: transparent;
  font: inherit;
  font-size: 12px;
  line-height: 1.55;

  &:focus-visible {
    outline: 1px solid #168bf2;
    outline-offset: 3px;
  }

  &::placeholder {
    color: #888;
  }
`

const MemoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`

const MemoStatus = styled.span`
  color: #777;
  font-size: 11px;
`

const MemoSaveButton = styled(Button)`
  width: auto;
  height: 38px;
  padding: 0 18px;
  border-radius: 10px;
`

const RelatedList = styled.div`
  display: grid;
  gap: 10px;
`

const RelatedLink = styled.a`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 12px;
  color: inherit;
  background: #f4f4f4;
  text-decoration: none;
`

const LinkUrl = styled.span`
  display: block;
  overflow: hidden;
  margin-bottom: 5px;
  color: #3d8fd1;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const LinkTitle = styled.strong`
  display: block;
  font-size: 11px;
`

const EditButton = styled(IconButton)`
  position: fixed;
  right: max(22px, calc((100vw - 402px) / 2 + 22px));
  bottom: 24px;
  width: 54px;
  height: 54px;
  color: #fff;
  background: #050505;
  box-shadow: 0 6px 18px rgb(0 0 0 / 24%);
`

const EmptyState = styled(Page)`
  display: grid;
  place-items: center;
  padding: 24px;
  text-align: center;
`

function PostDetailPage() {
  const { postId } = useParams()
  const { accessToken } = useAuth()
  const [item, setItem] = useState(null)
  const [pageState, setPageState] = useState('loading')
  const [reloadKey, setReloadKey] = useState(0)
  const [memo, setMemo] = useState('')
  const [memoStatus, setMemoStatus] = useState('')
  const memoInputRef = useRef(null)

  useEffect(() => {
    const storageKey = `blanker:content-memo:${postId}`

    try {
      setMemo(window.localStorage.getItem(storageKey) ?? '')
    } catch {
      setMemo('')
    }
    setMemoStatus('')
  }, [postId])

  useEffect(() => {
    let isActive = true

    async function loadItem() {
      if (!accessToken) {
        if (isActive) setPageState('auth')
        return
      }

      setPageState('loading')

      try {
        const data = await getInterestItem(accessToken, postId)
        if (isActive) {
          setItem(data)
          setPageState('success')
        }
      } catch (error) {
        if (isActive) {
          setPageState(error?.status === 404 ? 'not-found' : 'error')
        }
      }
    }

    loadItem()
    return () => {
      isActive = false
    }
  }, [accessToken, postId, reloadKey])

  if (pageState === 'loading') {
    return <EmptyState><RequestState message="관심 정보를 불러오는 중입니다." /></EmptyState>
  }

  if (pageState === 'auth') {
    return <EmptyState><RequestState message="로그인이 필요합니다." /></EmptyState>
  }

  if (pageState === 'not-found') {
    return (
      <EmptyState>
        <RequestState
          message="관심 정보를 찾을 수 없습니다."
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      </EmptyState>
    )
  }

  if (pageState === 'error' || !item) {
    return (
      <EmptyState>
        <RequestState
          message="관심 정보를 불러오지 못했습니다."
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      </EmptyState>
    )
  }

  const handleShare = async () => {
    const shareData = { title: item.title, url: window.location.href }

    if (navigator.share) {
      await navigator.share(shareData)
      return
    }

    await navigator.clipboard?.writeText(shareData.url)
  }

  const handleMemoSave = (event) => {
    event.preventDefault()

    try {
      window.localStorage.setItem(`blanker:content-memo:${postId}`, memo)
      setMemoStatus('저장되었습니다.')
    } catch {
      setMemoStatus('메모를 저장하지 못했습니다.')
    }
  }

  return (
    <Page>
      <Header>
        <BackButton />
        <MetaRow>
          <Meta>
            <ItemTitle>{item.title}</ItemTitle>
            <Byline>{item.discoveredAt}</Byline>
          </Meta>
          <IconButton aria-label="공유하기" onClick={handleShare} type="button">
            <Icon name="share" size={19} />
          </IconButton>
        </MetaRow>
      </Header>
      {item.imageUrl && (
        <HeroImage
          alt={`${item.title} 대표 이미지`}
          data-layout="post-hero"
          src={item.imageUrl}
        />
      )}
      <Content>
        <Tags>
          {(item.relatedTopics ?? []).map((topic) => (
            <span key={topic}># {topic}</span>
          ))}
        </Tags>
        <VisuallyHiddenTitle data-visual="sr-only-title">
          {item.title}
        </VisuallyHiddenTitle>
        <Section>
          <SectionTitle>요약</SectionTitle>
          <Paragraph>{item.summary}</Paragraph>
        </Section>
        <Section>
          <SectionTitle>내 메모</SectionTitle>
          <MemoForm onSubmit={handleMemoSave}>
            <MemoInput
              aria-label={`${item.title} 메모`}
              onChange={(event) => {
                setMemo(event.target.value)
                setMemoStatus('')
              }}
              placeholder="이 콘텐츠에 대한 메모를 입력해주세요."
              ref={memoInputRef}
              value={memo}
            />
            <MemoActions>
              <MemoStatus aria-live="polite">{memoStatus}</MemoStatus>
              <MemoSaveButton type="submit" variant="light">
                저장
              </MemoSaveButton>
            </MemoActions>
          </MemoForm>
        </Section>
        {item.sourceUrl && (
          <Section>
            <SectionTitle>원본 링크</SectionTitle>
            <RelatedList>
              <RelatedLink
                aria-label={`${item.title} 원문 열기`}
                data-layout="related-card"
                href={item.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                <span>
                  <LinkUrl>{item.sourceUrl}</LinkUrl>
                  <LinkTitle>원문 보기</LinkTitle>
                </span>
                <Icon name="arrow-right" size={18} />
              </RelatedLink>
            </RelatedList>
          </Section>
        )}
      </Content>
      <EditButton
        aria-label="메모 작성"
        onClick={() => {
          memoInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          memoInputRef.current?.focus({ preventScroll: true })
        }}
        type="button"
      >
        <Icon name="edit" size={22} />
      </EditButton>
    </Page>
  )
}

export default PostDetailPage
