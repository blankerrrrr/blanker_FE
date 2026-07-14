import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import logo from '../assets/logo.svg'
import onboardBackground from '../assets/onboard_bg.svg'
import Button from '../components/Button.jsx'

const OnboardingScreen = styled.main`
  position: relative;
  display: flex;
  width: min(100%, 402px);
  min-height: 100vh;
  min-height: 100svh;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  padding: 30px 20px;
  overflow: hidden;
  background: #fff;
  isolation: isolate;
`

const Header = styled.header`
  position: relative;
  z-index: 2;
`

const Welcome = styled.h1`
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.7px;
`

const Logo = styled.img`
  display: block;
  width: 176px;
  height: auto;
`

const PageBackground = styled.img`
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
`

const Actions = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 15px;
`

function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <OnboardingScreen>
      <PageBackground alt="" aria-hidden="true" src={onboardBackground} />
      <Header>
        <Welcome>WELCOME TO</Welcome>
        <Logo alt="BLANKER" src={logo} />
      </Header>

      <Actions>
        <Button onClick={() => navigate('/login')} variant="light">
          로그인
        </Button>
        <Button onClick={() => navigate('/signup')} variant="light">
          회원가입
        </Button>
      </Actions>
    </OnboardingScreen>
  )
}

export default OnboardingPage
