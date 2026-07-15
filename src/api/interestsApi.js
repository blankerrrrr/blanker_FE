import { requestApi } from './apiClient.js'

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

  if (Array.isArray(data)) return { items: data }
  if (Array.isArray(data?.items)) return data
  return { items: [] }
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

  if (Array.isArray(data?.items)) return data
  return { items: [] }
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

export function getSelectedInterestTypes(accessToken) {
  return requestInterestsApi('/interest-targets/types', { accessToken })
}

export function getVisitHistory(accessToken) {
  return requestInterestsApi('/interest-items/urls', { accessToken })
}

export function getBlockedItems(
  accessToken,
  { interestTargetId, interestType, type } = {},
) {
  const searchParams = new URLSearchParams()

  if (interestTargetId) searchParams.set('interestTargetId', interestTargetId)
  if (interestType) searchParams.set('interestType', interestType)
  if (type) searchParams.set('type', type)

  const query = searchParams.toString()
  return requestInterestsApi(`/blocked-items${query ? `?${query}` : ''}`, {
    accessToken,
  })
}

export function getInterestItems(
  accessToken,
  { interestType, keyword, page = 1, size = 20, targetId } = {},
) {
  const searchParams = new URLSearchParams({ page: String(page), size: String(size) })

  if (targetId) searchParams.set('targetId', targetId)
  if (interestType) searchParams.set('interestType', interestType)
  if (keyword?.trim()) searchParams.set('keyword', keyword.trim())

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
