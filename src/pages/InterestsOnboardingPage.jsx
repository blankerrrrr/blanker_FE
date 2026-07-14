import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import logo from '../assets/logo.svg'
import Button from '../components/Button.jsx'
import CategoryButton from '../components/CategoryButton.jsx'
import { useInterestTypes } from '../hooks/useInterestTypes.js'

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
  align-items: flex-start;
  justify-content: flex-end;
  margin-bottom: 4px;
`

const Logo = styled.img`
  display: block;
  width: 176px;
  height: auto;
`

const SkipButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
`

const Intro = styled.div`
  margin: 8px 0 10px;
`

const Description = styled.p`
  margin: 0;
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

const NextButton = styled(Button)`
  position: fixed;
  bottom: max(20px, env(safe-area-inset-bottom));
  left: 50%;
  z-index: 30;
  width: min(calc(100% - 40px), 362px);
  transform: translateX(-50%);
`

function InterestsOnboardingPage() {
  const navigate = useNavigate()
  const { error, isLoading, items, retry } = useInterestTypes()
  const [selectedCategories, setSelectedCategories] = useState([])

  const toggleCategory = (categoryId) => {
    setSelectedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    )
  }

  const moveToDetail = () => {
    if (selectedCategories.length > 0) {
      navigate(`/onboarding/interests/${selectedCategories[0]}`)
    }
  }

  return (
    <Page>
      <TopBar>
        <SkipButton onClick={() => navigate('/home')} type="button">
          건너뛰기 <span aria-hidden="true">›</span>
        </SkipButton>
      </TopBar>
      <Logo alt="BLANKER" src={logo} />
      <Intro><Description>관심사를 선택해주세요!</Description></Intro>

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
              onClick={() => toggleCategory(category.id)}
              selected={selectedCategories.includes(category.id)}
            >
              {category.imageUrl && <img alt="" src={category.imageUrl} />}
            </CategoryButton>
          ))}
        </CategoryGrid>
      )}

      <NextButton
        disabled={selectedCategories.length === 0}
        onClick={moveToDetail}
        variant="light"
      >
        다음으로
      </NextButton>
    </Page>
  )
}

export default InterestsOnboardingPage
