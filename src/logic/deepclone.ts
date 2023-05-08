const isComplexDataType = (obj: unknown) =>
  (typeof obj === 'object' || typeof obj === 'function')
  && (obj !== null)

/**
 *
 * @param {Object} obj
 * @param {WeakMap} hash
 * @returns
 */
export const deepClone = function (obj: any, hash = new WeakMap()) {
  if (hash.has(obj))
    return hash.get(obj)
  const type = [Date, RegExp, Set, Map, WeakMap, WeakSet]
  if (type.includes(obj.constructor))
    return new obj.constructor(obj)

  const allDesc = Object.getOwnPropertyDescriptors(obj)
  const cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
  hash.set(obj, cloneObj)

  for (const key of Reflect.ownKeys(obj)) {
    cloneObj[key]
      = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function')
        ? deepClone(obj[key], hash)
        : obj[key]
  }

  return cloneObj
}
