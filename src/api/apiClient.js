export class ApiError extends Error {
  constructor(message, { code, status } = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(
  /\/+$/,
  '',
)

function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${apiBaseUrl}${normalizedPath}`
}

export async function requestApi(
  path,
  { accessToken, errorMessage = '요청을 처리하지 못했습니다.', ...options } = {},
) {
  const headers = new Headers(options.headers)

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    credentials: 'include',
    headers,
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(payload?.error?.message ?? errorMessage, {
      code: payload?.error?.code,
      status: response.status,
    })
  }

  return payload?.data
}
