export function spinReward(): number{
  // simple distribution: 60% = 0, 30% = 1, 10% = 2
  const r = Math.random()
  if (r < 0.6) return 0
  if (r < 0.9) return 1
  return 2
}
