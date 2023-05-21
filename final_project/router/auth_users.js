const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Task 10 - Complete the code for logging in as a registered user.
regd_users.post('/login', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: username }, 'access', {
      expiresIn: 60 * 60,
    });

    req.session.authorization = {
      accessToken,
      username,
    };

    // send JWT in response
    return res.status(200).json({
      message: 'User successfully logged in',
      token: accessToken,
    });
  } else {
    return res
      .status(403)
      .json({ message: 'Invalid Login. Check username and password' });
  }
});

//Task 8 - Complete the code for adding or modifying a book review.
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.body.review;

  if (!username || !review) {
    return res.status(400).json({
      message: 'Unable to add review. Login and review are required.',
    });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: 'Review added/updated successfully' });
});

//Task 9 - Complete the code for deleting a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!username) {
    return res
      .status(400)
      .json({ message: 'Unable to delete review. Login is required.' });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: 'Review not found' });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: 'Review deleted successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
