// @ts-nocheck
const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");

const public_users = express.Router();

// TASK 1
public_users.get("/", (req, res) => {
  res.status(200).json(books);
});

// TASK 2
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  books[isbn] ? res.json(books[isbn]) : res.status(404).json({ message: "Book not found" });
});

// TASK 3
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const result = Object.fromEntries(
    Object.entries(books).filter(([k, v]) => v.author === author)
  );
  Object.keys(result).length ? res.json(result) : res.status(404).json({ message: "No books found for this author" });
});

// TASK 4
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const result = Object.fromEntries(
    Object.entries(books).filter(([k, v]) => v.title === title)
  );
  Object.keys(result).length ? res.json(result) : res.status(404).json({ message: "No books found with this title" });
});

// TASK 5
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  books[isbn] ? res.json(books[isbn].reviews) : res.status(404).json({ message: "Book not found" });
});

// TASK 10 (async/await + axios)
public_users.get("/async/books", async (req, res) => {
  try {
    const data = await axios.get("http://localhost:5000/");
    res.json(data.data);
  } catch {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// TASK 11 (promise + axios ISBN)
public_users.get("/async/isbn/:isbn", (req, res) => {
  axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(r => res.json(r.data))
    .catch(() => res.status(404).json({ message: "Book not found" }));
});

// TASK 12 (promise + axios Author)
public_users.get("/async/author/:author", (req, res) => {
  axios.get(`http://localhost:5000/author/${req.params.author}`)
    .then(r => res.json(r.data))
    .catch(() => res.status(404).json({ message: "No books found for this author" }));
});

// TASK 13 (async/await + axios Title)
public_users.get("/async/title/:title", async (req, res) => {
  try {
    const data = await axios.get(`http://localhost:5000/title/${req.params.title}`);
    res.json(data.data);
  } catch {
    res.status(404).json({ message: "No books found with this title" });
  }
});

module.exports.general = public_users;
