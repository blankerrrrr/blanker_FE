const baseRecommendations = {
  movie: [
    {
      id: 'movie-extreme-job',
      title: '극한 직업',
      description: '해체 위기의 마약반이 치킨집을 위장 창업하며 벌어지는 코미디 영화입니다.',
      imageSrc: null,
    },
    {
      id: 'movie-seoul-spring',
      title: '서울의 봄',
      description: '1979년 서울을 배경으로 권력을 둘러싼 긴박한 시간을 그린 영화입니다.',
      imageSrc: null,
    },
  ],
}

export const interestCategoryConfigs = {
  movie: {
    label: '영화',
    types: ['액션', '코미디', '로맨스', '공포', '스릴러', 'SF', '판타지', '다큐멘터리'],
    searchPlaceholder: '관심있는 영화의 제목을 입력해주세요.',
    recommendations: baseRecommendations.movie,
    heroImageSrc: null,
  },
  novel: {
    label: '소설',
    types: ['판타지', '로맨스', '미스터리', 'SF', '역사', '에세이'],
    searchPlaceholder: '관심있는 소설의 제목을 입력해주세요.',
    recommendations: [],
    heroImageSrc: null,
  },
  drama: {
    label: '드라마',
    types: ['로맨스', '코미디', '스릴러', '액션', '시대극'],
    searchPlaceholder: '관심있는 드라마의 제목을 입력해주세요.',
    recommendations: [],
    heroImageSrc: null,
  },
  animation: {
    label: '애니메이션',
    types: ['모험', '판타지', '코미디', '드라마', '가족'],
    searchPlaceholder: '관심있는 애니메이션의 제목을 입력해주세요.',
    recommendations: [],
    heroImageSrc: null,
  },
  game: {
    label: '게임',
    types: ['RPG', '액션', '시뮬레이션', '전략', '퍼즐'],
    searchPlaceholder: '관심있는 게임의 제목을 입력해주세요.',
    recommendations: [],
    heroImageSrc: null,
  },
  webtoon: {
    label: '웹툰',
    types: ['로맨스', '판타지', '액션', '일상', '스릴러'],
    searchPlaceholder: '관심있는 웹툰의 제목을 입력해주세요.',
    recommendations: [],
    heroImageSrc: null,
  },
  musical: {
    label: '뮤지컬',
    types: ['창작', '라이선스', '대극장', '소극장'],
    searchPlaceholder: '관심있는 뮤지컬의 제목을 입력해주세요.',
    recommendations: [],
    heroImageSrc: null,
  },
  other: {
    label: '기타',
    types: ['공연', '전시', '음악', '도서', '영상'],
    searchPlaceholder: '관심있는 주제를 입력해주세요.',
    recommendations: [
      {
        id: 'other-independent-exhibition',
        title: '독립 전시',
        description: '새로운 작가와 다양한 표현 방식을 만날 수 있는 관심 주제입니다.',
        imageSrc: null,
      },
      {
        id: 'other-live-performance',
        title: '라이브 공연',
        description: '현장에서 음악과 무대를 함께 즐길 수 있는 관심 주제입니다.',
        imageSrc: null,
      },
    ],
    heroImageSrc: null,
  },
}

export function getInterestCategoryConfig(categoryId) {
  return interestCategoryConfigs[categoryId] ?? interestCategoryConfigs.other
}
