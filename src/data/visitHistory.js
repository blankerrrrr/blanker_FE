const koreanDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  day: 'numeric',
  month: 'long',
  timeZone: 'Asia/Seoul',
  year: 'numeric',
})

function formatVisitDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return String(value)
  return koreanDateFormatter.format(date)
}

export function groupVisitHistory(items) {
  const groups = new Map()
  const sortedItems = [...items].sort(
    (left, right) =>
      new Date(right.discoveredAt).getTime() -
      new Date(left.discoveredAt).getTime(),
  )

  sortedItems.forEach((item) => {
    const date = formatVisitDate(item.discoveredAt)
    const group = groups.get(date) ?? { date, items: [] }
    group.items.push(item)
    groups.set(date, group)
  })

  return [...groups.values()]
}

export function normalizeVisitHistory(data) {
  if (Array.isArray(data?.items)) {
    return groupVisitHistory(data.items)
  }

  if (!Array.isArray(data)) return []

  if (data.every((entry) => entry?.discoveredAt)) {
    return groupVisitHistory(data)
  }

  return data.flatMap((entry) =>
    Object.entries(entry ?? {}).map(([date, items]) => ({
      date: formatVisitDate(date),
      items: Array.isArray(items) ? items : [],
    })),
  )
}
