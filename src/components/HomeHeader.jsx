import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.svg";
import Icon from "./Icon.jsx";

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 10px;
`;

const Logo = styled.img`
  width: 176px;
  max-width: 54vw;
  height: auto;
`;

const SettingsLink = styled(Link)`
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  color: #111;
  border-radius: 50%;
`;

function HomeHeader() {
  return (
    <Header>
      <Logo alt="BLANKER" src={logo} />
      <SettingsLink aria-label="설정" to="/profile">
        <Icon name="settings" size={24} />
      </SettingsLink>
    </Header>
  );
}

export default HomeHeader;
