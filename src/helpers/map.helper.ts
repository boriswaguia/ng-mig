/**
 * Convert a `Map` to a standard
 * JS object recursively.
 *
 * https://gist.github.com/davemackintosh/3b9c446e8681f7bbe7c5
 *
 * @param {Map} map to convert.
 * @returns {Object} converted object.
 */
const map_to_object = (map: Map<any, any>) => {
  const out = Object.create(null)
  map.forEach((value, key) => {
    if (value instanceof Map) {
      out[key] = map_to_object(value)
    }
    else {
      out[key] = value
    }
  })
  return out
}

export { map_to_object }
