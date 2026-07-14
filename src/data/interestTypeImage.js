export function getInterestTypeImage(items, categoryId) {
  return items.find((item) => item.id === categoryId)?.imageUrl || null
}
