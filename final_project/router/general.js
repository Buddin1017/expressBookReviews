const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
    }
  
    if (isValid(username)) {
      return res.status(409).json({message: "Username already exists"});
    }
  
    users.push({username: username, password: password});
  
    return res.status(200).json({message: "User successfully registered"});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn], null, 4));
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let result = {};
  
    Object.keys(books).forEach((key) => {
      if (books[key].author === author) {
        result[key] = books[key];
      }
    });
  
    return res.send(JSON.stringify(result, null, 4));
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let result = {};
  
    Object.keys(books).forEach((key) => {
      if (books[key].title === title) {
        result[key] = books[key];
      }
    });
  
    return res.send(JSON.stringify(result, null, 4));
  });

// Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
  
    if (books[isbn]) {
      return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  });

module.exports.general = public_users;
