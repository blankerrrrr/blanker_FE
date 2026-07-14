import { useCallback, useEffect, useState } from 'react'
import { getInterestTypes } from '../api/interestsApi.js'
import { useAuth } from '../auth/useAuth.js'

const categoryIds = {
  영화: 'movie',
  소설: 'novel',
  드라마: 'drama',
  애니메이션: 'animation',
  게임: 'game',
  웹툰: 'webtoon',
  뮤지컬: 'musical',
  기타: 'other',
}

function normalizeItem(item) {
  const name = item.name.trim()
  return {
    id: categoryIds[name] ?? name.toLocaleLowerCase().replaceAll(' ', '-'),
    imageUrl: item.imageUrl,
    name,
  }
}

export function useInterestTypes() {
  const { accessToken } = useAuth()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [requestCount, setRequestCount] = useState(0)

  const retry = useCallback(() => {
    setRequestCount((count) => count + 1)
  }, [])

  useEffect(() => {
    let isActive = true

    async function loadTypes() {
      if (!accessToken) {
        if (isActive) {
          setItems([])
          setError('로그인이 필요합니다.')
          setIsLoading(false)
        }
        return
      }

      setError('')
      setIsLoading(true)

      try {
        const data = await getInterestTypes(accessToken)
        if (isActive) setItems((data.items ?? []).map(normalizeItem))
      } catch {
        if (isActive) {
          setItems([])
          setError('관심사 목록을 불러오지 못했습니다.')
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadTypes()
    return () => {
      isActive = false
    }
  }, [accessToken, requestCount])

  return { error, isLoading, items, retry }
}
