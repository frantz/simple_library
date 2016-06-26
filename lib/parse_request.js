'use strict'

/**
 * Parse formatted string to command/params array
 *
 * @param {String} request formatted like: `whatever command "param1" "param2" "paramN" ...`
 * @returns {Array} [action, param1, param2, paramN, ...]
 * @throws {TypeError}
 */
function parseRequest (request) {
  if (typeof request !== 'string') {
    throw new TypeError('`request` must be a string`')
  }

  const firstDoubleQuotePosition = request.indexOf('"')

  const action = request.slice(0, firstDoubleQuotePosition < 0 ? undefined : firstDoubleQuotePosition).trim()

  let params = []
  if (firstDoubleQuotePosition > -1) {
    params = request.slice(firstDoubleQuotePosition)
    .split('"')
    .filter((s) => s.trim())
  }

  return [action, ...params]
}

module.exports = parseRequest
