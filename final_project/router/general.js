const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', function (req, res) {
	const { username, password } = req.body;
  
	// Check if both fields are provided
	if (!username || !password) {
	  return res.status(400).json({
		message: "Username and password are required for registration."
	  });
	}
  
	// Check if username already exists
	const userExists = users.some(user => user.username === username);
	if (userExists) {
	  return res.status(409).json({
		message: "Username already exists. Please choose a different one."
	  });
	}
  
	// Register the user
	users.push({ username, password });
  
	return res.status(200).json({
	  message: "User registered successfully!"
	});
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (!books[isbn])
	return (res.status(404).join({message: "Book not found for the given ISBN."}))
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let matchedBooks = [];

  for (let key in books)
  {
	if (books[key].author.toLowerCase() === author.toLowerCase())
		matchedBooks.push(books[key]);
  }
  if (matchedBooks.length === 0)
		return (res.status(404).join({message: "Book not found for the given author."}));

  return res.status(200).json(matchedBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let matchedTitles = [];

  for (let key in books)
  {
	if (books[key].title.toLowerCase() === title.toLowerCase())
		matchedTitles.push(books[key]);
  }

  if (matchedTitles.length === 0)
	return (res.status(404).json({message: "Book not found for the given title."}));
return res.status(200).json(matchedTitles);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
	let isbn = req.params.isbn;
	
	if (!books[isbn])
		return (res.status(404).json({message: "Book not found for the given ISBN."}));
	
	let reviews = books[isbn].reviews;
  return res.status(200).json(reviews);
});

module.exports.general = public_users;
