const koreanDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  day: 'numeric',
  month: 'long',
  timeZone: 'Asia/Seoul',
  year: 'numeric',
})

export function groupVisitHistory(items) {
  const groups = new Map()

  items.forEach((item) => {
    const date = koreanDateFormatter.format(new Date(item.discoveredAt))
    const group = groups.get(date) ?? { date, items: [] }
    group.items.push(item)
    groups.set(date, group)
  })

  return [...groups.values()]
}
