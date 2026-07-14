const typeDefinitions = [
  {
    id: 'movie',
    name: '영화',
    colors: ['#17233f', '#c46542'],
    items: [
      ['기생충', '드라마'],
      ['극한직업', '코미디'],
      ['서울의 봄', '드라마'],
    ],
  },
  {
    id: 'novel',
    name: '소설',
    colors: ['#8f334d', '#e7a66b'],
    items: [
      ['채식주의자', '문학'],
      ['불편한 편의점', '드라마'],
      ['달러구트 꿈 백화점', '판타지'],
    ],
  },
  {
    id: 'drama',
    name: '드라마',
    colors: ['#6f4f3c', '#d6a67d'],
    items: [
      ['미생', '오피스'],
      ['나의 아저씨', '휴먼'],
      ['시그널', '스릴러'],
    ],
  },
  {
    id: 'animation',
    name: '애니메이션',
    colors: ['#5f2f8e', '#ef6a9b'],
    items: [
      ['스파이더맨: 어크로스 더 유니버스', '액션'],
      ['인사이드 아웃', '판타지'],
      ['귀멸의 칼날', '액션'],
    ],
  },
  {
    id: 'game',
    name: '게임',
    colors: ['#167b63', '#a6d96a'],
    items: [
      ['젤다의 전설', '어드벤처'],
      ['스타듀 밸리', '시뮬레이션'],
      ['리그 오브 레전드', 'MOBA'],
    ],
  },
  {
    id: 'webtoon',
    name: '웹툰',
    colors: ['#266b87', '#7bc4d6'],
    items: [
      ['유미의 세포들', '로맨스'],
      ['나 혼자만 레벨업', '액션'],
      ['미생', '드라마'],
    ],
  },
  {
    id: 'musical',
    name: '뮤지컬',
    colors: ['#8b1724', '#e35d3f'],
    items: [
      ['영웅', '창작'],
      ['지킬 앤 하이드', '라이선스'],
      ['레베카', '라이선스'],
    ],
  },
  {
    id: 'other',
    name: '기타',
    colors: ['#70573f', '#d9a35f'],
    items: [
      ['국립현대미술관 전시', '전시'],
      ['서울 재즈 페스티벌', '공연'],
      ['독립영화제', '영화제'],
    ],
  },
]

function createMockImage(label, [startColor, endColor]) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="720" height="540" viewBox="0 0 720 540">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${startColor}" />
          <stop offset="1" stop-color="${endColor}" />
        </linearGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="28" /></filter>
      </defs>
      <rect width="720" height="540" fill="url(#background)" />
      <circle cx="170" cy="150" r="120" fill="#fff" opacity=".16" filter="url(#blur)" />
      <circle cx="560" cy="390" r="150" fill="#000" opacity=".18" filter="url(#blur)" />
      <text x="360" y="285" fill="#fff" font-family="sans-serif" font-size="42" font-weight="700" text-anchor="middle">${label}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const mockInterestTypes = typeDefinitions.map((type) => ({
  name: type.name,
  imageUrl: createMockImage(type.name, type.colors),
}))

export const mockInterests = typeDefinitions.flatMap((type) => {
  const typeImageUrl = createMockImage(type.name, type.colors)

  return type.items.map(([title, genre], index) => ({
    interestId: `mock-${type.id}-${index + 1}`,
    interestType: type.name,
    interestTypeImageUrl: typeImageUrl,
    title,
    genre,
    imageUrl: createMockImage(title, type.colors),
    createdAt: '2026-07-14T05:00:00Z',
    updatedAt: '2026-07-14T05:00:00Z',
  }))
})

export function getMockInterests({
  interestType,
  genre = '전체',
  keyword = '',
}) {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase()

  return mockInterests.filter((item) => {
    if (item.interestType !== interestType) return false
    if (normalizedKeyword) {
      return item.title.toLocaleLowerCase().includes(normalizedKeyword)
    }
    return genre === '전체' || item.genre === genre
  })
}
