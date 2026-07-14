import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getVisitHistory } from '../api/interestsApi.js'
import { useAuth } from '../auth/useAuth.js'
import BottomTabBar from '../components/BottomTabBar.jsx'
import HomeHeader from '../components/HomeHeader.jsx'
import LinkCard from '../components/LinkCard.jsx'
import { normalizeVisitHistory } from '../data/visitHistory.js'

const Page = styled.main`
  width: min(100%, 402px);
  min-height: 100vh;
  min-height: 100svh;
  margin: 0 auto;
  padding-bottom: 112px;
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

const Group = styled.section`
  margin-bottom: 18px;
`

const DateTitle = styled.h1`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
`

const RecordList = styled.ul`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`

const Record = styled.li`
  min-width: 0;
`


const Status = styled.div`
  display: grid;
  min-height: 240px;
  place-items: center;
  color: #777;
  font-size: 14px;
  text-align: center;
`

const GroupEmptyState = styled.p`
  padding: 20px 12px;
  border-radius: 14px;
  color: #888;
  background: #f7f7f7;
  font-size: 12px;
  text-align: center;
`

function VisitHistoryPage() {
  const { accessToken } = useAuth()
  const [groups, setGroups] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadVisitHistory() {
      if (!accessToken) {
        setError('로그인이 필요합니다.')
        setIsLoading(false)
        return
      }

      try {
        const data = await getVisitHistory(accessToken)
        if (isActive) setGroups(normalizeVisitHistory(data))
      } catch {
        if (isActive) setError('방문 기록을 불러오지 못했습니다.')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadVisitHistory()
    return () => {
      isActive = false
    }
  }, [accessToken])

  return (
    <Page>
      <FixedHeader data-layout="fixed-history-header">
        <HomeHeader />
      </FixedHeader>
      <Content>
        {isLoading && <Status>방문 기록을 불러오는 중...</Status>}
        {!isLoading && error && <Status role="alert">{error}</Status>}
        {!isLoading && !error && groups.length === 0 && (
          <Status>방문 기록이 없습니다.</Status>
        )}
        {!isLoading && !error && groups.length > 0 && (
          <div aria-label="방문 기록" role="list">
          {groups.map((group) => (
            <Group key={group.date}>
              <DateTitle>{group.date}</DateTitle>
              {group.items.length ? (
                <RecordList>
                  {group.items.map((record) => (
                    <Record key={record.interestItemId} role="listitem">
                      <LinkCard
                        ariaLabel={`${record.sourceUrl} 방문 페이지 열기`}
                        summary={record.summary}
                        url={record.sourceUrl}
                      />
                    </Record>
                  ))}
                </RecordList>
              ) : (
                <GroupEmptyState>
                  이 날짜의 방문 기록이 없습니다.
                </GroupEmptyState>
              )}
            </Group>
          ))}
          </div>
        )}
      </Content>
      <BottomTabBar />
    </Page>
  )
}

export default VisitHistoryPage
