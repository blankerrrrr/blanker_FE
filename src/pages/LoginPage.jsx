import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.svg";
import signinBackground from "../assets/signin-bg.svg";
import { useAuth } from "../auth/useAuth.js";
import BackButton from "../components/BackButton.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

const LoginScreen = styled.main`
  position: relative;
  display: flex;
  width: min(100%, 402px);
  min-height: 100vh;
  min-height: 100svh;
  flex-direction: column;
  margin: 0 auto;
  padding: 30px 20px;
  overflow: hidden;
  background: #fff;
  isolation: isolate;
`;

const Header = styled.header`
  position: relative;
  z-index: 2;
`;

const Welcome = styled.h1`
  margin: 12px 0 8px;
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.7px;
`;

const Logo = styled.img`
  display: block;
  width: 176px;
  height: auto;
`;

const PageBackground = styled.img`
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
`;

const LoginForm = styled.form`
  position: relative;
  z-index: 2;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 15px;
  padding-top: 48px;
`;

const Fields = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FeedbackRow = styled.div`
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  min-height: 18px;
  align-items: center;
  gap: 12px;
`;

const FeedbackMessage = styled.div`
  min-width: 0;
`;

const ForgotPasswordLink = styled(Link)`
  color: #000;
  font-size: 12px;
  text-decoration: none;
  white-space: nowrap;

  &:focus-visible {
    outline: 2px solid #333;
    outline-offset: 3px;
    border-radius: 2px;
  }
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: #c62828;
  font-size: 12px;
  text-align: left;

  &:empty {
    display: none;
  }
`;

const SuccessMessage = styled.p`
  margin: 0;
  color: #2e7d32;
  font-size: 12px;
  text-align: left;

  &:empty {
    display: none;
  }
`;

const LoginButton = styled(Button)`
  position: relative;
  z-index: 4;
  margin-top: auto;
`;

const errorMessages = {
  401: "이메일 또는 비밀번호를 확인해 주세요.",
  403: "비활성화된 계정입니다.",
};

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      navigate("/home", { replace: true });
    } catch (requestError) {
      setError(
        errorMessages[requestError.status] ??
          "로그인 실패. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginScreen>
      <PageBackground alt="" aria-hidden="true" src={signinBackground} />
      <Header>
        <BackButton />
        <Welcome>WELCOME TO</Welcome>
        <Logo alt="BLANKER" src={logo} />
      </Header>

      <LoginForm onSubmit={handleSubmit}>
        <Fields>
          <Input
            aria-label="이메일"
            autoComplete="email"
            hasError={Boolean(error)}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="이메일을 입력하세요."
            type="email"
            value={email}
            variant="auth"
          />
          <Input
            aria-label="비밀번호"
            autoComplete="current-password"
            hasError={Boolean(error)}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력하세요."
            type="password"
            value={password}
            variant="auth"
          />
        </Fields>

        <FeedbackRow data-layout="form-feedback">
          <FeedbackMessage data-layout="feedback-message">
            <SuccessMessage aria-live="polite">
              {location.state?.message ?? ""}
            </SuccessMessage>

            <ErrorMessage aria-live="polite" role={error ? "alert" : undefined}>
              {error}
            </ErrorMessage>
          </FeedbackMessage>

          <ForgotPasswordLink to="/forgot-password">
            비밀번호를 잊으셨나요?
          </ForgotPasswordLink>
        </FeedbackRow>

        <LoginButton disabled={isSubmitting} type="submit">
          {isSubmitting ? "로그인 중..." : "로그인"}
        </LoginButton>
      </LoginForm>
    </LoginScreen>
  );
}

export default LoginPage;
