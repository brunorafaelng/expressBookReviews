const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

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

// Tarefa 1: Obter a lista de livros disponíveis na loja
public_users.get('/', function (req, res) {
  // res.send(JSON.stringify(books, null, 4));
  // res.send({ books });
  res.send({ users });
  // res.send({ books: books, users: users });
});

// Tarefa 2: Obter detalhes do livro com base no ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.send(JSON.stringify(book, null, 4));
});

// Tarefa 3: Obter detalhes do livro com base no autor
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

// Tarefa 4: Obter todos os livros com base no título
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
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  const reviews = book.reviews;
  res.send(JSON.stringify(reviews, null, 4));
});

module.exports.general = public_users;
