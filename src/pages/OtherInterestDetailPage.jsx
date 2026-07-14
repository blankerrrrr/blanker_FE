import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { createInterestTarget } from '../api/interestsApi.js'
import logo from '../assets/logo.svg'
import { useAuth } from '../auth/useAuth.js'
import Button from '../components/Button.jsx'
import { interestCategoryConfigs } from '../data/interestOnboarding.js'

const Page = styled.main`
  display: flex;
  width: min(100%, 402px);
  min-height: 100vh;
  min-height: 100svh;
  flex-direction: column;
  margin: 0 auto;
  padding: 30px 20px;
  background: #fff;
`

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
`

const SkipButton = styled.button`
  padding: 0;
  border: 0;
  color: #000;
  background: transparent;
  font-size: 14px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #000;
    outline-offset: 3px;
  }
`

const Logo = styled.img`
  display: block;
  width: 176px;
  height: auto;
`

const Description = styled.p`
  margin: 8px 0 10px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
`

const Hero = styled.section`
  position: relative;
  display: flex;
  min-height: 238px;
  align-items: flex-end;
  padding: 16px;
  overflow: hidden;
  border: 1px solid #d8d8d8;
  background: #f8f8f8;
`

const HeroImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 30%);
`

const HeroTitle = styled.h1`
  position: relative;
  z-index: 1;
  margin: 0;
  color: ${({ $hasImage }) => ($hasImage ? '#fff' : '#000')};
  font-size: 22px;
  line-height: 1.2;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`

const SectionLabel = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
`

const SensitivityInput = styled.input`
  width: 100%;
  height: 20px;
  margin: 0;
  appearance: none;
  border-radius: 999px;
  outline: none;
  background: linear-gradient(
    to right,
    #168bea 0 var(--range-progress),
    #f8f8f8 var(--range-progress) 100%
  );
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    height: 20px;
    border-radius: 999px;
    background: transparent;
  }

  &::-webkit-slider-thumb {
    width: 32px;
    height: 32px;
    margin-top: -6px;
    appearance: none;
    border: 1px solid #d8d8d8;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgb(0 0 0 / 12%);
  }

  &::-moz-range-track {
    height: 20px;
    border-radius: 999px;
    background: transparent;
  }

  &::-moz-range-thumb {
    width: 32px;
    height: 32px;
    border: 1px solid #d8d8d8;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgb(0 0 0 / 12%);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgb(22 139 234 / 18%);
  }
`

const TopicForm = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 53px;
  height: 53px;
  overflow: hidden;
  border: 1px solid #d8d8d8;
  border-radius: 27px;
  background: #f8f8f8;
`

const TopicInput = styled.input`
  min-width: 0;
  height: 100%;
  padding: 0 20px;
  border: 0;
  outline: 0;
  color: #000;
  background: transparent;
  font-size: 14px;

  &::placeholder {
    color: #999;
  }
`

const AddButton = styled.button`
  display: grid;
  place-items: center;
  border: 0;
  border-left: 1px solid #d8d8d8;
  color: #d8d8d8;
  background: #f8f8f8;
  font-size: 24px;
  font-weight: 200;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const RequestError = styled.p`
  margin: 0;
  color: #c62828;
  font-size: 12px;
`

const InterestList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 16px;
`

const InterestCard = styled.button`
  position: relative;
  width: 100%;
  min-height: 76px;
  padding: 12px;
  overflow: hidden;
  border: 1px solid #d8d8d8;
  border-radius: 15px;
  color: ${({ $hasImage }) => ($hasImage ? '#fff' : '#000')};
  background: #f8f8f8;
  text-align: left;
  cursor: pointer;
`

const CardImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const CardOverlay = styled(Overlay)`
  background: rgb(0 0 0 / 45%);
`

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`

const RegisteredBadge = styled.span`
  position: absolute;
  z-index: 2;
  top: 10px;
  right: 12px;
  padding: 3px 7px;
  border-radius: 999px;
  background: #168bea;
  color: #fff;
  font-size: 11px;
