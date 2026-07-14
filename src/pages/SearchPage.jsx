import { useState } from 'react'
import styled from 'styled-components'
import { getInterestItems } from '../api/interestsApi.js'
import { useAuth } from '../auth/useAuth.js'
import BottomTabBar from '../components/BottomTabBar.jsx'
import HomeHeader from '../components/HomeHeader.jsx'
import LinkCard from '../components/LinkCard.jsx'
import SearchBar from '../components/SearchBar.jsx'

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
const HeaderSearchBar = styled(SearchBar)`
  margin: 0 20px;
`
const Results = styled.section`
  display: grid;
  gap: 10px;
  padding: 4px 20px 0;
`
const Status = styled.p`
  margin: 64px 20px;
  color: #777;
  font-size: 14px;
  text-align: center;
`

function SearchPage() {
  const { accessToken } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [state, setState] = useState('idle')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const keyword = query.trim()

    if (!keyword || !accessToken) {
      setResults([])
      setState('idle')
      return
    }

    setState('loading')
    try {
      const data = await getInterestItems(accessToken, {
        keyword,
        page: 1,
        size: 20,
      })
      setResults(data?.items ?? [])
      setState('success')
    } catch {
      setResults([])
      setState('error')
    }
  }

  return (
    <Page>
      <Header>
        <HomeHeader />
        <HeaderSearchBar
          ariaLabel="검색어"
          buttonLabel="검색"
          onChange={(event) => setQuery(event.target.value)}
          onSubmit={handleSubmit}
          placeholder="검색어를 입력해 주세요."
          value={query}
        />
      </Header>
      {state === 'loading' && <Status>검색 중...</Status>}
      {state === 'error' && <Status role="alert">검색 결과를 불러오지 못했습니다.</Status>}
      {state === 'success' && results.length > 0 && (
        <Results aria-label="검색 결과">
          {results.map((result) => (
            <LinkCard
              ariaLabel={`${result.title} 원문 링크 열기`}
              key={result.interestItemId}
              summary={result.summary}
              url={result.sourceUrl}
            />
          ))}
        </Results>
      )}
      {state === 'success' && results.length === 0 && (
        <Status>검색 결과가 없습니다.</Status>
      )}
      {state === 'idle' && <Status>검색어를 입력해 주세요.</Status>}
      <BottomTabBar />
    </Page>
  )
}

export default SearchPage
