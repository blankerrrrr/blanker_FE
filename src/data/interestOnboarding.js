export const interestCategoryConfigs = {
  movie: {
    label: '영화',
    types: ['액션', '코미디', '로맨스', '공포', '스릴러', 'SF', '판타지', '다큐멘터리'],
    searchPlaceholder: '관심 있는 영화의 제목을 입력해 주세요.',
    recommendations: [],
  },
  novel: {
    label: '소설',
    types: ['판타지', '로맨스', '미스터리', 'SF', '역사', '에세이'],
    searchPlaceholder: '관심 있는 소설의 제목을 입력해 주세요.',
    recommendations: [],
  },
  drama: {
    label: '드라마',
    types: ['로맨스', '코미디', '스릴러', '액션', '사극'],
    searchPlaceholder: '관심 있는 드라마의 제목을 입력해 주세요.',
    recommendations: [],
  },
  animation: {
    label: '애니메이션',
    types: ['모험', '판타지', '코미디', '드라마', '가족'],
    searchPlaceholder: '관심 있는 애니메이션의 제목을 입력해 주세요.',
    recommendations: [],
  },
  game: {
    label: '게임',
    types: ['RPG', '액션', '시뮬레이션', '전략', '퍼즐'],
    searchPlaceholder: '관심 있는 게임의 제목을 입력해 주세요.',
    recommendations: [],
  },
  webtoon: {
    label: '웹툰',
    types: ['로맨스', '판타지', '액션', '일상', '스릴러'],
    searchPlaceholder: '관심 있는 웹툰의 제목을 입력해 주세요.',
    recommendations: [],
  },
  musical: {
    label: '뮤지컬',
    types: ['창작', '라이선스', '대극장', '소극장'],
    searchPlaceholder: '관심 있는 뮤지컬의 제목을 입력해 주세요.',
    recommendations: [],
  },
  other: {
    label: '기타',
    types: [],
    searchPlaceholder: '관심 있는 주제를 입력해 주세요.',
    recommendations: [],
  },
}

export function getInterestCategoryConfig(categoryId) {
  return interestCategoryConfigs[categoryId] ?? interestCategoryConfigs.other
}
