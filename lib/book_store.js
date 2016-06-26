'use strict'

const {
  DuplicateError,
  NotFoundError
} = require('./errors')

/** constant {String} */
const READ = 'read'
/** constant {String} */
const UNREAD = 'unread'

const validate = {
  title (title) {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new TypeError('title must be a non empty string')
    }
  },

  author (author) {
    if (typeof author !== 'string' || author.trim() === '') {
      throw new TypeError('author must be a non empty string')
    }
  },

  readStatus (status) {
    if (status !== READ && status !== UNREAD) {
      throw new TypeError(`readStatus must be ${READ} or ${UNREAD}`)
    }
  }
}

/**
 * Store and request book
 *
 * Impossible to store two books with same title
 */
class BookStore {
  constructor () {
    this.store = new Map()
  }

  /**
   * Add a book
   *
   * @param {Object} book
   * @param {String} book.title title of added book
   * @param {String} book.author author of added book
   * @throws {TypeError} if title or author are not (non empty) strings
   * @throws {DuplicateError}
   */
  add ({ title, author } = {}) {
    validate.title(title)
    validate.author(author)

    if (this.store.has(title)) {
      throw new DuplicateError(`"${title}" already exists`)
    }

    this.store.set(title, {
      author,
      read: false
    })
  }

  /**
   * Mark a book as read
   *
   * @param {String} title title of book you want to mark as read
   * @throws {TypeError} if title is not a (non empty) string
   * @throws {NotFoundError} if store contains no book with such title
   */
  read (title) {
    validate.title(title)

    let book = this.store.get(title)
    if (!book) {
      throw new NotFoundError(`No books with title "${title}"`)
    } else {
      book.read = true
    }
  }

  /**
   * Filter store by read status and/or author
   *
   * @param {Object} filter
   * @param {(READ|UNREAD)} filter.readStatus
   * @param {String} filter.byAuthor
   * @return {Map} filtered store
   */
  filter ({ readStatus, byAuthor } = {}) {
    if (typeof byAuthor !== 'undefined') validate.author(byAuthor)
    if (typeof readStatus !== 'undefined') validate.readStatus(readStatus)

    let filteredStore

    if (!readStatus && !byAuthor) {
      filteredStore = this.store
    } else {
      filteredStore = new Map(
        [...this.store]
        .filter(([title, infos]) => readStatus ? infos.read === (readStatus === READ) : true)
        .filter(([title, infos]) => byAuthor ? infos.author === byAuthor : true)
      )
    }

    return filteredStore
  }

  /**
   * Display store
   *
   * @return {String[]} Collection of book descriptions
   */
  show () {
    return this.showFiltered()
  }

  /**
   * Display filtered store
   *
   * @param {Object} filter
   * @param {(READ|UNREAD)} filter.readStatus
   * @param {String} filter.byAuthor
   * @return {String[]} Collection of book descriptions
   */
  showFiltered ({ readStatus, byAuthor } = {}) {
    if (typeof byAuthor !== 'undefined') validate.author(byAuthor)
    if (typeof readStatus !== 'undefined') validate.readStatus(readStatus)

    const filteredStore = this.filter({ readStatus, byAuthor })

    return [...filteredStore]
    .map(([title, infos]) => `"${title}" by ${infos.author} (${infos.read ? 'read' : 'unread'})`)
  }

}

module.exports = () => new BookStore()
