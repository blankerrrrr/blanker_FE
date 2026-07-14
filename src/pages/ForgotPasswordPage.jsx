import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import signinBackground from "../assets/signin-bg.svg";
import BackButton from "../components/BackButton.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

const Screen = styled.main`
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

const Header = styled.header`
  position: relative;
  z-index: 2;
`;

const Title = styled.h1`
  margin: 42px 0 10px;
  font-size: 30px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.8px;
`;

const Description = styled.p`
  max-width: 300px;
  color: #555;
  font-size: 14px;
  line-height: 1.55;
  word-break: keep-all;
`;

const Form = styled.form`
  position: relative;
  z-index: 2;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-top: 46px;
`;

const ErrorMessage = styled.p`
  min-height: 18px;
  margin: 10px 4px 0;
  color: #c62828;
  font-size: 12px;
`;

const SubmitButton = styled(Button)`
  margin-top: auto;
`;

const Confirmation = styled.section`
  position: relative;
  z-index: 2;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-top: 78px;
`;

const ConfirmationIcon = styled.div`
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  margin-bottom: 22px;
  border-radius: 50%;
  color: #fff;
  background: #111;
  font-size: 25px;
  font-weight: 700;
`;

const ConfirmationTitle = styled.h1`
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.7px;
`;

const ConfirmationText = styled.p`
  color: #555;
  font-size: 14px;
  line-height: 1.6;
`;

const EmailAddress = styled.strong`
  display: block;
  margin-top: 4px;
  color: #111;
  font-weight: 700;
  overflow-wrap: anywhere;
`;

const LoginLink = styled(Link)`
  display: inline-flex;
  width: 100%;
  height: 53px;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  border: 1px solid #d8d8d8;
  border-radius: 15px;
  color: #000;
  background: #f8f8f8;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    filter: brightness(0.96);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgb(0 0 0 / 18%);
  }
`;

const emailPattern = /^\S+@\S+\.\S+$/;

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!emailPattern.test(normalizedEmail)) {
      setError("올바른 이메일을 입력해 주세요.");
      return;
    }

    setError("");
    setSubmittedEmail(normalizedEmail);
  };

  return (
    <Screen>
      <PageBackground alt="" aria-hidden="true" src={signinBackground} />
      <Header>
        <BackButton />
        {!submittedEmail && (
          <>
            <Title>비밀번호 찾기</Title>
            <Description>
              가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드려요.
            </Description>
          </>
        )}
      </Header>

      {submittedEmail ? (
        <Confirmation aria-live="polite">
          <ConfirmationIcon aria-hidden="true">✓</ConfirmationIcon>
          <ConfirmationTitle>이메일을 확인해 주세요</ConfirmationTitle>
          <ConfirmationText>
            비밀번호 재설정 링크를 보냈습니다.
            <EmailAddress>{submittedEmail}</EmailAddress>
          </ConfirmationText>
          <LoginLink to="/login">로그인으로 돌아가기</LoginLink>
        </Confirmation>
      ) : (
        <Form noValidate onSubmit={handleSubmit}>
          <Input
            aria-label="이메일"
            autoComplete="email"
            hasError={Boolean(error)}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError("");
            }}
            placeholder="이메일을 입력하세요"
            type="email"
            value={email}
            variant="auth"
          />
          <ErrorMessage aria-live="polite" role={error ? "alert" : undefined}>
            {error}
          </ErrorMessage>
          <SubmitButton type="submit">재설정 링크 전송</SubmitButton>
        </Form>
      )}
    </Screen>
  );
}

export default ForgotPasswordPage;
