import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getBlockedItems } from '../api/interestsApi.js'
import { useAuth } from '../auth/useAuth.js'
import BottomTabBar from '../components/BottomTabBar.jsx'
import HomeHeader from '../components/HomeHeader.jsx'
import LinkCard from '../components/LinkCard.jsx'
import RequestState from '../components/RequestState.jsx'
import { normalizeBlockedItems } from '../data/blockedItems.js'

const Page = styled.main`
  width: min(100%, 402px);
  min-height: 100svh;
  margin: 0 auto;
  padding-bottom: 112px;
  background: #fff;
`
const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  padding-bottom: 8px;
  background: #fff;
`
const Content = styled.div`
  display: grid;
  gap: 18px;
  padding: 4px 20px 0;
`
const GroupTitle = styled.h1`
  margin: 0 0 10px;
  font-size: 15px;
`
const CardList = styled.div`
  display: grid;
  gap: 10px;
`
const GroupEmptyState = styled.p`
  padding: 20px 12px;
  border-radius: 14px;
  color: #888;
  background: #f7f7f7;
  font-size: 12px;
  text-align: center;
`

function BlankPage() {
  const { accessToken } = useAuth()
  const [groups, setGroups] = useState([])
  const [revealedIds, setRevealedIds] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isActive = true

    async function loadBlockedItems() {
      if (!accessToken) {
        setError('로그인이 필요합니다.')
        setIsLoading(false)
        return
      }

      setError('')
      setIsLoading(true)

      try {
        const data = await getBlockedItems(accessToken, { type: 'SPOILER' })
        if (isActive) setGroups(normalizeBlockedItems(data))
      } catch {
        if (isActive) setError('보관함을 불러오지 못했습니다.')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadBlockedItems()
    return () => {
      isActive = false
    }
  }, [accessToken, reloadKey])

  return (
    <Page>
      <Header>
        <HomeHeader />
      </Header>
      <Content>
        {isLoading && <RequestState message="보관함을 불러오는 중입니다." />}
        {!isLoading && error && (
          <RequestState
            message={error}
            onRetry={accessToken ? () => setReloadKey((key) => key + 1) : undefined}
          />
        )}
        {!isLoading && !error && groups.map((group) => (
          <section key={group.title}>
            <GroupTitle>{group.title}</GroupTitle>
            {group.items.length ? (
              <CardList>
                {group.items.map((item) => {
                  const revealed = revealedIds.includes(item.blockedItemId)
                  return (
                    <LinkCard
                      ariaLabel={`${group.title} 스포일러 ${revealed ? '가리기' : '보기'}`}
                      key={item.blockedItemId}
                      onReveal={() =>
                        setRevealedIds((current) =>
                          current.includes(item.blockedItemId)
                            ? current.filter((id) => id !== item.blockedItemId)
                            : [...current, item.blockedItemId],
                        )
                      }
                      revealed={revealed}
                      sourceLabel={`${group.title} 원문 링크 열기`}
                      summary={item.summary}
                      url={item.sourceUrl}
                      variant="spoiler"
                    />
                  )
                })}
              </CardList>
            ) : (
              <GroupEmptyState>보관된 스포일러 콘텐츠가 없습니다.</GroupEmptyState>
            )}
          </section>
        ))}
        {!isLoading && !error && !groups.length && (
          <RequestState message="보관된 스포일러 콘텐츠가 없습니다." />
        )}
      </Content>
      <BottomTabBar />
    </Page>
  )
}

export default BlankPage
