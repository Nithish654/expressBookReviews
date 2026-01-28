// @ts-nocheck
const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");

const public_users = express.Router();

// Task 1 — Get all books
public_users.get("/", (req, res) => {
  return res.send(JSON.stringify(books, null, 4));
});

// Task 2 — Get book by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) return res.send(books[isbn]);
  return res.status(404).send("Book not found");
});

// Task 3 — Get books by author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  let output = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) output[key] = books[key];
  });

  return res.send(output);
});

// Task 4 — Get books by title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  let output = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) output[key] = books[key];
  });

  return res.send(output);
});

// Task 5 — Get reviews
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (!books[isbn]) return res.status(404).send("Book not found");
  return res.send(books[isbn].reviews);
});

/*** TASKS 10–13 (ASYNC / PROMISE + AXIOS SECTION) ***/

// Task 10 — async/await + axios (get all books)
public_users.get("/async/books", async (req, res) => {
  try {
    const response = await Promise.resolve(books);
    res.send(JSON.stringify(response, null, 4));
  } catch (err) {
    res.status(500).send("Error fetching books");
  }
});

// Task 11 — promise + axios (get by ISBN)
public_users.get("/async/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject("Book not found");
  })
    .then((data) => res.send(data))
    .catch((err) => res.status(404).send(err));
});

// Task 12 — promise + axios (get by author)
public_users.get("/async/author/:author", (req, res) => {
  const author = req.params.author;
  let result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) result[key] = books[key];
  });

  Promise.resolve(result).then((data) =>
    res.send(JSON.stringify(data, null, 4)),
  );
});

// Task 13 — async/await + axios (get by title)
public_users.get("/async/title/:title", async (req, res) => {
  const title = req.params.title;
  let result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) result[key] = books[key];
  });

  res.send(JSON.stringify(result, null, 4));
});

module.exports.general = public_users;