`

const CardTitle = styled.h2`
  margin: 0 0 4px;
  font-size: 15px;
  line-height: 1.2;
`

const CardDescription = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.35;
`

const NextButton = styled(Button)`
  margin-top: 10px;
`

function OtherInterestDetailPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const config = interestCategoryConfigs.other
  const [sensitivity, setSensitivity] = useState(50)
  const [topic, setTopic] = useState('')
  const [topics, setTopics] = useState(config.recommendations)
  const [isRequesting, setIsRequesting] = useState(false)
  const [requestError, setRequestError] = useState('')

  const handleRequestTopicInfo = async (event) => {
    event.preventDefault()
    const title = topic.trim()
    if (!title || isRequesting) return

    setIsRequesting(true)
    setRequestError('')

    try {
      const result = await createInterestTarget(accessToken, title)
      const createdTopic = {
        id: result.interestTargetId,
        title: result.name,
        description:
          result.keywords?.join(' · ') || '개인 관심사로 등록되었습니다.',
        imageSrc: null,
        registered: true,
      }
      setTopics((current) => [
        createdTopic,
        ...current.filter((item) => item.id !== createdTopic.id),
      ])
      setTopic('')
    } catch (error) {
      setRequestError(error.message)
    } finally {
      setIsRequesting(false)
    }
  }

  const moveToHome = () => navigate('/home')

  return (
    <Page>
      <TopBar>
        <SkipButton onClick={moveToHome} type="button">
          건너뛰기 <span aria-hidden="true">›</span>
        </SkipButton>
      </TopBar>
      <Logo alt="BLANKER" src={logo} />
      <Description>관심사를 선택해주세요!</Description>

      <Hero>
        {config.heroImageSrc && (
          <>
            <HeroImage alt="" aria-hidden="true" src={config.heroImageSrc} />
            <Overlay />
          </>
        )}
        <HeroTitle $hasImage={Boolean(config.heroImageSrc)}>기타</HeroTitle>
      </Hero>

      <Section>
        <SectionLabel as="label" htmlFor="other-interest-sensitivity">
          민감도 정도를 선택해주세요.
        </SectionLabel>
        <SensitivityInput
          id="other-interest-sensitivity"
          max="100"
          min="0"
          onChange={(event) => setSensitivity(Number(event.target.value))}
          style={{ '--range-progress': `${sensitivity}%` }}
          type="range"
          value={sensitivity}
        />
      </Section>

      <Section>
        <SectionLabel>현재 관심있는 주제를 입력해주세요.</SectionLabel>
        <TopicForm onSubmit={handleRequestTopicInfo}>
          <TopicInput
            onChange={(event) => setTopic(event.target.value)}
            placeholder="관심있는 주제를 입력해주세요."
            value={topic}
          />
          <AddButton
            aria-label="관심 주제 추가"
            disabled={!topic.trim() || isRequesting}
            type="submit"
          >
            +
          </AddButton>
        </TopicForm>
        {requestError && <RequestError role="alert">{requestError}</RequestError>}
      </Section>

      <InterestList aria-live="polite">
        {topics.map((item) => (
          <InterestCard
            $hasImage={Boolean(item.imageSrc)}
            key={item.id}
            onClick={() =>
              setTopics((current) =>
                current.filter((topicItem) => topicItem.id !== item.id),
              )
            }
            type="button"
          >
            {item.registered && <RegisteredBadge>등록됨</RegisteredBadge>}
            {item.imageSrc && (
              <>
                <CardImage alt="" aria-hidden="true" src={item.imageSrc} />
                <CardOverlay />
              </>
            )}
            <CardContent>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
          </InterestCard>
        ))}
      </InterestList>

      <NextButton onClick={moveToHome} variant="light">
        다음으로
      </NextButton>
    </Page>
  )
}

export default OtherInterestDetailPage
