import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { getSelectedInterestTargets } from '../api/interestsApi.js'
import { useAuth } from '../auth/useAuth.js'
import BottomTabBar from '../components/BottomTabBar.jsx'
import CategoryButton from '../components/CategoryButton.jsx'
import HomeHeader from '../components/HomeHeader.jsx'
import RequestState from '../components/RequestState.jsx'
import { useInterestTypes } from '../hooks/useInterestTypes.js'

const Page = styled.main`
  width: min(100%, 402px);
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
function InterestPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const { error, isLoading, items, retry } = useInterestTypes()
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedError, setSelectedError] = useState('')
  const [isSelectedLoading, setIsSelectedLoading] = useState(true)
  const [requestCount, setRequestCount] = useState(0)

  const retryAll = useCallback(() => {
    retry()
    setRequestCount((count) => count + 1)
  }, [retry])

  useEffect(() => {
    let isActive = true

    async function loadSelectedTypes() {
      if (!accessToken) {
        if (isActive) {
          setSelectedError('로그인이 필요합니다.')
          setIsSelectedLoading(false)
        }
        return
      }

      setSelectedError('')
      setIsSelectedLoading(true)

      try {
        const data = await getSelectedInterestTargets(accessToken)
        if (!isActive) return

        setSelectedTypes([
          ...new Set(
            (data?.items ?? [])
              .map((target) => target.interestType)
              .filter(Boolean),
          ),
        ])
      } catch {
        if (isActive) {
          setSelectedTypes([])
          setSelectedError('선택한 관심사를 불러오지 못했습니다.')
        }
      } finally {
        if (isActive) setIsSelectedLoading(false)
      }
    }

    loadSelectedTypes()
    return () => {
      isActive = false
    }
  }, [accessToken, requestCount])

  const pageError = error || selectedError
  const pageLoading = isLoading || isSelectedLoading

  return (
    <Page>
      <FixedHeader><HomeHeader /></FixedHeader>
      <Content>
        <Description>수정할 관심사 카테고리를 선택해주세요.</Description>
        {pageLoading && <RequestState message="관심사 목록을 불러오는 중입니다." />}
        {!pageLoading && pageError && (
          <RequestState
            message={pageError}
            onRetry={accessToken ? retryAll : undefined}
          />
        )}
        {!pageLoading && !pageError && (
          <CategoryGrid aria-label="관심사 카테고리">
            {items.map((category) => (
              <CategoryButton
                key={category.id}
                label={category.name}
                onClick={() => navigate(`/interest/${category.id}`)}
                selected={selectedTypes.includes(category.name)}
              >
                {category.imageUrl && <img alt="" src={category.imageUrl} />}
              </CategoryButton>
            ))}
          </CategoryGrid>
        )}
      </Content>
      <BottomTabBar />
    </Page>
  )
}

export default InterestPage
