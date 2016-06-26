#! /usr/bin/env node
'use strict'

const parseRequest = require('./lib/parse_request')
const bookStore = require('./lib/book_store')()

const write = (txt) => process.stdout.write(`${txt}\n`)
const rl = require('readline').createInterface(
  process.stdin,
  process.stdout
)

function showPrompt () {
  rl.setPrompt('> ')
  rl.prompt()
}

write('Welcome to your library!')

showPrompt()

rl.on('line', (line) => {
  const [action, ...params] = parseRequest(line)

  switch (action) {
    case 'add':
      try {
        bookStore.add({
          title: params[0],
          author: params[1]
        })
      } catch (err) {
        write(`error: ${err.message}`)
      }
      break
    case 'read':
      try {
        bookStore.read(params[0])
      } catch (err) {
        write(`error: ${err.message}`)
      }
      break
    case 'show all':
      const books = bookStore.show()
      if (books.length) {
        books.forEach((b) => write(`${b}`))
      } else {
        write('no books in your library')
      }
      break
    case 'show unread':
      try {
        const books = bookStore.showFiltered({readStatus: 'unread'})
        if (books.length) {
          books.forEach((b) => write(`${b}`))
        } else {
          write('no unread books in your library')
        }
      } catch (err) {
        write(`error: ${err.message}`)
      }
      break
    case 'show all by':
      try {
        const books = bookStore.showFiltered({byAuthor: params[0] || ''})
        if (books.length) {
          books.forEach((b) => write(`${b}`))
        } else {
          write(`no books by "${params[0]}" in your library`)
        }
      } catch (err) {
        write(`error: ${err.message}`)
      }
      break
    case 'show unread by':
      try {
        const books = bookStore.showFiltered({
          readStatus: 'unread',
          byAuthor: params[0] || ''
        })
        if (books.length) {
          books.forEach((b) => write(`${b}`))
        } else {
          write(`no unread books by "${params[0]}" in your library`)
        }
      } catch (err) {
        write(`error: ${err.message}`)
      }
      break
    case 'quit':
      write('bye!')
      process.exit(0)
      break
    case 'help':
      write('available commands are:')
      write('')
      write('add "$title" "$author"')
      write('\tadds a book to the library with the given title and author. All books are unread by default.')
      write('')
      write('read "$title"')
      write('\tmarks a given book as read.')
      write('')
      write('show all')
      write('\tdisplays all of the books in the library')
      write('')
      write('show unread')
      write('\tdisplays all of the books that are unread')
      write('')
      write('show all by "$author"')
      write('\tshows all of the books in the library by the given author')
      write('')
      write('show unread by "$author"')
      write('\tshows the unread books in the library by the given author')
      write('')
      write('quit')
      write('\tquits the programm')
      write('')
      write('help')
      write('\tthis current commands list')
      break
    default:
      write('unknown command: type `help` to display available commands')
  }

  showPrompt()
})
