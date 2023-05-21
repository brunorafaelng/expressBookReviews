const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

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
  // res.send({ books });
  res.send({ users });
});

// Tarefa 11: Obter detalhes do livro com base no ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  asyncGetBook(req.params.isbn)
    .then((book) => res.send(JSON.stringify(book, null, 4)))
    .catch((error) => res.status(404).json(error));
});

// Tarefa 12: Obter detalhes do livro com base no autor
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );
  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: 'No books found by this author' });
  }
  res.send(JSON.stringify(booksByAuthor, null, 4));
});

// Tarefa 13: Obter todos os livros com base no título
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(
    (book) => book.title === title
  );
  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: 'No books found with this title' });
  }
  res.send(JSON.stringify(booksByTitle, null, 4));
});

// Tarefa 5: Obter a revisão do livro
public_users.get('/review/:isbn', function (req, res) {
  asyncGetBook(req.params.isbn)
    .then((book) => res.send(JSON.stringify(book.reviews, null, 4)))
    .catch((error) => res.status(404).json(error));
});

module.exports.general = public_users;
