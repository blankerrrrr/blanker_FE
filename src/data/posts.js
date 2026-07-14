import landscapeImage from '../assets/sample-landscape.svg'

export const categories = [
  '전체',
  '대덕소프트웨어마이스터고등학교',
  '프로그래밍',
]

export const posts = [
  {
    id: 'post-1',
    title: '바다에서 찾은 영감',
    description: '익숙한 풍경을 새롭게 바라보는 기록',
    image: landscapeImage,
    size: 'hero',
    school: '대덕소프트웨어마이스터고등학교',
    author: '김블랭커',
    date: '2026년 12월 13일',
    tags: ['대전광역시', '대덕구', '학교생활'],
    sections: [
      {
        heading: '페이지 요약',
        paragraphs: [
          '반복되는 일상에서 잠시 벗어나 바다를 걸었습니다. 하늘과 수평선이 만나는 장면을 바라보며 새로운 아이디어를 기록했습니다.',
          '사진과 짧은 메모를 함께 남기니 그날의 공기와 생각이 더 오래 기억에 머물렀습니다.',
        ],
      },
      {
        heading: '내 메모',
        paragraphs: [
          '좋은 결과는 거창한 시작보다 꾸준한 관찰에서 나옵니다. 익숙한 풍경도 시선을 바꾸면 전혀 다른 이야기가 됩니다.',
          '이번 기록을 다음 프로젝트의 색상과 화면 구성에 활용해 보려고 합니다.',
        ],
      },
    ],
    relatedLinks: [
      { title: '사진으로 기록하는 하루', url: 'https://example.com/record' },
      { title: '관찰에서 아이디어 찾기', url: 'https://example.com/ideas' },
      { title: 'BLANKER 글쓰기 가이드', url: 'https://example.com/guide' },
    ],
  },
  {
    id: 'post-2',
    title: '파도와 산책',
    description: '조용한 오후의 해변',
    image: landscapeImage,
    size: 'tall',
  },
  {
    id: 'post-3',
    title: '구름의 모양',
    description: '흐르는 순간을 담다',
    image: landscapeImage,
    size: 'small',
  },
  {
    id: 'post-4',
    title: '수평선 너머',
    description: '오늘의 시선',
    image: landscapeImage,
    size: 'small',
  },
  {
    id: 'post-5',
    title: '해변의 하루',
    description: '빛과 바람이 머문 자리',
    image: landscapeImage,
    size: 'hero',
  },
]

export function getPostById(postId) {
  return posts.find((post) => post.id === postId)
}
