import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import {
  getInterests,
  getSelectedInterestTargets,
  selectInterests,
  syncSelectedInterestTargets,
} from '../api/interestsApi.js'
import logo from '../assets/logo.svg'
import { useAuth } from '../auth/useAuth.js'
import Button from '../components/Button.jsx'
import CategoryTypeButton from '../components/CategoryTypeButton.jsx'
import InterestTargetCard from '../components/InterestTargetCard.jsx'
import InterestTopicInput from '../components/InterestTopicInput.jsx'
import RequestState from '../components/RequestState.jsx'
import { getInterestCategoryConfig } from '../data/interestOnboarding.js'
import { getInterestTypeImage } from '../data/interestTypeImage.js'
import { useInterestTypes } from '../hooks/useInterestTypes.js'

const Page = styled.main`
  display: flex;
  width: min(100%, 402px);
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
  background: transparent;
  font-size: 14px;
  cursor: pointer;
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
  background: rgb(0 0 0 / 35%);
`
const HeroTitle = styled.h1`
  position: relative;
  z-index: 1;
  margin: 0;
  color: ${({ $hasImage }) => ($hasImage ? '#fff' : '#000')};
  font-size: 22px;
`
const Section = styled.section`
  display: grid;
  gap: 10px;
  margin-top: 20px;
`
const SectionLabel = styled.p`
  margin: 0;
  font-size: 13px;
`
const TypeScroller = styled.div`
  display: flex;
  gap: 10px;
  margin: 0 -20px;
  padding: 0 20px 4px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
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
  color: #111;
  background: #f2f2f2;
  transform: translateX(-50%);

  &:disabled {
    color: #777;
    background: #e6e6e6;
    opacity: 1;
  }
`

function CategoryInterestDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { categoryId = 'other' } = useParams()
  const { accessToken } = useAuth()
  const { items: interestTypes } = useInterestTypes()
  const config = getInterestCategoryConfig(categoryId)
  const heroImageUrl = getInterestTypeImage(interestTypes, categoryId)
  const isEditMode = location.pathname.startsWith('/interest/')
  const categoryFlow = location.state?.categoryFlow
  const categoryIds = Array.isArray(categoryFlow?.categoryIds)
    ? categoryFlow.categoryIds
    : [categoryId]
  const currentIndex = Number.isInteger(categoryFlow?.currentIndex)
    ? categoryFlow.currentIndex
    : 0
  const nextCategoryId = categoryIds[currentIndex + 1]
  const [selectedGenres, setSelectedGenres] = useState([])
  const [sensitivity, setSensitivity] = useState(50)
  const [query, setQuery] = useState('')
  const [keyword, setKeyword] = useState('')
  const [items, setItems] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [allSelectedTargets, setAllSelectedTargets] = useState([])
  const [selectionState, setSelectionState] = useState(
    isEditMode ? 'loading' : 'success',
  )
  const [selectionError, setSelectionError] = useState('')
  const [pageState, setPageState] = useState('loading')
  const [error, setError] = useState('')
  const [errorSource, setErrorSource] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setSelectedGenres([])
    setSensitivity(50)
    setQuery('')
    setKeyword('')
    setItems([])
    setSelectedIds([])
    setAllSelectedTargets([])
    setSelectionState(isEditMode ? 'loading' : 'success')
    setSelectionError('')
    setError('')
    setErrorSource('')
    setIsSubmitting(false)
  }, [categoryId, isEditMode])

  useEffect(() => {
    let isActive = true

    async function loadSelectedInterests() {
      if (!isEditMode) {
        setSelectionState('success')
        return
      }

      if (!accessToken) {
        setSelectionState('auth')
        return
      }

      setSelectionState('loading')
      setSelectionError('')

      try {
        const data = await getSelectedInterestTargets(accessToken)
        if (!isActive) return

        const targets = data?.items ?? []
        const currentTargets = targets.filter(
          (target) => target.interestType === config.label,
        )

        setAllSelectedTargets(targets)
        setSelectedIds(
          currentTargets
            .map((target) => target.interestId)
            .filter(Boolean),
        )
        setSelectedGenres([
          ...new Set(
            currentTargets
              .map((target) => target.genre)
              .filter((genre) => genre && genre !== '전체'),
          ),
        ])
        setSelectionState('success')
      } catch (requestError) {
        if (isActive) {
          setAllSelectedTargets([])
          setSelectedIds([])
          setSelectionError(
            requestError.message || '선택한 관심사를 불러오지 못했습니다.',
          )
          setSelectionState('error')
        }
      }
    }

    loadSelectedInterests()
    return () => {
      isActive = false
    }
  }, [accessToken, config.label, isEditMode, reloadKey])

  useEffect(() => {
    let isActive = true

    async function loadInterests() {
      if (!accessToken) {
        setPageState('auth')
        return
      }
      setPageState('loading')
      setError('')
      setErrorSource('')

      try {
        const data = await getInterests({
          accessToken,
          genre: '전체',
          interestType: config.label,
          keyword,
        })
        if (isActive) {
          setItems(data?.items ?? [])
          setPageState('success')
        }
      } catch (requestError) {
        if (isActive) {
          setItems([])
          setError(requestError.message || '관심사 목록을 불러오지 못했습니다.')
          setErrorSource('load')
          setPageState('error')
        }
      }
    }

    loadInterests()
    return () => {
      isActive = false
    }
  }, [accessToken, config.label, keyword, reloadKey])

  const handleSearch = (event) => {
    event.preventDefault()
    setKeyword(query.trim())
  }

  const toggleInterest = (interestId) => {
    setSelectedIds((current) =>
      current.includes(interestId)
        ? current.filter((id) => id !== interestId)
        : [...current, interestId],
    )
  }

  const handleSubmit = async () => {
    if (isSubmitting || (isEditMode && selectionState !== 'success')) return
    setIsSubmitting(true)
    setError('')
    setErrorSource('')

    try {
      if (isEditMode) {
        const preservedIds = allSelectedTargets
          .filter((target) => target.interestType !== config.label)
          .map((target) => target.interestId)
          .filter(Boolean)
        const nextSelectedIds = [
          ...new Set([...preservedIds, ...selectedIds]),
        ]

        if (nextSelectedIds.length === 0) {
          setError('관심사는 최소 1개 이상 선택해야 합니다.')
          setErrorSource('validation')
          setIsSubmitting(false)
          return
        }

        const data = await syncSelectedInterestTargets(
          accessToken,
          nextSelectedIds,
        )
        setAllSelectedTargets(data?.items ?? [])
        navigate('/interest', { replace: true })
        return
      }

      if (selectedIds.length > 0) {
        await selectInterests(accessToken, selectedIds)
      }
      if (nextCategoryId) {
        navigate(`/onboarding/interests/${nextCategoryId}`, {
          state: {
            categoryFlow: {
              categoryIds,
              currentIndex: currentIndex + 1,
            },
          },
        })
        return
      }
      navigate('/login', {
        replace: true,
        state: { message: '관심사 설정이 완료되었습니다. 로그인해 주세요.' },
      })
    } catch (requestError) {
      setError(requestError.message || '관심사를 저장하지 못했습니다.')
      setErrorSource('save')
      setIsSubmitting(false)
    }
  }

  return (
    <Page>
      <TopBar>
        <SkipButton
          onClick={() => navigate(isEditMode ? '/interest' : '/login')}
          type="button"
        >
          건너뛰기 <span aria-hidden="true">›</span>
        </SkipButton>
      </TopBar>
      <Logo alt="BLANKER" src={logo} />
      <Description>관심사를 선택해주세요!</Description>

      <Hero>
        {heroImageUrl && (
          <>
            <HeroImage alt={`${config.label} 대표 이미지`} src={heroImageUrl} />
            <Overlay />
          </>
        )}
        <HeroTitle $hasImage={Boolean(heroImageUrl)}>{config.label}</HeroTitle>
      </Hero>

      {config.types.length > 0 && (
        <Section>
          <SectionLabel>장르를 선택해주세요.</SectionLabel>
          <TypeScroller aria-label={`${config.label} 장르`}>
            {['전체', ...config.types].map((type) => (
              <CategoryTypeButton
                key={type}
                onClick={() => {
                  if (type === '전체') {
                    setSelectedGenres([])
                    return
                  }

                  setSelectedGenres((current) =>
                    current.includes(type)
                      ? current.filter((genre) => genre !== type)
                      : [...current, type],
                  )
                }}
                selected={
                  type === '전체'
                    ? selectedGenres.length === 0
                    : selectedGenres.includes(type)
                }
              >
                {type}
              </CategoryTypeButton>
            ))}
          </TypeScroller>
        </Section>
      )}

      <Section>
        <SectionLabel as="label" htmlFor="interest-sensitivity">
          민감도 정도를 선택해주세요.
        </SectionLabel>
        <SensitivityInput
          id="interest-sensitivity"
          max="100"
          min="0"
          onChange={(event) => setSensitivity(Number(event.target.value))}
          style={{ '--range-progress': `${sensitivity}%` }}
          type="range"
          value={sensitivity}
        />
      </Section>

      <Section>
        <SectionLabel>관심 있는 {config.label}를 검색해주세요.</SectionLabel>
        <InterestTopicInput
          buttonLabel={`${config.label} 검색`}
          disabled={!query.trim()}
          inputLabel={`${config.label} 검색어`}
          onChange={(event) => setQuery(event.target.value)}
          onSubmit={handleSearch}
          placeholder={config.searchPlaceholder}
          value={query}
        />
      </Section>

      {(pageState === 'loading' || selectionState === 'loading') && (
        <RequestState message="관심사 목록을 불러오는 중입니다." />
      )}
      {(pageState === 'auth' || selectionState === 'auth') && (
        <RequestState message="로그인이 필요합니다." />
      )}
      {selectionState === 'error' && (
        <RequestState
          message={selectionError}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      )}
      {selectionState === 'success' && pageState === 'error' && (
        <RequestState
          message={error}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      )}
      {selectionState === 'success' && pageState === 'success' && items.length === 0 && (
        <RequestState message="조건에 맞는 관심사가 없습니다." />
      )}
      {selectionState === 'success' && pageState === 'success' && items.length > 0 && (
        <InterestList aria-label={`${config.label} 관심사 목록`}>
          {items.map((item) => (
            <InterestTargetCard
              imageUrl={item.imageUrl}
              key={item.interestId}
              onClick={() => toggleInterest(item.interestId)}
              selected={selectedIds.includes(item.interestId)}
              summary={item.genre}
              title={item.title}
            />
          ))}
        </InterestList>
      )}
      {error && pageState !== 'error' && (
        <RequestState
          compact
          message={error}
          onRetry={errorSource === 'save' ? handleSubmit : undefined}
        />
      )}

      <NextButton
        disabled={isSubmitting || (isEditMode && selectionState !== 'success')}
        onClick={handleSubmit}
        variant="light"
      >
        {isSubmitting ? '저장 중...' : '다음으로'}
      </NextButton>
    </Page>
  )
}

export default CategoryInterestDetailPage
