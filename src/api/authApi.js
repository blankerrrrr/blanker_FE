import { ApiError, requestApi } from './apiClient.js'

export { ApiError }

export function loginRequest({ email, password }) {
  return requestApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function signupRequest({ email, password }) {
  return requestApi('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function refreshAccessToken() {
  return requestApi('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export function logoutRequest() {
  return requestApi('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export function deleteAccountRequest(accessToken) {
  return requestApi('/auth/me', {
    accessToken,
    method: 'DELETE',
  })
}

export function getCurrentUser(accessToken) {
  return requestApi('/auth/me', { accessToken })
}
