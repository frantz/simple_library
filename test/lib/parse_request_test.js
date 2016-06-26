'use strict'

const test = require('tape')

const parseRequest = require('../../lib/parse_request')

test('add "The Grapes of Wrath" "John Steinbeck"', (t) => {
  const results = parseRequest('add "The Grapes of Wrath" "John Steinbeck"')
  t.deepEqual(results, ['add', 'The Grapes of Wrath', 'John Steinbeck'])
  t.end()
})

test('show all', (t) => {
  const results = parseRequest('show all')
  t.deepEqual(results, ['show all'])
  t.end()
})

test('show unread', (t) => {
  const results = parseRequest('show unread')
  t.deepEqual(results, ['show unread'])
  t.end()
})

test('show all by "John Steinbeck"', (t) => {
  const results = parseRequest('show all by "John Steinbeck"')
  t.deepEqual(results, ['show all by', 'John Steinbeck'])
  t.end()
})

test('show unread by "John Steinbeck"', (t) => {
  const results = parseRequest(' show unread by "John Steinbeck"')
  t.deepEqual(results, ['show unread by', 'John Steinbeck'])
  t.end()
})

test('read "Moby Dick"', (t) => {
  const results = parseRequest('read   "Moby Dick"')
  t.deepEqual(results, ['read', 'Moby Dick'])
  t.end()
})

test(' quit ', (t) => {
  const results = parseRequest(' quit ')
  t.deepEqual(results, ['quit'])
  t.end()
})

test('when passing a non string parameter', (t) => {
  let error
  try {
    parseRequest(1234)
  } catch (err) {
    error = err
  }
  t.ok(error instanceof TypeError, 'it should throw a type error')
  t.end()
})
