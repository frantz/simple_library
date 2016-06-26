'use strict'

const test = require('tape')
const bookStoreFactory = require('../../lib/book_store')
const {
  DuplicateError,
  NotFoundError
} = require('../../lib/errors')

function addAllBooks (bookStore) {
  bookStore.add({
    title: 'Moby Dick',
    author: 'Herman Melville'
  })

  bookStore.add({
    title: 'The Grapes of Wrath',
    author: 'John Steinbeck'
  })

  bookStore.add({
    title: 'Of Mice and Men',
    author: 'John Steinbeck'
  })
}

test('When adding books with different titles and displaying books list', (t) => {
  const bookStore = bookStoreFactory()

  addAllBooks(bookStore)

  const list = bookStore.show()
  // ensure books list order for tests
  const listOrderedByTitle = list.sort()

  t.equal(listOrderedByTitle.length, 3, 'it should return an array of 3 book descriptions')
  t.equal(listOrderedByTitle[0],
    '"Moby Dick" by Herman Melville (unread)', '1st book description should be correctly formatted')
  t.equal(listOrderedByTitle[1],
    '"Of Mice and Men" by John Steinbeck (unread)', '2nd book description should be correctly formatted')
  t.equal(listOrderedByTitle[2],
    '"The Grapes of Wrath" by John Steinbeck (unread)', '3rd book description should be correctly formatted')
  t.end()
})

test('When adding a book with no arguments', (t) => {
  const bookStore = bookStoreFactory()
  let error

  try {
    bookStore.add()
  } catch (err) {
    error = err
  }

  t.ok(error instanceof TypeError, 'it should throw a TypeError')
  t.end()
})

test('When adding a book an empty title', (t) => {
  const bookStore = bookStoreFactory()
  let error

  try {
    bookStore.add({title: '  '})
  } catch (err) {
    error = err
  }

  t.ok(error instanceof TypeError, 'it should throw a TypeError')
  t.end()
})

test('When adding a book an empty author', (t) => {
  const bookStore = bookStoreFactory()
  let error

  try {
    bookStore.add({author: '  '})
  } catch (err) {
    error = err
  }

  t.ok(error instanceof TypeError, 'it should throw a TypeError')
  t.end()
})

test('When marking a book as read', (t) => {
  const bookStore = bookStoreFactory()

  addAllBooks(bookStore)

  bookStore.read('Moby Dick')

  const list = bookStore.show()
  // ensure books list order for tests
  const listOrderedByTitle = list.sort()

  t.equal(listOrderedByTitle.length, 3, 'it should return an array of 3 book descriptions')
  t.equal(listOrderedByTitle[0],
    '"Moby Dick" by Herman Melville (read)', '1st book description should be correctly formatted')
  t.equal(listOrderedByTitle[1],
    '"Of Mice and Men" by John Steinbeck (unread)', '2nd book description should be correctly formatted')
  t.equal(listOrderedByTitle[2],
    '"The Grapes of Wrath" by John Steinbeck (unread)', '3rd book description should be correctly formatted')
  t.end()
})

test('When marking as read a book that doesn\'t exist', (t) => {
  const bookStore = bookStoreFactory()
  let error

  try {
    bookStore.read('American Gods')
  } catch (err) {
    error = err
  }

  t.ok(error instanceof NotFoundError, 'it should throw a NotFoundError')
  t.end()
})

test('When adding a book with same title twice', (t) => {
  const bookStore = bookStoreFactory()
  let error

  bookStore.add({
    title: 'The Grapes of Wrath',
    author: 'John Steinbeck'
  })

  try {
    bookStore.add({
      title: 'The Grapes of Wrath',
      author: 'John Doe'
    })
  } catch (err) {
    error = err
  }

  t.ok(error instanceof DuplicateError, 'it should throw a DuplicateError')

  t.end()
})

test('When requesting books by author', (t) => {
  const bookStore = bookStoreFactory()

  addAllBooks(bookStore)

  const list = bookStore.showFiltered({byAuthor: 'John Steinbeck'})
  // ensure books list order for tests
  const listOrderedByTitle = list.sort()

  t.equal(listOrderedByTitle.length, 2, 'it should return an array of 2 book descriptions')
  t.equal(listOrderedByTitle[0],
    '"Of Mice and Men" by John Steinbeck (unread)', '1st book description should be correctly formatted')
  t.equal(listOrderedByTitle[1],
    '"The Grapes of Wrath" by John Steinbeck (unread)', '2nd book description should be correctly formatted')
  t.end()
})

test('When requesting unread books by author', (t) => {
  const bookStore = bookStoreFactory()

  addAllBooks(bookStore)
  bookStore.read('The Grapes of Wrath')

  const list = bookStore.showFiltered({byAuthor: 'John Steinbeck', readStatus: 'unread'})

  t.equal(list.length, 1, 'it should return an array of one book descriptions')
  t.equal(list[0],
    '"Of Mice and Men" by John Steinbeck (unread)', 'book description should be correctly formatted')
  t.end()
})

test('When requesting read books by author', (t) => {
  const bookStore = bookStoreFactory()

  addAllBooks(bookStore)
  bookStore.read('The Grapes of Wrath')

  const list = bookStore.showFiltered({byAuthor: 'John Steinbeck', readStatus: 'read'})

  t.equal(list.length, 1, 'it should return an array of one book descriptions')
  t.equal(list[0],
    '"The Grapes of Wrath" by John Steinbeck (read)', 'book description should be correctly formatted')
  t.end()
})

test('When requesting unread books', (t) => {
  const bookStore = bookStoreFactory()

  addAllBooks(bookStore)
  bookStore.read('The Grapes of Wrath')

  const list = bookStore.showFiltered({readStatus: 'unread'})
  // ensure books list order for tests
  const listOrderedByTitle = list.sort()

  t.equal(listOrderedByTitle.length, 2, 'it should return an array of 2 book descriptions')
  t.equal(listOrderedByTitle[0],
    '"Moby Dick" by Herman Melville (unread)', '1st book description should be correctly formatted')
  t.equal(listOrderedByTitle[1],
    '"Of Mice and Men" by John Steinbeck (unread)', '2nd book description should be correctly formatted')
  t.end()
})

test('When requesting read books', (t) => {
  const bookStore = bookStoreFactory()

  addAllBooks(bookStore)
  bookStore.read('The Grapes of Wrath')

  const list = bookStore.showFiltered({readStatus: 'read'})
  // ensure books list order for tests
  const listOrderedByTitle = list.sort()

  t.equal(listOrderedByTitle.length, 1, 'it should return an array of 1 book descriptions')
  t.equal(listOrderedByTitle[0],
    '"The Grapes of Wrath" by John Steinbeck (read)', '1st book description should be correctly formatted')
  t.end()
})
