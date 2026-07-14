import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Icon from "./Icon.jsx";

const StyledTabBar = styled.nav`
  position: fixed;
  bottom: max(16px, env(safe-area-inset-bottom));
  left: 50%;
  z-index: 30;
  display: flex;
  width: min(calc(100% - 40px), 362px);
  min-height: 64px;
  align-items: center;
  justify-content: space-around;
  padding: 8px 12px;
  border-radius: 30px;
  background: #fff;
  box-shadow: 0 2px 10px rgb(0 0 0 / 8%);
  transform: translateX(-50%);
`;

const StyledTabLink = styled(NavLink)`
  display: inline-flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #a1a1a1;
  text-decoration: none;

  &[aria-current="page"] {
    color: #000;
  }

  &:focus-visible {
    outline: 2px solid #333;
    outline-offset: 2px;
  }
`;

const defaultTabs = [
  { to: "/home", icon: "home", label: "홈" },
  { to: "/search", icon: "search", label: "검색" },
  { to: "/interest", icon: "id-card", label: "프로필 카드" },
  { to: "/profile", icon: "user", label: "프로필" },
];

function BottomTabBar({ tabs = defaultTabs, className = "" }) {
  return (
    <StyledTabBar aria-label="주요 메뉴" className={className}>
      {tabs.map((tab) => (
        <StyledTabLink aria-label={tab.label} key={tab.to} to={tab.to}>
          <Icon name={tab.icon} />
        </StyledTabLink>
      ))}
    </StyledTabBar>
  );
}

export default BottomTabBar;
