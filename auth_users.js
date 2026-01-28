// @ts-nocheck
const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check if username exists
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// Validate credentials
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password,
  );
};

// -------------------------
// TASK 6 - REGISTER USER
// -------------------------
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User created successfully" });
});

// -------------------------
// TASK 7 - LOGIN + JWT
// -------------------------
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, "access_key", { expiresIn: "1h" });

  req.session.authorization = {
    token,
    username,
  };

  return res.status(200).json({ message: "User logged in successfully" });
});

// -------------------------
// TASK 8 - ADD / MODIFY REVIEW
// -------------------------
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "Login required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

// -------------------------
// TASK 9 - DELETE REVIEW
// -------------------------
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "Login required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
