import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 60 })

export const getOrSet = async <T>(key: string, ttl: number, fetchFn: () => Promise<T>): Promise<T> => {
  const cached = cache.get<T>(key)

  if (cached !== undefined) {
    return cached
  }

  const result = await fetchFn()
  cache.set(key, result, ttl)
  return result
}

export const deleteCacheKey = (key: string): boolean => cache.del(key) > 0
