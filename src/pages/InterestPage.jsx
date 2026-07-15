import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
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
  const { error, isLoading, items, retry } = useInterestTypes()

  return (
    <Page>
      <FixedHeader><HomeHeader /></FixedHeader>
      <Content>
        <Description>수정할 관심사 카테고리를 선택해주세요.</Description>
        {isLoading && <RequestState message="관심사 목록을 불러오는 중입니다." />}
        {!isLoading && error && (
          <RequestState
            message={error}
            onRetry={retry}
          />
        )}
        {!isLoading && !error && (
          <CategoryGrid aria-label="관심사 카테고리">
            {items.map((category) => (
              <CategoryButton
                key={category.id}
                label={category.name}
                onClick={() => navigate(`/interest/${category.id}`)}
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
