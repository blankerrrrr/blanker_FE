import { createBrowserRouter } from 'react-router-dom'
import RequireAuth from '../components/RequireAuth.jsx'
import BlankPage from '../pages/BlankPage.jsx'
import HomePage from '../pages/HomePage.jsx'
import InterestsOnboardingPage from '../pages/InterestsOnboardingPage.jsx'
import InterestPage from '../pages/InterestPage.jsx'
import CategoryInterestDetailPage from '../pages/CategoryInterestDetailPage.jsx'
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import OnboardingPage from '../pages/OnboardingPage.jsx'
import PostDetailPage from '../pages/PostDetailPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
import SearchPage from '../pages/SearchPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import SignUpPage from '../pages/SignUpPage.jsx'
import SplashPage from '../pages/SplashPage.jsx'
import VisitHistoryPage from '../pages/VisitHistoryPage.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SplashPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/onboarding/interests',
    element: <RequireAuth><InterestsOnboardingPage /></RequireAuth>,
  },
  {
    path: '/onboarding/interests/other',
    element: <RequireAuth><CategoryInterestDetailPage /></RequireAuth>,
  },
  {
    path: '/onboarding/interests/:categoryId',
    element: <RequireAuth><CategoryInterestDetailPage /></RequireAuth>,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/home',
    element: <RequireAuth><HomePage /></RequireAuth>,
  },
  {
    path: '/interest',
    element: <RequireAuth><InterestPage /></RequireAuth>,
  },
  {
    path: '/interest/other',
    element: <RequireAuth><CategoryInterestDetailPage /></RequireAuth>,
  },
  {
    path: '/interest/:categoryId',
    element: <RequireAuth><CategoryInterestDetailPage /></RequireAuth>,
  },
  {
    path: '/posts/:postId',
    element: <RequireAuth><PostDetailPage /></RequireAuth>,
  },
  {
    path: '/search',
    element: <RequireAuth><SearchPage /></RequireAuth>,
  },
  {
    path: '/blank',
    element: <RequireAuth><BlankPage /></RequireAuth>,
  },
  {
    path: '/profile',
    element: <RequireAuth><ProfilePage /></RequireAuth>,
  },
  {
    path: '/profile/history',
    element: <RequireAuth><VisitHistoryPage /></RequireAuth>,
  },
  {
    path: '/settings',
    element: <RequireAuth><SettingsPage /></RequireAuth>,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
