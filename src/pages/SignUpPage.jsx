import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signupRequest } from "../api/authApi.js";
import logo from "../assets/logo.svg";
import signupBackground from "../assets/signup-bg.svg";
import { useAuth } from "../auth/useAuth.js";
import BackButton from "../components/BackButton.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

const SignUpScreen = styled.main`
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

const SignUpForm = styled.form`
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
  display: flex;
  min-height: 18px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ExistingAccountLink = styled(Link)`
  order: 2;
  flex: 0 0 auto;
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
  order: 1;
  min-width: 0;
  margin: 0;
  color: #c62828;
  font-size: 12px;
  text-align: left;
`;

const SubmitButton = styled(Button)`
  position: relative;
  z-index: 4;
  margin-top: auto;
`;

const errorMessages = {
  400: "비밀번호 정책을 확인해 주세요.",
  409: "이미 가입된 이메일입니다.",
};

function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack =
    step === "password"
      ? () => {
          setError("");
          setStep("email");
        }
      : undefined;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (step === "email") {
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
        setError("올바른 이메일을 입력해 주세요.");
        return;
      }

      setError("");
      setStep("password");
      return;
    }

    if (!password || !passwordConfirmation) {
      setError("비밀번호와 비밀번호 확인을 입력해 주세요.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const credentials = { email: email.trim(), password };
      await signupRequest(credentials);
      await login(credentials);
      navigate("/onboarding/interests", { replace: true });
    } catch (requestError) {
      setError(
        errorMessages[requestError.status] ??
          "회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SignUpScreen>
      <PageBackground alt="" aria-hidden="true" src={signupBackground} />
      <Header>
        <BackButton onClick={handleBack} />
        <Welcome>WELCOME TO</Welcome>
        <Logo alt="BLANKER" src={logo} />
      </Header>

      <SignUpForm noValidate onSubmit={handleSubmit}>
        <Fields>
          {step === "email" ? (
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
          ) : (
            <>
              <Input
                aria-label="비밀번호"
                autoComplete="new-password"
                hasError={Boolean(error)}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호를 입력하세요."
                type="password"
                value={password}
                variant="auth"
              />
              <Input
                aria-label="비밀번호 확인"
                autoComplete="new-password"
                hasError={Boolean(error)}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                placeholder="비밀번호를 확인하세요."
                type="password"
                value={passwordConfirmation}
                variant="auth"
              />
            </>
          )}
        </Fields>

        <FeedbackRow data-layout="form-feedback">
          {step === "email" && (
            <ExistingAccountLink to="/login">
              이미 계정이 있으신가요?
            </ExistingAccountLink>
          )}

          <ErrorMessage aria-live="polite" role={error ? "alert" : undefined}>
            {error}
          </ErrorMessage>
        </FeedbackRow>

        <SubmitButton disabled={isSubmitting} type="submit">
          {isSubmitting ? "처리 중..." : "다음으로"}
        </SubmitButton>
      </SignUpForm>
    </SignUpScreen>
  );
}

export default SignUpPage;
