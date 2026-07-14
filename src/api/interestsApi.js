import {
  getMockInterests,
  mockInterestTypes,
} from '../data/mockInterests.js'
import { requestApi } from './apiClient.js'

export async function requestInterestTitleInfo({ categoryId, title }) {
  const normalizedTitle = title.trim()

  return {
    id: `${categoryId}-${normalizedTitle.toLocaleLowerCase().replaceAll(' ', '-')}`,
    title: normalizedTitle,
    description: `검색 결과로 추가된 관심 작품 "${normalizedTitle}"입니다.`,
    imageSrc: null,
  }
}

function requestInterestsApi(path, options = {}) {
  return requestApi(path, {
    ...options,
    errorMessage: '관심사 요청을 처리하지 못했습니다.',
  })
}

export async function getInterestTypes(accessToken) {
  const data = await requestInterestsApi('/interests/types', {
    accessToken,
  })

  if (data?.items?.length) return data
  return { ...data, items: mockInterestTypes }
}

export async function getInterests({
  accessToken,
  interestType,
  genre = '전체',
  keyword = '',
}) {
  const searchParams = new URLSearchParams({ interestType, genre })
  const normalizedKeyword = keyword.trim()

  if (normalizedKeyword) {
    searchParams.set('keyword', normalizedKeyword)
  }

  const data = await requestInterestsApi(
    `/interests?${searchParams.toString()}`,
    { accessToken },
  )

  if (data?.items?.length) return data
  return {
    ...data,
    items: getMockInterests({ interestType, genre, keyword }),
  }
}

export function selectInterests(accessToken, interestIds) {
  return requestInterestsApi('/interests/select', {
    accessToken,
    body: JSON.stringify({ interestIds }),
    method: 'POST',
  })
}

export function createInterestTarget(accessToken, name) {
  return requestInterestsApi('/interests/targets', {
    accessToken,
    body: JSON.stringify({ name: name.trim() }),
    method: 'POST',
  })
}

export function getSelectedInterestTargets(accessToken) {
  return requestInterestsApi('/interest-targets', { accessToken })
}

export function syncSelectedInterestTargets(accessToken, interestIds) {
  return requestInterestsApi('/interest-targets', {
    accessToken,
    body: JSON.stringify({ interestIds }),
    method: 'PUT',
  })
}

export function getInterestTargetTitles(accessToken) {
  return requestInterestsApi('/interest-targets/titles', { accessToken })
}

export function getVisitHistory(accessToken) {
  return requestInterestsApi('/interest-items/urls', { accessToken })
}

export function getInterestItems(
  accessToken,
  { page = 1, size = 20, targetId } = {},
) {
  const searchParams = new URLSearchParams({ page: String(page), size: String(size) })

  if (targetId) searchParams.set('targetId', targetId)

  return requestInterestsApi(`/interest-items?${searchParams.toString()}`, {
    accessToken,
  })
}

export function getInterestItem(accessToken, interestItemId) {
  return requestInterestsApi(
    `/interest-items/${encodeURIComponent(interestItemId)}`,
    { accessToken },
  )
}
