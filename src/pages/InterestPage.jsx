import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  getSelectedInterestTargets,
  syncSelectedInterestTargets,
} from '../api/interestsApi.js'
import { useAuth } from '../auth/useAuth.js'
import BottomTabBar from '../components/BottomTabBar.jsx'
import CategoryButton from '../components/CategoryButton.jsx'
import HomeHeader from '../components/HomeHeader.jsx'
import { useInterestTypes } from '../hooks/useInterestTypes.js'

const Page = styled.main`
  width: min(100%, 402px);
  min-height: 100vh;
  min-height: 100svh;
  margin: 0 auto;
  padding: 0 0 112px;
  background: #fff;
`

const FixedHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
`

const Content = styled.div`
  padding: 0 20px;
`

const Description = styled.h1`
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 500;
`

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`

const Status = styled.div`
  display: grid;
  min-height: 180px;
  place-items: center;
  color: #777;
  font-size: 14px;
  text-align: center;
`

const RetryButton = styled.button`
  margin-top: 10px;
  padding: 8px 14px;
  border: 1px solid #d8d8d8;
  border-radius: 10px;
  background: #f8f8f8;
`

const interestTabs = [
  { to: '/home', icon: 'home', label: '홈' },
  { to: '/search', icon: 'search', label: '검색' },
  { to: '/interest', icon: 'id-card', label: '관심사' },
  { to: '/profile', icon: 'user', label: '프로필' },
]

function InterestPage() {
  const { accessToken } = useAuth()
  const { error, isLoading, items, retry } = useInterestTypes()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTargets, setSelectedTargets] = useState([])
  const [knownTargets, setKnownTargets] = useState([])
  const [syncError, setSyncError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadSelectedTargets() {
      if (!accessToken) return

      try {
        const data = await getSelectedInterestTargets(accessToken)
        if (!isActive) return

        const targets = data?.items ?? []
        setKnownTargets(targets)
        setSelectedTargets(targets)
        setSelectedCategories([
          ...new Set(targets.map((target) => target.interestType)),
        ])
        setSyncError('')
      } catch {
        if (isActive) setSyncError('선택한 관심사를 불러오지 못했습니다.')
      }
    }

    loadSelectedTargets()
    return () => {
      isActive = false
    }
  }, [accessToken])

  const toggleCategory = async (category) => {
    const isSelected = selectedCategories.includes(category.name)
    const targetsForCategory = knownTargets.filter(
      (target) => target.interestType === category.name,
    )

    if (targetsForCategory.length === 0) {
      setSelectedCategories((current) =>
        isSelected
          ? current.filter((name) => name !== category.name)
          : [...current, category.name],
      )
      return
    }

    const previousTargets = selectedTargets
    const previousCategories = selectedCategories
    const nextTargets = isSelected
      ? selectedTargets.filter((target) => target.interestType !== category.name)
      : [
          ...selectedTargets,
          ...targetsForCategory.filter(
            (candidate) =>
              !selectedTargets.some(
                (target) => target.interestId === candidate.interestId,
              ),
          ),
        ]
    const interestIds = nextTargets.map((target) => target.interestId)

    if (interestIds.length === 0) {
      setSyncError('관심사는 최소 1개 이상 선택해야 합니다.')
      return
    }

    setSelectedTargets(nextTargets)
    setSelectedCategories((current) =>
      isSelected
        ? current.filter((name) => name !== category.name)
        : [...current, category.name],
    )
    setSyncError('')

    try {
      const data = await syncSelectedInterestTargets(accessToken, interestIds)
      if (data?.items) setSelectedTargets(data.items)
    } catch {
      setSelectedTargets(previousTargets)
      setSelectedCategories(previousCategories)
      setSyncError('관심사 변경사항을 저장하지 못했습니다.')
    }
  }

  return (
    <Page>
      <FixedHeader data-layout="fixed-interest-header"><HomeHeader /></FixedHeader>
      <Content>
        <Description>관심사를 선택해주세요!</Description>
        {syncError && <Status role="alert">{syncError}</Status>}
        {isLoading && <Status>관심사 목록을 불러오는 중...</Status>}
        {!isLoading && error && (
          <Status role="alert">
            <div>{error}<br /><RetryButton onClick={retry}>다시 시도</RetryButton></div>
          </Status>
        )}
        {!isLoading && !error && (
          <CategoryGrid aria-label="관심사 카테고리">
            {items.map((category) => (
              <CategoryButton
                key={category.id}
                label={category.name}
                onClick={() => toggleCategory(category)}
                selected={selectedCategories.includes(category.name)}
              >
                {category.imageUrl && <img alt="" src={category.imageUrl} />}
              </CategoryButton>
            ))}
          </CategoryGrid>
        )}
      </Content>
      <BottomTabBar tabs={interestTabs} />
    </Page>
  )
}

export default InterestPage
