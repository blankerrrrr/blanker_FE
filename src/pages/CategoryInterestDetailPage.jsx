import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  createInterestTarget,
  getSelectedInterestTargets,
  syncSelectedInterestTargets,
} from "../api/interestsApi.js";
import logo from "../assets/logo.svg";
import { useAuth } from "../auth/useAuth.js";
import Button from "../components/Button.jsx";
import CategoryTypeButton from "../components/CategoryTypeButton.jsx";
import { getInterestCategoryConfig } from "../data/interestOnboarding.js";
import { getInterestTypeImage } from "../data/interestTypeImage.js";
import { useInterestTypes } from "../hooks/useInterestTypes.js";

const Page = styled.main`
  display: flex;
  width: min(100%, 402px);
  min-height: 100svh;
  flex-direction: column;
  margin: 0 auto;
  padding: 30px 20px 112px;
  background: #fff;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
`;

const SkipButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
`;

const Logo = styled.img`
  display: block;
  width: 176px;
  height: auto;
`;

const Description = styled.p`
  margin: 8px 0 10px;
  font-size: 16px;
  font-weight: 500;
`;

const Hero = styled.section`
  position: relative;
  display: flex;
  min-height: 238px;
  align-items: flex-end;
  padding: 16px;
  overflow: hidden;
  border: 1px solid #d8d8d8;
  background: #f8f8f8;
`;

const HeroImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 35%);
`;

const HeroTitle = styled.h1`
  position: relative;
  z-index: 1;
  margin: 0;
  color: ${({ $hasImage }) => ($hasImage ? "#fff" : "#000")};
  font-size: 22px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const SectionLabel = styled.p`
  margin: 0;
  font-size: 13px;
`;

const TypeScroller = styled.div`
  display: flex;
  gap: 10px;
  margin: 0 -20px;
  padding: 0 20px 4px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SensitivityInput = styled.input`
  appearance: none;
  width: 100%;
  height: 15px;
  margin: 0;
  border-radius: 999px;
  outline: none;
  background: linear-gradient(
    to right,
    #168bea 0 var(--range-progress),
    #f8f8f8 var(--range-progress) 100%
  );

  &::-webkit-slider-runnable-track {
    height: 15px;
    background: transparent;
  }

  &::-webkit-slider-thumb {
    width: 22px;
    height: 22px;
    margin-top: -4px;
    appearance: none;
    border: 1px solid #d8d8d8;
    border-radius: 50%;
    background: #fff;
  }

  &::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border: 1px solid #d8d8d8;
    border-radius: 50%;
    background: #fff;
  }
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 44px;
  overflow: hidden;
  border-radius: 15px;
`;

const SearchInput = styled.input`
  min-width: 0;
  height: 44px;
  padding: 0 14px;
  border: 0;
  outline: 0;
  font-size: 12px;
`;

const AddButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  border-left: 1px solid #d8d8d8;
  background: #fff;
  color: #777;
  font-size: 28px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Status = styled.p`
  margin: 6px 0 0;
  color: ${({ $error }) => ($error ? "#c62828" : "#777")};
  font-size: 12px;
`;

const InterestList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 16px;
`;

const InterestCard = styled.button`
  position: relative;
  width: 100%;
  min-height: 76px;
  padding: 12px;
  overflow: hidden;
  border: ${({ $selected }) =>
    $selected ? "2px solid #168bea" : "1px solid #d8d8d8"};
  border-radius: 15px;
  color: ${({ $hasImage }) => ($hasImage ? "#fff" : "#000")};
  background: #f8f8f8;
  text-align: left;
  cursor: pointer;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

const CardTitle = styled.h2`
  margin: 0 0 4px;
  font-size: 15px;
`;

const CardDescription = styled.p`
  margin: 0;
  font-size: 12px;
`;

const RegisteredBadge = styled.span`
  position: absolute;
  z-index: 2;
  top: 10px;
  right: 12px;
  padding: 3px 7px;
  border-radius: 999px;
  background: #168bea;
  color: #fff;
  font-size: 11px;
`;

const NextButton = styled(Button)`
  position: fixed;
  bottom: max(20px, env(safe-area-inset-bottom));
  left: 50%;
  z-index: 30;
  width: min(calc(100% - 40px), 362px);
  transform: translateX(-50%);
`;

function CategoryInterestDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId = "other" } = useParams();
  const { accessToken } = useAuth();
  const { items: interestTypes } = useInterestTypes();
  const config = getInterestCategoryConfig(categoryId);
  const heroImageUrl = getInterestTypeImage(interestTypes, categoryId);
  const isEditMode = location.pathname.startsWith("/interest/");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sensitivity, setSensitivity] = useState(50);
  const [query, setQuery] = useState("");
  const [createdTargets, setCreatedTargets] = useState([]);
  const [allSelectedTargets, setAllSelectedTargets] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadSelectedTargets() {
      if (!isEditMode) return;

      try {
        const data = await getSelectedInterestTargets(accessToken);
        if (!isActive) return;
        const targets = data?.items ?? [];
        setAllSelectedTargets(targets);
        setCreatedTargets(
          targets
            .filter((target) => target.interestType === config.label)
            .map((target) => ({
              ...target,
              name: target.title,
              keywords: target.genre ? [target.genre] : [],
            })),
        );
      } catch {
        if (isActive) setRequestError("선택한 관심사를 불러오지 못했습니다.");
      }
    }

    loadSelectedTargets();
    return () => {
      isActive = false;
    };
  }, [accessToken, config.label, isEditMode]);

  const toggleType = (type) => {
    setSelectedTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  };

  const handleCreateTarget = async (event) => {
    event.preventDefault();
    const name = query.trim();
    if (!name || isRequesting) return;

    setIsRequesting(true);
    setRequestError("");
    try {
      const target = await createInterestTarget(accessToken, name);
      setCreatedTargets((current) => [
        target,
        ...current.filter(
          (item) => item.interestTargetId !== target.interestTargetId,
        ),
      ]);
      setQuery("");
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleNext = async () => {
    if (!isEditMode) {
      if (createdTargets.length > 0) navigate("/home");
      return;
    }

    const otherTargets = allSelectedTargets.filter(
      (target) => target.interestType !== config.label,
    );
    const interestIds = [...otherTargets, ...createdTargets]
      .map((target) => target.interestId)
      .filter(Boolean);

    if (interestIds.length === 0) {
      setRequestError("관심사는 최소 1개 이상 선택해야 합니다.");
      return;
    }

    setIsRequesting(true);
    setRequestError("");
    try {
      await syncSelectedInterestTargets(accessToken, interestIds);
      navigate("/interest");
    } catch (error) {
      setRequestError(error.message);
      setIsRequesting(false);
    }
  };

  return (
    <Page>
      <TopBar>
        <SkipButton onClick={() => navigate(isEditMode ? "/interest" : "/home")} type="button">
          건너뛰기 <span aria-hidden="true">›</span>
        </SkipButton>
      </TopBar>
      <Logo alt="BLANKER" src={logo} />
      <Description>관심사를 선택해주세요!</Description>

      <Hero>
        {heroImageUrl && (
          <>
            <HeroImage
              alt={`${config.label} 대표 이미지`}
              src={heroImageUrl}
            />
            <Overlay />
          </>
        )}
        <HeroTitle $hasImage={Boolean(heroImageUrl)}>
          {config.label}
        </HeroTitle>
      </Hero>

      <Section>
        <SectionLabel>종류를 선택해주세요.</SectionLabel>
        <TypeScroller
          aria-label={`${config.label} 종류`}
          data-layout="horizontal-scroll"
        >
          {config.types.map((type) => (
            <CategoryTypeButton
              key={type}
              onClick={() => toggleType(type)}
              selected={selectedTypes.includes(type)}
            >
              {type}
            </CategoryTypeButton>
          ))}
        </TypeScroller>
      </Section>

      <Section>
        <SectionLabel as="label" htmlFor="interest-sensitivity">
          민감도 정도를 선택해주세요.
        </SectionLabel>
        <SensitivityInput
          id="interest-sensitivity"
          max="100"
          min="0"
          onChange={(event) => setSensitivity(Number(event.target.value))}
          style={{ "--range-progress": `${sensitivity}%` }}
          type="range"
          value={sensitivity}
        />
      </Section>

      <Section>
        <SectionLabel>
          현재 관심있는 {config.label}를 선택해주세요.
        </SectionLabel>
        <SearchForm onSubmit={handleCreateTarget}>
          <SearchInput
            onChange={(event) => setQuery(event.target.value)}
            placeholder={config.searchPlaceholder}
            value={query}
          />
          <AddButton
            aria-label={`관심 ${config.label} 추가`}
            disabled={!query.trim() || isRequesting}
            type="submit"
          >
            +
          </AddButton>
        </SearchForm>
        {requestError && (
          <Status $error role="alert">
            {requestError}
          </Status>
        )}
      </Section>

      <InterestList aria-live="polite">
        {createdTargets.map((item) => (
          <InterestCard
            $hasImage={false}
            key={item.interestTargetId}
            onClick={() =>
              setCreatedTargets((current) =>
                current.filter(
                  (target) =>
                    target.interestTargetId !== item.interestTargetId,
                ),
              )
            }
            type="button"
          >
            <RegisteredBadge>등록됨</RegisteredBadge>
            <CardContent>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>
                {item.keywords?.join(" · ") ||
                  "개인 관심사로 등록되었습니다."}
              </CardDescription>
            </CardContent>
          </InterestCard>
        ))}
      </InterestList>

      <NextButton
        disabled={!isEditMode && createdTargets.length === 0}
        onClick={handleNext}
        variant="light"
      >
        다음으로
      </NextButton>
    </Page>
  );
}

export default CategoryInterestDetailPage;
