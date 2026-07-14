import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../auth/useAuth.js'
import BottomTabBar from '../components/BottomTabBar.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import HomeHeader from '../components/HomeHeader.jsx'
import Icon from '../components/Icon.jsx'

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
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 20px;
`

const WelcomeRow = styled.div`
  display: flex;
  min-height: 28px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const WelcomeTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
`

const UserName = styled.span`
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const MenuGroup = styled.section`
  overflow: hidden;
  border-radius: 14px;
  background: ${({ $danger }) => ($danger ? '#ffdede' : '#f7f7f7')};
`

const MenuButton = styled.button`
  display: flex;
  width: 100%;
  min-height: 42px;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border: 0;
  color: ${({ $danger }) => ($danger ? '#ff4b55' : '#a5a5a5')};
  background: transparent;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -3px;
  }
`

const MenuLink = styled(Link)`
  display: flex;
  min-height: 42px;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  color: #a5a5a5;
  font-size: 14px;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid #555;
    outline-offset: -3px;
  }
`

const ErrorMessage = styled.p`
  margin: -6px 4px 0;
  color: #c62828;
  font-size: 12px;
`

function ProfilePage() {
  const navigate = useNavigate()
  const { deleteAccount, logout, user } = useAuth()
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const userName = user?.name ?? user?.email ?? '사용자'

  const handleLogout = async () => {
    setError('')
    setIsLoggingOut(true)

    try {
      await logout()
      navigate('/login', { replace: true })
    } catch {
      setError('로그아웃하지 못했습니다. 다시 시도해 주세요.')
      setIsLoggingOut(false)
    }
  }

  const closeDeleteModal = () => {
    setDeleteError('')
    setIsDeleteModalOpen(false)
  }

  const handleDeleteAccount = async () => {
    setDeleteError('')
    setIsDeleting(true)

    try {
      await deleteAccount()
      navigate('/login', { replace: true })
    } catch {
      setDeleteError('계정을 삭제하지 못했습니다. 다시 시도해 주세요.')
      setIsDeleting(false)
    }
  }

  return (
    <Page>
      <FixedHeader data-layout="fixed-profile-header">
        <HomeHeader />
      </FixedHeader>

      <Content>
        <WelcomeRow>
          <WelcomeTitle>환영합니다.</WelcomeTitle>
          <UserName>{userName}님</UserName>
        </WelcomeRow>

        <MenuGroup $danger aria-label="계정 관리">
          <MenuButton
            $danger
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
          >
            <Icon name="logout" size={17} />
            {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
          </MenuButton>
          <MenuButton
            $danger
            onClick={() => setIsDeleteModalOpen(true)}
            type="button"
          >
            <Icon name="trash" size={17} />
            계정삭제
          </MenuButton>
        </MenuGroup>

        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

        <MenuGroup aria-label="활동 기록">
          <MenuButton type="button">
            <Icon name="history" size={17} />
            검색 기록
          </MenuButton>
          <MenuLink to="/profile/history">
            <Icon name="history" size={17} />
            방문 기록
          </MenuLink>
        </MenuGroup>

        <MenuGroup aria-label="관심사 관리">
          <MenuLink to="/interest">
            <Icon name="interest" size={17} />
            관심사
          </MenuLink>
        </MenuGroup>
      </Content>

      <BottomTabBar />
      <ConfirmModal
        description="삭제된 계정과 데이터는 복구할 수 없습니다."
        error={deleteError}
        isSubmitting={isDeleting}
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteAccount}
        open={isDeleteModalOpen}
        title="계정을 삭제하시겠습니까?"
      />
    </Page>
  )
}

export default ProfilePage
