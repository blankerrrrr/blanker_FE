import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.svg";

const SplashScreen = styled.main`
  display: grid;
  width: min(100%, 402px);
  min-height: 100vh;
  min-height: 100svh;
  place-items: center;
  margin: 0 auto;
  padding: 30px 20px;
  background: #fff;
`;

const Logo = styled.img`
  display: block;
  width: 177px;
  height: auto;
`;

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/onboarding", { replace: true });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <SplashScreen>
      <Logo alt="BLANKER" src={logo} />
    </SplashScreen>
  );
}

export default SplashPage;
