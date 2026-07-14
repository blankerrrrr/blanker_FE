export function normalizeBlockedItems(data) {
  if (!Array.isArray(data)) return []

  return data.flatMap((entry) =>
    Object.entries(entry ?? {}).map(([title, items]) => ({
      title,
      items: Array.isArray(items) ? items : [],
    })),
  )
}

export function filterBlockedItemGroups(groups, keyword) {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase()
  if (!normalizedKeyword) return groups

  return groups.reduce((filteredGroups, group) => {
    const titleMatches = group.title
      .toLocaleLowerCase()
      .includes(normalizedKeyword)
    const items = group.items.filter((item) =>
      [
        item.summary,
        item.sourceUrl,
        ...(item.categories ?? []),
        ...(item.relatedTopics ?? []),
      ].some((value) =>
        String(value ?? '').toLocaleLowerCase().includes(normalizedKeyword),
      ),
    )

    if (titleMatches) {
      filteredGroups.push(group)
    } else if (items.length) {
      filteredGroups.push({ ...group, items })
    }

    return filteredGroups
  }, [])
}
