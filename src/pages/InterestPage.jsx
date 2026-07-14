import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { getSelectedInterestTargets } from '../api/interestsApi.js'
import { useAuth } from '../auth/useAuth.js'
import BottomTabBar from '../components/BottomTabBar.jsx'
import CategoryButton from '../components/CategoryButton.jsx'
import HomeHeader from '../components/HomeHeader.jsx'
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

function InterestPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const { error, isLoading, items, retry } = useInterestTypes()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedError, setSelectedError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadSelectedTargets() {
      try {
        const data = await getSelectedInterestTargets(accessToken)
        if (!isActive) return
        setSelectedCategories([
          ...new Set((data?.items ?? []).map((target) => target.interestType)),
        ])
      } catch {
        if (isActive) setSelectedError('선택한 관심사를 불러오지 못했습니다.')
      }
    }

    if (accessToken) loadSelectedTargets()
    return () => {
      isActive = false
    }
  }, [accessToken])

  return (
    <Page>
      <FixedHeader><HomeHeader /></FixedHeader>
      <Content>
        <Description>수정할 관심사 카테고리를 선택해주세요.</Description>
        {selectedError && <Status role="alert">{selectedError}</Status>}
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
                onClick={() => navigate(`/interest/${category.id}`)}
                selected={selectedCategories.includes(category.name)}
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
