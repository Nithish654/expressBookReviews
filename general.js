// @ts-nocheck
const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");

const public_users = express.Router();

/***********************
 *  TASK 1 — GET ALL BOOKS
 ***********************/
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

/***********************
 *  TASK 2 — GET BY ISBN
 ***********************/
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn]);
});

/***********************
 *  TASK 3 — GET BY AUTHOR
 ***********************/
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  let result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  });

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }

  return res.status(200).json(result);
});

/***********************
 *  TASK 4 — GET BY TITLE
 ***********************/
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  let result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  });

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "No books found with this title" });
  }

  return res.status(200).json(result);
});

/***********************
 *  TASK 5 — GET REVIEWS
 ***********************/
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn].reviews);
});

/*********** TASKS 10–13 ************/

/***********************
 * TASK 10 — ASYNC/AWAIT + AXIOS GET ALL BOOKS
 ***********************/
public_users.get("/async/books", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

/***********************
 * TASK 11 — PROMISE CALLBACK + AXIOS GET BY ISBN
 ***********************/
public_users.get("/async/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  axios
    .get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => res.status(200).json(response.data))
    .catch(() => res.status(404).json({ message: "Book not found" }));
});

/***********************
 * TASK 12 — PROMISE CALLBACK + AXIOS GET BY AUTHOR
 ***********************/
public_users.get("/async/author/:author", (req, res) => {
  const author = req.params.author;

  axios
    .get(`http://localhost:5000/author/${author}`)
    .then((response) => {
      if (Object.keys(response.data).length === 0) {
        return res
          .status(404)
          .json({ message: "No books found for this author" });
      }
      return res.status(200).json(response.data);
    })
    .catch(() =>
      res.status(500).json({ message: "Error retrieving books by author" }),
    );
});

/***********************
 * TASK 13 — ASYNC/AWAIT + AXIOS GET BY TITLE
 ***********************/
public_users.get("/async/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);

    if (Object.keys(response.data).length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

module.exports.general = public_users;
