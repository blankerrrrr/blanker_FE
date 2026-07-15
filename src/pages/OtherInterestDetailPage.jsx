import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  createInterestTarget,
  getSelectedInterestTargets,
  syncSelectedInterestTargets,
} from '../api/interestsApi.js'
import logo from '../assets/logo.svg'
import { useAuth } from '../auth/useAuth.js'
import Button from '../components/Button.jsx'
import InterestTopicInput from '../components/InterestTopicInput.jsx'
import InterestTargetCard from '../components/InterestTargetCard.jsx'
import RequestState from '../components/RequestState.jsx'
import { interestCategoryConfigs } from '../data/interestOnboarding.js'

const Page = styled.main`
  display: flex;
  width: min(100%, 402px);
  min-height: 100vh;
  min-height: 100svh;
  flex-direction: column;
  margin: 0 auto;
  padding: 30px 20px 112px;
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

const InterestList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 16px;
`

const NextButton = styled(Button)`
  position: fixed;
  bottom: max(20px, env(safe-area-inset-bottom));
  left: 50%;
  z-index: 30;
  width: min(calc(100% - 40px), 362px);
  transform: translateX(-50%);
`

function OtherInterestDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const config = interestCategoryConfigs.other
  const [sensitivity, setSensitivity] = useState(50)
  const [topic, setTopic] = useState('')
  const [topics, setTopics] = useState(config.recommendations)
  const [allSelectedTargets, setAllSelectedTargets] = useState([])
  const [isRequesting, setIsRequesting] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [errorSource, setErrorSource] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const isEditMode = location.pathname === '/interest/other'

  useEffect(() => {
    let isActive = true

    async function loadSelectedTargets() {
      if (!isEditMode) return

      try {
        const data = await getSelectedInterestTargets(accessToken)
        if (!isActive) return
        const targets = data?.items ?? []
        setAllSelectedTargets(targets)
        setTopics(
          targets
            .filter((target) => target.interestType === config.label)
            .map((target) => ({
              ...target,
              id: target.interestTargetId,
              title: target.title,
              description: target.genre || '선택한 관심사',
              imageSrc: target.imageUrl,
              registered: true,
            })),
        )
      } catch {
        if (isActive) {
          setRequestError('선택한 관심사를 불러오지 못했습니다.')
          setErrorSource('load')
        }
      }
    }

    loadSelectedTargets()
    return () => {
      isActive = false
    }
  }, [accessToken, config.label, isEditMode, reloadKey])

  const handleRequestTopicInfo = async (event) => {
    event.preventDefault()
    const title = topic.trim()
    if (!title || isRequesting) return

    setIsRequesting(true)
    setRequestError('')
    setErrorSource('')

    try {
      const result = await createInterestTarget(accessToken, title)
      const createdTopic = {
        id: result.interestTargetId,
        title: result.title ?? result.name,
        summary: result.summary,
        imageUrl: result.imageUrl,
        registered: true,
      }
      setTopics((current) => [
        createdTopic,
        ...current.filter((item) => item.id !== createdTopic.id),
      ])
      setTopic('')
    } catch (error) {
      setRequestError(error.message)
      setErrorSource('create')
    } finally {
      setIsRequesting(false)
    }
  }

  const moveToHome = async () => {
    if (!isEditMode) {
      navigate('/home')
      return
    }

    const interestIds = [
      ...allSelectedTargets.filter(
        (target) => target.interestType !== config.label,
      ),
      ...topics,
    ]
      .map((target) => target.interestId)
      .filter(Boolean)

    if (interestIds.length === 0) {
      setRequestError('관심사는 최소 1개 이상 선택해야 합니다.')
      setErrorSource('validation')
      return
    }

    setIsRequesting(true)
    setRequestError('')
    setErrorSource('')
    try {
      await syncSelectedInterestTargets(accessToken, interestIds)
      navigate('/interest')
    } catch (error) {
      setRequestError(error.message)
      setErrorSource('sync')
      setIsRequesting(false)
    }
  }

  const handleCancel = () => navigate(isEditMode ? '/interest' : '/home')

  return (
    <Page>
      <TopBar>
        <SkipButton onClick={handleCancel} type="button">
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
        <InterestTopicInput
          buttonLabel="관심 주제 추가"
          disabled={!topic.trim() || isRequesting}
          inputLabel="관심 주제 입력"
          onChange={(event) => setTopic(event.target.value)}
          onSubmit={handleRequestTopicInfo}
          placeholder="관심있는 주제를 입력해주세요."
          value={topic}
        />
        {requestError && (
          <RequestState
            compact
            message={requestError}
            onRetry={errorSource === 'load'
              ? () => setReloadKey((key) => key + 1)
              : errorSource === 'create'
                ? () => handleRequestTopicInfo({ preventDefault() {} })
                : errorSource === 'sync'
                  ? moveToHome
                  : undefined}
          />
        )}
      </Section>

      <InterestList aria-live="polite">
        {topics.map((item) => (
          <InterestTargetCard
            imageUrl={item.imageUrl ?? item.imageSrc}
            key={item.id}
            onClick={() =>
              setTopics((current) =>
                current.filter((topicItem) => topicItem.id !== item.id),
              )
            }
            summary={item.summary ?? item.description}
            title={item.title}
          />
        ))}
      </InterestList>

      <NextButton onClick={moveToHome} variant="light">
        다음으로
      </NextButton>
    </Page>
  )
}

export default OtherInterestDetailPage
