import { Link } from 'react-router-dom'
import styled from 'styled-components'
import logo from '../assets/logo.svg'
import { useAuth } from '../auth/useAuth.js'

const StatePage = styled.main`
  display: grid;
  width: min(100%, 402px);
  min-height: 100vh;
  min-height: 100svh;
  place-items: center;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
`
const StateCard = styled.section`
  display: grid;
  width: 100%;
  justify-items: center;
  gap: 18px;
  padding: 32px 20px;
  border-radius: 18px;
  background: #f8f8f8;
  text-align: center;
`
const Logo = styled.img`
  width: 158px;
  height: auto;
`
const Title = styled.h1`
  margin: 0;
  font-size: 20px;
`
const Description = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`
const LoginLink = styled(Link)`
  display: grid;
  width: 100%;
  height: 48px;
  place-items: center;
  border: 1px solid #d8d8d8;
  border-radius: 14px;
  color: #111;
  background: #fff;
  font-weight: 700;
  text-decoration: none;
`

function RequireAuth({ children }) {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return (
      <StatePage>
        <StateCard aria-live="polite">로그인 상태를 확인하는 중입니다.</StateCard>
      </StatePage>
    )
  }

  if (!isAuthenticated) {
    return (
      <StatePage>
        <StateCard>
          <Logo alt="BLANKER" src={logo} />
          <Title>로그인이 필요합니다.</Title>
          <Description>이 페이지를 이용하려면 먼저 로그인해 주세요.</Description>
          <LoginLink to="/login">로그인하러 가기</LoginLink>
        </StateCard>
      </StatePage>
    )
  }

  return children
}

export default RequireAuth
