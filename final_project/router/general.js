const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

const asyncGetBooks = () => {
  return new Promise((resolve, reject) => {
    if (!books) {
      reject({ message: 'No books found' });
    } else {
      resolve(books);
    }
  });
};

const asyncGetBook = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (!book) {
      reject({ message: 'Book not found' });
    } else {
      resolve(book);
    }
  });
};

const asyncGetBooksByAuthor = (author) => {
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

const asyncGetBooksByTitle = (title) => {
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

// Tarefa 6: Registro de novos usuários
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

// Tarefa 10: Obter a lista de livros disponíveis na loja
public_users.get('/', function (req, res) {
  asyncGetBooks()
    .then((books) => res.send({ books }))
    .catch((error) => res.status(404).json(error));
});

// Tarefa 11: Obter detalhes do livro com base no ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  asyncGetBook(req.params.isbn)
    .then((book) => res.send(JSON.stringify(book, null, 4)))
    .catch((error) => res.status(404).json(error));
});

// Tarefa 12: Obter detalhes do livro com base no autor
public_users.get('/author/:author', function (req, res) {
  asyncGetBooksByAuthor(req.params.author)
    .then((books) => res.send(JSON.stringify(books, null, 4)))
    .catch((error) => res.status(404).json(error));
});

// Tarefa 13: Obter todos os livros com base no título
public_users.get('/title/:title', function (req, res) {
  asyncGetBooksByTitle(req.params.title)
    .then((books) => res.send(JSON.stringify(books, null, 4)))
    .catch((error) => res.status(404).json(error));
});

// Tarefa 5: Obter a revisão do livro
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  const reviews = book.reviews;
  res.send(JSON.stringify(reviews, null, 4));
});
