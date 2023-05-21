const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

//Task 10 - Promise
const promiseGetBooks = () => {
  return new Promise((resolve, reject) => {
    if (!books) {
      reject({ message: 'No books found' });
    } else {
      resolve(books);
    }
  });
};

//Task 11 - Promise
const promiseGetBook = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (!book) {
      reject({ message: 'Book not found' });
    } else {
      resolve(book);
    }
  });
};

//Task 12 - Promise
const promiseGetBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(
      (book) => book.author === author
    );
    if (booksByAuthor.length === 0) {
      reject({ message: 'No books found by this author' });
    } else {
      resolve(booksByAuthor);
    }
  });
};

//Task 13 - Promise
const promiseGetBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(
      (book) => book.title === title
    );
    if (booksByTitle.length === 0) {
      reject({ message: 'No books found with this title' });
    } else {
      resolve(booksByTitle);
    }
  });
};

// Task 6: Complete the code for registering a new user
public_users.post('/register', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  users.push({ username, password });

  res.status(200).send(`The user ${username} has been added!`);
});

/*
Task 10.
Add the code for getting the list of books available in the shop
(done in Task 1) using Promise callbacks or async-await with Axios.
*/
public_users.get('/', function (req, res) {
  promiseGetBooks()
    .then((books) => res.send({ books }))
    .catch((error) => res.status(404).json(error));
});

/*
Task 11.
Add the code for getting the book details based on ISBN (done in Task 2)
using Promise callbacks or async-await with Axios.
*/
public_users.get('/isbn/:isbn', function (req, res) {
  promiseGetBook(req.params.isbn)
    .then((book) => res.send(JSON.stringify(book, null, 4)))
    .catch((error) => res.status(404).json(error));
});

/*
Task 12.
Add the code for getting the book details based on Author (done in Task 3)
using Promise callbacks or async-await with Axios.
*/
public_users.get('/author/:author', function (req, res) {
  promiseGetBooksByAuthor(req.params.author)
    .then((books) => res.send(JSON.stringify(books, null, 4)))
    .catch((error) => res.status(404).json(error));
});

/*
Task 13.
Add the code for getting the book details based on Title (done in Task 4)
using Promise callbacks or async-await with Axios.
*/
public_users.get('/title/:title', function (req, res) {
  promiseGetBooksByTitle(req.params.title)
    .then((books) => res.send(JSON.stringify(books, null, 4)))
    .catch((error) => res.status(404).json(error));
});

// Task 5: Complete the code for getting book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  const reviews = book.reviews;
  res.send(JSON.stringify(reviews, null, 4));
});

module.exports.general = public_users;
