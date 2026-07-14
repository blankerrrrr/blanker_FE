import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  getInterestItems,
  getSelectedInterestTypes,
} from '../api/interestsApi.js'
import { useAuth } from '../auth/useAuth.js'
import BottomTabBar from '../components/BottomTabBar.jsx'
import CategoryItem from '../components/CategoryItem.jsx'
import HomeHeader from '../components/HomeHeader.jsx'
import PostFeed from '../components/PostFeed.jsx'

const Page = styled.main`
  width: min(100%, 402px);
  min-height: 100vh;
  min-height: 100svh;
  margin: 0 auto;
  padding-bottom: 104px;
  background: #fff;
`

const FixedTop = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
  box-shadow: 0 1px 0 rgb(0 0 0 / 6%);
`

const CategoryList = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 20px 12px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const FeedArea = styled.div`
  padding: 0 20px;
`

const FeedStatus = styled.p`
  margin: 48px 0;
  color: #777;
  font-size: 14px;
  text-align: center;
`

const cardSizes = ['hero', 'tall', 'small', 'small']

function toPost(item, index) {
  return {
    id: item.interestItemId,
    title: item.title,
    description: item.summary,
    image: item.imageUrl,
    size: cardSizes[index % cardSizes.length],
  }
}

function HomePage() {
  const { accessToken } = useAuth()
  const [filters, setFilters] = useState([{ name: '전체' }])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [feedPosts, setFeedPosts] = useState([])
  const [feedState, setFeedState] = useState('loading')

  useEffect(() => {
    let isActive = true

    async function loadFilters() {
      if (!accessToken) return

      try {
        const data = await getSelectedInterestTypes(accessToken)
        const selectedTypes = data?.items ?? []
        if (isActive) setFilters([{ name: '전체' }, ...selectedTypes])
      } catch {
        // Keep the fallback filters while the API is unavailable.
      }
    }

    loadFilters()
    return () => {
      isActive = false
    }
  }, [accessToken])

  useEffect(() => {
    let isActive = true

    async function loadFeed() {
      if (!accessToken) {
        if (isActive) setFeedState('error')
        return
      }

      setFeedState('loading')

      try {
        const options = { page: 1, size: 20 }
        if (selectedCategory !== 'all') {
          options.interestType = selectedCategory
        }

        const data = await getInterestItems(accessToken, options)
        if (!isActive) return

        setFeedPosts((data?.items ?? []).map(toPost))
        setFeedState('success')
      } catch {
        if (isActive) {
          setFeedPosts([])
          setFeedState('error')
        }
      }
    }

    loadFeed()
    return () => {
      isActive = false
    }
  }, [accessToken, selectedCategory])

  return (
    <Page>
      <FixedTop data-layout="fixed-top">
        <HomeHeader />
        <CategoryList aria-label="카테고리">
          {filters.map((category) => (
            <CategoryItem
              key={category.name}
              onClick={() =>
                setSelectedCategory(category.name === '전체' ? 'all' : category.name)
              }
              selected={
                selectedCategory ===
                (category.name === '전체' ? 'all' : category.name)
              }
            >
              {category.name}
            </CategoryItem>
          ))}
        </CategoryList>
      </FixedTop>
      <FeedArea>
        {feedState === 'loading' && <FeedStatus>관심 정보를 불러오는 중입니다.</FeedStatus>}
        {feedState === 'error' && <FeedStatus>관심 정보를 불러오지 못했습니다.</FeedStatus>}
        {feedState === 'success' && feedPosts.length === 0 && (
          <FeedStatus>표시할 관심 정보가 없습니다.</FeedStatus>
        )}
        {feedState === 'success' && feedPosts.length > 0 && (
          <PostFeed posts={feedPosts} />
        )}
      </FeedArea>
      <BottomTabBar />
    </Page>
  )
}

export default HomePage
