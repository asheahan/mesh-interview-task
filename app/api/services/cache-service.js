/**
 * Module for mock cache service
 * Actual implementation may involve a Redis instance
 */

let cache = {}

exports.set = (key, value) => {
  cache[key] = value
}

exports.get = (key) => {
  if (cache.hasOwnProperty(key)) {
    return cache[key]
  }
}
